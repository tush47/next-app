import { User, Expense, Settlement } from '@/types';

export interface Balance {
  user: User;
  amount: number; // positive = owes money, negative = is owed money
}

export interface SettlementSuggestion {
  from: User;
  to: User;
  amount: number;
}

export function calculateBalances(
  members: User[],
  expenses: Expense[],
  settlements: Settlement[]
): Record<string, number> {
  const balances: Record<string, number> = {};
  
  // Initialize balances
  members.forEach(member => {
    balances[member.id] = 0;
  });

  // Calculate what each person paid
  expenses.forEach(expense => {
    balances[expense.paidBy.id] += expense.amount;
  });

  // Calculate what each person owes
  expenses.forEach(expense => {
    const perPersonShare = expense.amount / expense.splitBetween.length;
    expense.splitBetween.forEach(member => {
      balances[member.id] -= perPersonShare;
    });
  });

  // Apply settlements
  settlements.forEach(settlement => {
    balances[settlement.fromUser.id] -= settlement.amount;
    balances[settlement.toUser.id] += settlement.amount;
  });

  return balances;
}

export function generateSettlementSuggestions(
  members: User[],
  balances: Record<string, number>
): SettlementSuggestion[] {
  const suggestions: SettlementSuggestion[] = [];
  
  // Separate debtors and creditors
  const debtors = members.filter(member => balances[member.id] < 0);
  const creditors = members.filter(member => balances[member.id] > 0);

  const tempBalances = { ...balances };

  debtors.forEach(debtor => {
    const debt = Math.abs(tempBalances[debtor.id]);
    if (debt <= 0) return;

    creditors.forEach(creditor => {
      const credit = tempBalances[creditor.id];
      if (credit <= 0) return;

      const amount = Math.min(debt, credit);
      if (amount > 0) {
        suggestions.push({
          from: debtor,
          to: creditor,
          amount: Math.round(amount * 100) / 100
        });

        tempBalances[debtor.id] += amount;
        tempBalances[creditor.id] -= amount;
      }
    });
  });

  return suggestions;
}

export function getBalanceSummary(balances: Record<string, number>): {
  totalOwed: number;
  totalToReceive: number;
  isSettled: boolean;
} {
  const totalOwed = Object.values(balances)
    .filter(amount => amount < 0)
    .reduce((sum, amount) => sum + Math.abs(amount), 0);
    
  const totalToReceive = Object.values(balances)
    .filter(amount => amount > 0)
    .reduce((sum, amount) => sum + amount, 0);

  return {
    totalOwed,
    totalToReceive,
    isSettled: totalOwed === 0 && totalToReceive === 0
  };
} 