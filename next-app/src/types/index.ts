export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: User;
  splitBetween: User[];
  category: ExpenseCategory;
  date: Date;
  notes?: string;
  groupId: string;
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'other';

export interface Balance {
  user: User;
  amount: number; // positive = owes money, negative = is owed money
}

export interface Settlement {
  id: string;
  fromUser: User;
  toUser: User;
  amount: number;
  date: Date;
  groupId: string;
}

export interface GroupSummary {
  totalExpenses: number;
  balances: Balance[];
  recentExpenses: Expense[];
  recentSettlements: Settlement[];
} 