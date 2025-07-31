import { userApi, groupApi, expenseApi, settlementApi, balanceApi } from './api';
import { User, Group, Expense, Settlement, Balance, GroupSummary } from '@/types';

// Data service functions that ONLY use backend API
export const dataService = {
  // User functions
  getUsers: async (): Promise<User[]> => {
    return await userApi.getAll();
  },

  getUserById: async (id: string): Promise<User | null> => {
    return await userApi.getById(id);
  },

  // Group functions
  getGroups: async (): Promise<Group[]> => {
    return await groupApi.getAll();
  },

  getGroupById: async (id: string): Promise<Group | null> => {
    return await groupApi.getById(id);
  },

  createGroup: async (groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group | null> => {
    return await groupApi.create(groupData);
  },

  // Expense functions
  getExpenses: async (): Promise<Expense[]> => {
    return await expenseApi.getAll();
  },

  getExpensesByGroupId: async (groupId: string): Promise<Expense[]> => {
    return await expenseApi.getByGroupId(groupId);
  },

  createExpense: async (expenseData: Omit<Expense, 'id'>): Promise<Expense | null> => {
    return await expenseApi.create(expenseData);
  },

  // Settlement functions
  getSettlements: async (): Promise<Settlement[]> => {
    return await settlementApi.getAll();
  },

  getSettlementsByGroupId: async (groupId: string): Promise<Settlement[]> => {
    return await settlementApi.getByGroupId(groupId);
  },

  createSettlement: async (settlementData: Omit<Settlement, 'id'>): Promise<Settlement | null> => {
    return await settlementApi.create(settlementData);
  },

  // Balance functions
  getGroupBalances: async (groupId: string): Promise<Balance[]> => {
    return await balanceApi.getGroupBalances(groupId);
  },

  getGroupSummary: async (groupId: string): Promise<GroupSummary | null> => {
    return await balanceApi.getGroupSummary(groupId);
  },
}; 