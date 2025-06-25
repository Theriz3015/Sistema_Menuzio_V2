/**
 * Módulo de rotas para Pedidos.
 * Fornece endpoints para listar, deletar e atualizar pedidos,
 * além de um endpoint para gerar pedidos aleatórios para teste.
 * Requer autenticação para todas as operações.
 * * @module routes/pedido
 */

import { autenticarToken } from '../middlewares/auth.js';
import { Pedido } from '../models/pedido.js';
import express from 'express';

const router = express.Router();

/**
 * Rota GET / - Lista todos os pedidos do usuário autenticado.
 * * Esta rota retorna uma lista formatada de pedidos pertencentes ao usuário autenticado.
 * A resposta inclui ID, número do pedido, mesa, itens (nome e quantidade), valor total e status.
 * Requer um token de autenticação JWT válido.
 * * @function
 * @param {object} req - Objeto de requisição Express.
 * @param {string} req.userId - ID do usuário obtido do token de autenticação.
 * @param {object} res - Objeto de resposta Express.
 * @returns {Array<object>} 200 - Lista de pedidos formatados do usuário.
 * @returns {object} 500 - Erro genérico do servidor.
 * @throws {Error} Retorna um erro 500 se houver um problema ao buscar os pedidos.
 */
router.get('/', autenticarToken, async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.userId });

    const resposta = pedidos.map(p => ({
      id: p._id,
      title: `Pedido #${p.numero}`,
      mesa: `Mesa ${p.mesa.toString().padStart(2, '0')}`,
      itens: p.itens.map(i => ({
        nome: i.nome,
        quantidade: i.quantidade
      })),
      valor_total: p.total,
      status: p.status
    }));

    res.json(resposta);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pedidos', detalhe: err.message });
  }
});

/**
 * Rota DELETE /:id - Exclui um pedido específico do usuário autenticado.
 * * Esta rota permite a exclusão de um pedido com base no seu ID,
 * garantindo que apenas o proprietário do pedido possa excluí-lo.
 * Requer um token de autenticação JWT válido.
 * * @function
 * @param {object} req - Objeto de requisição Express.
 * @param {string} req.params.id - O ID do pedido a ser excluído.
 * @param {string} req.userId - ID do usuário obtido do token de autenticação.
 * @param {object} res - Objeto de resposta Express.
 * @returns {object} 200 - Mensagem de sucesso após a exclusão.
 * @returns {object} 404 - Se o pedido não for encontrado ou não pertencer ao usuário.
 * @returns {object} 500 - Erro genérico do servidor.
 * @throws {Error} Retorna um erro 500 se houver um problema ao excluir o pedido.
 */
router.delete('/:id', autenticarToken, async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndDelete({ _id: req.params.id, usuario: req.userId });

    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

    res.json({ message: 'Pedido excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir pedido', detalhe: err.message });
  }
});

/**
 * Rota PUT /:id/status - Atualiza o status de um pedido específico.
 * * Esta rota permite que o status de um pedido seja alterado para 'aberto', 'pagamento' ou 'fechado'.
 * Apenas o proprietário do pedido pode alterar seu status.
 * Requer um token de autenticação JWT válido.
 * * @function
 * @param {object} req - Objeto de requisição Express.
 * @param {string} req.params.id - O ID do pedido cujo status será atualizado.
 * @param {string} req.userId - ID do usuário obtido do token de autenticação.
 * @param {object} req.body - Corpo da requisição contendo o novo status.
 * @param {string} req.body.status - O novo status do pedido ('aberto', 'pagamento', 'fechado').
 * @returns {object} 200 - Mensagem de sucesso e o pedido atualizado.
 * @returns {object} 400 - Se o status fornecido for inválido.
 * @returns {object} 404 - Se o pedido não for encontrado ou não pertencer ao usuário.
 * @returns {object} 500 - Erro genérico do servidor.
 * @throws {Error} Retorna um erro 500 se houver um problema ao atualizar o status.
 */
router.put('/:id/status', autenticarToken, async (req, res) => {
  const { status } = req.body;

  if (!['aberto', 'pagamento', 'fechado'].includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }

  try {
    const pedido = await Pedido.findOneAndUpdate(
      { _id: req.params.id, usuario: req.userId },
      { status },
      { new: true }
    );

    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

    res.json({ message: 'Status atualizado com sucesso', pedido });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar status', detalhe: err.message });
  }
});

const itensBase = [
  { nome: 'Caldinho de Camarão', preco: 20 },
  { nome: 'Buchada de Bode', preco: 55 },
  { nome: 'Macaxeira com Charque', preco: 30 },
  { nome: 'Guaraná', preco: 6 },
  { nome: 'Caipirinha', preco: 15 }
];

/**
 * Rota POST /aleatorios - Gera um número especificado de pedidos aleatórios.
 * * Esta rota cria pedidos com itens e detalhes aleatórios para fins de teste.
 * O número de pedidos a serem gerados pode ser especificado via query parameter 'qtd'.
 * Cada pedido gerado é associado ao usuário autenticado.
 * Requer um token de autenticação JWT válido.
 * * @function
 * @param {object} req - Objeto de requisição Express.
 * @param {string} req.userId - ID do usuário obtido do token de autenticação.
 * @param {object} req.query - Parâmetros de consulta da requisição.
 * @param {string} [req.query.qtd='1'] - Número de pedidos aleatórios a serem gerados.
 * @param {object} res - Objeto de resposta Express.
 * @returns {object} 201 - Mensagem de sucesso e a lista de pedidos criados.
 * @returns {object} 500 - Erro genérico do servidor.
 * @throws {Error} Retorna um erro 500 se houver um problema ao criar os pedidos aleatórios.
 */
router.post('/aleatorios', autenticarToken, async (req, res) => {
  const quantos = parseInt(req.query.qtd) || 1;

  try {
    const pedidos = [];

    for (let i = 0; i < quantos; i++) {
      const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const mesa = Math.floor(Math.random() * 10) + 1;

      const qtdItens = Math.floor(Math.random() * 7) + 1;
      const itensSorteados = Array.from({ length: qtdItens }, () => {
        const item = itensBase[Math.floor(Math.random() * itensBase.length)];
        return {
          nome: item.nome,
          preco: item.preco,
          quantidade: Math.floor(Math.random() * 3) + 1
        };
      });

      const total = itensSorteados.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

      const pedido = new Pedido({
        numero,
        mesa,
        itens: itensSorteados,
        total,
        status: 'aberto',
        usuario: req.userId
      });

      await pedido.save();
      pedidos.push(pedido);
    }

    res.status(201).json({ message: `${pedidos.length} pedidos criados com sucesso.`, pedidos });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar pedidos aleatórios', detalhe: err.message });
  }
});

export default router;