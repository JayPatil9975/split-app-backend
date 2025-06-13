const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  paid_by: { type: String, required: true },
  split_between: [{ type: String }],
  split_type: { type: String, enum: ['equal', 'exact', 'percentage'], default: 'equal' },
  splits: [{ type: Number }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
