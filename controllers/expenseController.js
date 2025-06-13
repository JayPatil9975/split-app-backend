const Expense = require('../models/Expense');

// POST /expenses
exports.addExpense = async (req, res) => {
  try {
    const { amount, description, paid_by, split_between, split_type, splits } = req.body;

    if (!amount || amount <= 0 || !description || !paid_by) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    const expense = await Expense.create({
      amount,
      description,
      paid_by,
      split_between: split_between || [paid_by],
      split_type: split_type || 'equal',
      splits: splits || []
    });

    res.status(201).json({ success: true, data: expense, message: 'Expense added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ created_at: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
