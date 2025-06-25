/**
 * Modelo de Pedido.
 * Armazena itens, status, total e referência ao usuário.
 * 
 * @module models/Pedido
 */

import mongoose from 'mongoose';

/**
 * Esquema de item dentro de um pedido.
 */
const itemSchema = new mongoose.Schema({
  /** Nome do item */
  nome: { type: String, required: true },

  /** Quantidade do item */
  quantidade: { type: Number, required: true },

  /** Preço unitário do item */
  preco: { type: Number, required: true }
}, { _id: false });

/**
 * Esquema de pedido principal.
 */
const pedidoSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  mesa: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['aberto', 'pagamento', 'fechado'],
    default: 'aberto'
  },
  itens: [itemSchema],
  total: {
    type: Number,
    required: true,
    default: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

/**
 * Middleware para calcular o total antes de salvar.
 */
pedidoSchema.pre('save', function (next) {
  this.total = this.itens.reduce((acc, item) => acc + item.quantidade * item.preco, 0);
  next();
});

/**
 * Middleware para recalcular o total ao atualizar os itens.
 */
pedidoSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.itens) {
    const total = update.itens.reduce((acc, item) => acc + item.quantidade * item.preco, 0);
    this.setUpdate({ ...update, total });
  }
  next();
});

/**
 * Modelo Mongoose para a coleção 'pedidos'.
 */
export const Pedido = mongoose.model('Pedido', pedidoSchema, 'pedidos');
