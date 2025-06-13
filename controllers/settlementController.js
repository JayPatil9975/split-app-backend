const Expense = require('../models/Expense');
const { simplifySettlements } = require('../utils/calculateSettlements');

exports.getPeople = async (req, res) => {
  const expenses = await Expense.find();
  const people = new Set();
  expenses.forEach(e => {
    people.add(e.paid_by);
    (e.split_between || []).forEach(p => people.add(p));
  });
  res.json({ success: true, data: Array.from(people) });
};

exports.getBalances = async (req, res) => {
  const expenses = await Expense.find();
  const balances = {};

  expenses.forEach(exp => {
    const participants = exp.split_between || [exp.paid_by];
    const n = participants.length;

    // Initialize
    participants.forEach(p => balances[p] = (balances[p] || 0));
    balances[exp.paid_by] = (balances[exp.paid_by] || 0);

    // Paid
    balances[exp.paid_by] += exp.amount;

    // Share
    if (exp.split_type === 'equal') {
      const share = exp.amount / n;
      participants.forEach(p => balances[p] -= share);
    }
    else if (exp.split_type === 'exact') {
      participants.forEach((p, i) => balances[p] -= exp.splits[i]);
    }
    else if (exp.split_type === 'percentage') {
      participants.forEach((p, i) => balances[p] -= (exp.splits[i] / 100) * exp.amount);
    }
  });

  res.json({ success: true, data: balances });
};

exports.getSettlementSummary = async (req, res) => {
  const expenses = await Expense.find();
  const balances = {};
  expenses.forEach(exp => {
    const participants = exp.split_between || [exp.paid_by];
    const n = participants.length;
    participants.forEach(p => balances[p] = (balances[p] || 0));
    balances[exp.paid_by] = (balances[exp.paid_by] || 0);
    balances[exp.paid_by] += exp.amount;

    if (exp.split_type === 'equal') {
      const share = exp.amount / n;
      participants.forEach(p => balances[p] -= share);
    } else if (exp.split_type === 'exact') {
      participants.forEach((p, i) => balances[p] -= exp.splits[i]);
    } else if (exp.split_type === 'percentage') {
      participants.forEach((p, i) => balances[p] -= (exp.splits[i] / 100) * exp.amount);
    }
  });

  const settlements = simplifySettlements(balances);
  res.json({ success: true, data: settlements });
};
