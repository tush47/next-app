'use client';

import Link from 'next/link';
import { mockExpenses, mockGroups } from '@/data/mockData';
import { 
  CurrencyRupeeIcon, 
  CalendarIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const expenseCategories: Record<string, { label: string; icon: string; color: string }> = {
  food: { label: 'Food & Dining', icon: '🍽️', color: 'bg-orange-100 text-orange-600' },
  transport: { label: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
  accommodation: { label: 'Accommodation', icon: '🏨', color: 'bg-purple-100 text-purple-600' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-600' },
  shopping: { label: 'Shopping', icon: '🛍️', color: 'bg-green-100 text-green-600' },
  utilities: { label: 'Utilities', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
  other: { label: 'Other', icon: '📝', color: 'bg-gray-100 text-gray-600' },
};

export default function ExpensesPage() {
  // Group expenses by group
  const expensesByGroup = mockExpenses.reduce((acc, expense) => {
    const group = mockGroups.find(g => g.id === expense.groupId);
    if (!group) return acc;
    
    if (!acc[group.id]) {
      acc[group.id] = { group, expenses: [] };
    }
    acc[group.id].expenses.push(expense);
    return acc;
  }, {} as Record<string, { group: any; expenses: any[] }>);

  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Expenses</h1>
          <p className="text-gray-600 mt-2">Track all your expenses across all groups</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TagIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{mockExpenses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Groups</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(expensesByGroup).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses by Group */}
        <div className="space-y-8">
          {Object.values(expensesByGroup).map(({ group, expenses }) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{group.name}</h2>
                    <p className="text-gray-600 mt-1">{group.description}</p>
                  </div>
                  <Link
                    href={`/groups/${group.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Group
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {expenses.map((expense) => {
                    const category = expenseCategories[expense.category];
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">{expense.title}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                {category.icon} {category.label}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <UserIcon className="w-4 h-4 mr-1" />
                                Paid by {expense.paidBy.name}
                              </span>
                              <span suppressHydrationWarning={true}  className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                {expense.date.toLocaleDateString()}
                              </span>
                            </div>
                            {expense.notes && (
                              <p className="text-sm text-gray-500 mt-1">{expense.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">₹{expense.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">
                            Split between {expense.splitBetween.length} people
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockExpenses.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CurrencyRupeeIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600 mb-6">Start adding expenses to your groups to see them here</p>
            <Link
              href="/groups"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowRightIcon className="w-5 h-5 mr-2" />
              Go to Groups
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 