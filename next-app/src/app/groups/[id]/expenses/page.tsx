import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CurrencyRupeeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { dataService } from '@/services/dataService';

export default async function GroupExpensesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = await dataService.getGroupById(id);
  if (!group) notFound();
  const expenses = await dataService.getExpensesByGroupId(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href={`/groups/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to {group.name}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">All Expenses</h1>
          <p className="text-gray-600 mt-2">All expenses for <span className="font-semibold">{group.name}</span></p>
        </div>
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <CurrencyRupeeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
              <p className="text-gray-600 mb-6">Add your first expense to see it here.</p>
              <Link href={`/groups/${id}/expenses/new`} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Expense</Link>
            </div>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{expense.title}</p>
                  <p suppressHydrationWarning={true} className="text-sm text-gray-500">Paid by {expense.paidBy.name} • {expense.date.toISOString().slice(0, 10)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{expense.amount}</p>
                  <p className="text-sm text-gray-500">{expense.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 