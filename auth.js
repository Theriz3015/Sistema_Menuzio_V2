/**
 * @file Arquivo de rotas de autenticação para registro e login de usuários.
 * @module routes/auth
 * @author Sua Equipe
 */

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import User from "../models/user.js"; // Assumindo que o modelo User está em ../models/user.js

const router = express.Router();
const upload = multer(); // Configura o multer para lidar com dados multipart/form-data, incluindo arquivos.

/**
 * Rota para registrar um novo usuário no sistema.
 * Aceita nome, email, senha e, opcionalmente, uma foto.
 * @name POST /registro
 * @function
 * @memberof module:routes/auth
 * @param {Object} req - Objeto de requisição do Express.
 * @param {string} req.body.nome - Nome do usuário.
 * @param {string} req.body.email - Email do usuário (deve ser único).
 * @param {string} req.body.senha - Senha do usuário.
 * @param {Express.Multer.File} [req.file] - Arquivo da foto do usuário (opcional).
 * @param {Object} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Retorna um JSON com token JWT e dados do usuário ou uma mensagem de erro.
 * @throws {400} Se os campos obrigatórios não forem preenchidos ou o email já estiver registrado.
 * @throws {500} Se houver erro interno do servidor (ex: JWT_SECRET não definido, erro no salvamento).
 */
router.post("/registro", upload.single("foto"), async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("Erro: JWT_SECRET não está definido");
    return res.status(500).json({ erro: "Configuração interna do servidor, tente novamente." });
  }

  try {
    const userExistente = await User.findOne({ email });
    if (userExistente)
      return res.status(400).json({ erro: "Email já registrado." });

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new User({
      nome,
      email,
      senha: senhaCriptografada,
      foto: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : undefined,
    });

    await novoUsuario.save();

    const token = jwt.sign({ id: novoUsuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Preparar a foto para envio (base64)
    let fotoBase64 = null;
    if (novoUsuario.foto && novoUsuario.foto.data) {
      const buffer = novoUsuario.foto.data;
      const mimeType = novoUsuario.foto.contentType;
      fotoBase64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    res.status(200).json({
      token: token,
      nome: novoUsuario.nome,
      foto: fotoBase64, // pode ser null se não enviou foto
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro no registro", detalhe: err.message });
  }
});


/**
 * Rota para autenticar um usuário existente no sistema.
 * Verifica o email e a senha fornecidos e retorna um token JWT em caso de sucesso.
 * @name POST /login
 * @function
 * @memberof module:routes/auth
 * @param {Object} req - Objeto de requisição do Express.
 * @param {string} req.body.email - Email do usuário.
 * @param {string} req.body.senha - Senha do usuário.
 * @param {Object} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Retorna um JSON com token JWT e dados do usuário ou uma mensagem de erro.
 * @throws {400} Se o usuário não for encontrado.
 * @throws {401} Se a senha estiver incorreta.
 * @throws {500} Se houver erro interno do servidor.
 */
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario)
      return res.status(400).json({ erro: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Preparar a foto para envio (base64)
    let fotoBase64 = null;
    if (usuario.foto && usuario.foto.data) {
      const buffer = usuario.foto.data;
      const mimeType = usuario.foto.contentType;
      fotoBase64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    res.json({
      token,
      nome: usuario.nome,
      foto: fotoBase64, // pode ser null se não tiver foto
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro no login", detalhe: err.message });
  }
});

export default router;