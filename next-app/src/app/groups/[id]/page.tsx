'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Group, Expense, Settlement } from '@/types';
import { dataService } from '@/utils/dataService';
import { 
  PlusIcon, 
  CurrencyRupeeIcon, 
  UsersIcon, 
  CalendarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function GroupDashboard({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        const [groupData, expensesData, settlementsData] = await Promise.all([
          dataService.getGroupById(id),
          dataService.getExpensesByGroupId(id),
          dataService.getSettlementsByGroupId(id)
        ]);

        if (!groupData) {
          router.push('/404');
          return;
        }

        setGroup(groupData);
        setExpenses(expensesData);
        setSettlements(settlementsData);
      } catch (err) {
        setError('Failed to load group data');
        console.error('Error fetching group data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Group not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate balances (simplified - in real app, this would be more complex)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const perPersonShare = totalExpenses / group.members.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{group.name}</h1>
              {group.description && (
                <p className="text-gray-600 mt-2 text-sm sm:text-base">{group.description}</p>
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  <span>{group.members.length} members</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span suppressHydrationWarning={true}>Created {group.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Link
              href={`/groups/${id}/expenses/new`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Expense
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900"> 9{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Per Person</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900"> b9{perPersonShare.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Expenses</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{expenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Expenses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Expenses</h2>
                  <Link
                    href={`/groups/${id}/expenses`}
                    className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <CurrencyRupeeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No expenses yet</p>
                    <Link
                      href={`/groups/${id}/expenses/new`}
                      className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700"
                    >
                      Add your first expense
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{expense.title}</p>
                            <p suppressHydrationWarning={true} className="text-xs sm:text-sm text-gray-500">
                              Paid by {expense.paidBy.name}  2 {expense.date.toISOString().slice(0, 10)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base"> b9{expense.amount}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{expense.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Balances</h2>
                  <Link
                    href={`/groups/${id}/balances`}
                    className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                  >
                    Settle up
                  </Link>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {group.members.map((member) => {
                    // Simplified balance calculation
                    const memberExpenses = expenses.filter(e => e.paidBy.id === member.id);
                    const memberPaid = memberExpenses.reduce((sum, e) => sum + e.amount, 0);
                    const memberShare = perPersonShare;
                    const balance = memberPaid - memberShare;

                    return (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs sm:text-sm font-medium">
                            {member.name.charAt(0)}
                          </div>
                          <span className="ml-3 text-xs sm:text-sm font-medium text-gray-900">{member.name}</span>
                        </div>
                        <span className={`text-xs sm:text-sm font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {balance >= 0 ? '+' : ''} b9{balance.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 