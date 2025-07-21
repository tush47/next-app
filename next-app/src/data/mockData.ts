import { User, Group, Expense, Settlement } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/john.jpg' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatars/jane.jpg' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/avatars/mike.jpg' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/avatars/sarah.jpg' },
];

// Mock Groups
export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Trip to Manali',
    description: 'Weekend getaway with friends',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Apartment Rent',
    description: 'Monthly rent and utilities',
    members: [mockUsers[0], mockUsers[1]],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock Expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Hotel Booking',
    amount: 4500,
    paidBy: mockUsers[0],
    splitBetween: [mockUsers[0], mockUsers[1], mockUsers[2]],
    category: 'accommodation',
    date: new Date('2024-01-18'),
    notes: '3 nights at Mountain View Hotel',
    groupId: '1',
  },
  {
    id: '2',
    title: 'Dinner at Restaurant',
    amount: 1200,
    paidBy: mockUsers[1],
    splitBetween: [mockUsers[0], mockUsers[1], mockUsers[2]],
    category: 'food',
    date: new Date('2024-01-19'),
    notes: 'Local cuisine experience',
    groupId: '1',
  },
  {
    id: '3',
    title: 'Taxi to Airport',
    amount: 800,
    paidBy: mockUsers[2],
    splitBetween: [mockUsers[0], mockUsers[1], mockUsers[2]],
    category: 'transport',
    date: new Date('2024-01-20'),
    notes: 'Shared taxi ride',
    groupId: '1',
  },
];

// Mock Settlements
export const mockSettlements: Settlement[] = [
  {
    id: '1',
    fromUser: mockUsers[1],
    toUser: mockUsers[0],
    amount: 1500,
    date: new Date('2024-01-21'),
    groupId: '1',
  },
];

// Helper functions
export const getGroupById = (id: string) => mockGroups.find(group => group.id === id);
export const getExpensesByGroupId = (groupId: string) => mockExpenses.filter(expense => expense.groupId === groupId);
export const getSettlementsByGroupId = (groupId: string) => mockSettlements.filter(settlement => settlement.groupId === groupId); 