import { User, Group, Expense, Settlement, Balance, GroupSummary } from '@/types';
import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// User API functions
export const userApi = {
  getAll: () => apiRequest<User[]>('/users'),
  getById: (id: string) => apiRequest<User>(`/users/${id}`),
  create: (user: Omit<User, 'id'>) => apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  update: (id: string, user: Partial<User>) => apiRequest<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
  delete: (id: string) => apiRequest<void>(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Group API functions
export const groupApi = {
  getAll: () => apiRequest<Group[]>('/groups'),
  getById: (id: string) => apiRequest<Group>(`/groups/${id}`),
  create: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => apiRequest<Group>('/groups', {
    method: 'POST',
    body: JSON.stringify(group),
  }),
  update: (id: string, group: Partial<Group>) => apiRequest<Group>(`/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(group),
  }),
  delete: (id: string) => apiRequest<void>(`/groups/${id}`, {
    method: 'DELETE',
  }),
  addMember: (groupId: string, userId: string) => apiRequest<Group>(`/groups/${groupId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  removeMember: (groupId: string, userId: string) => apiRequest<Group>(`/groups/${groupId}/members/${userId}`, {
    method: 'DELETE',
  }),
};

// Expense API functions
export const expenseApi = {
  getAll: () => apiRequest<Expense[]>('/expenses'),
  getById: (id: string) => apiRequest<Expense>(`/expenses/${id}`),
  getByGroupId: (groupId: string) => apiRequest<Expense[]>(`/groups/${groupId}/expenses`),
  create: (expense: Omit<Expense, 'id'>) => apiRequest<Expense>('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  }),
  update: (id: string, expense: Partial<Expense>) => apiRequest<Expense>(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  }),
  delete: (id: string) => apiRequest<void>(`/expenses/${id}`, {
    method: 'DELETE',
  }),
};

// Settlement API functions
export const settlementApi = {
  getAll: () => apiRequest<Settlement[]>('/settlements'),
  getById: (id: string) => apiRequest<Settlement>(`/settlements/${id}`),
  getByGroupId: (groupId: string) => apiRequest<Settlement[]>(`/groups/${groupId}/settlements`),
  create: (settlement: Omit<Settlement, 'id'>) => apiRequest<Settlement>('/settlements', {
    method: 'POST',
    body: JSON.stringify(settlement),
  }),
  update: (id: string, settlement: Partial<Settlement>) => apiRequest<Settlement>(`/settlements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(settlement),
  }),
  delete: (id: string) => apiRequest<void>(`/settlements/${id}`, {
    method: 'DELETE',
  }),
};

// Balance API functions
export const balanceApi = {
  getGroupBalances: (groupId: string) => apiRequest<Balance[]>(`/groups/${groupId}/balances`),
  getGroupSummary: (groupId: string) => apiRequest<GroupSummary>(`/groups/${groupId}/summary`),
};

export { API_BASE_URL }; 