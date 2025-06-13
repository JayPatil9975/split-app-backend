exports.simplifySettlements = (balances) => {
    const creditors = [];
    const debtors = [];
  
    for (let person in balances) {
      const bal = parseFloat(balances[person].toFixed(2));
      if (bal > 0) creditors.push({ person, amount: bal });
      else if (bal < 0) debtors.push({ person, amount: -bal });
    }
  
    const settlements = [];
  
    while (creditors.length && debtors.length) {
      let credit = creditors.pop();
      let debit = debtors.pop();
  
      const amount = Math.min(credit.amount, debit.amount);
      settlements.push({
        from: debit.person,
        to: credit.person,
        amount: parseFloat(amount.toFixed(2))
      });
  
      if (credit.amount > amount) creditors.push({ ...credit, amount: credit.amount - amount });
      if (debit.amount > amount) debtors.push({ ...debit, amount: debit.amount - amount });
    }
  
    return settlements;
  };
  