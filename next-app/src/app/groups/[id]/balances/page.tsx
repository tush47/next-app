'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGroupById, getExpensesByGroupId, getSettlementsByGroupId } from '@/data/mockData';
import { 
  ArrowLeftIcon, 
  CurrencyRupeeIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default async function BalancesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = getGroupById(id);
  
  if (!group) {
    notFound();
  }

  const expenses = getExpensesByGroupId(id);
  const settlements = getSettlementsByGroupId(id);
  
  // Calculate balances for each member
  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    
    // Initialize balances
    group.members.forEach(member => {
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
  };

  const balances = calculateBalances();
  
  // Separate debtors and creditors
  const debtors = group.members.filter(member => balances[member.id] < 0);
  const creditors = group.members.filter(member => balances[member.id] > 0);

  // Generate settlement suggestions
  const generateSettlements = () => {
    const suggestions: Array<{
      from: string;
      to: string;
      amount: number;
    }> = [];

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
            from: debtor.id,
            to: creditor.id,
            amount: Math.round(amount * 100) / 100
          });

          tempBalances[debtor.id] += amount;
          tempBalances[creditor.id] -= amount;
        }
      });
    });

    return suggestions;
  };

  const settlementSuggestions = generateSettlements();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/groups/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to {group.name}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Balances & Settlements</h1>
          <p className="text-gray-600 mt-2">View and settle outstanding balances in {group.name}</p>
        </div>

        {/* Current Balances */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Current Balances</h2>
            <p className="text-gray-600 mt-1">Positive amounts mean you're owed money, negative means you owe money</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {group.members.map((member) => {
                const balance = balances[member.id];
                const isPositive = balance >= 0;
                
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium mr-4">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">
                          {isPositive ? 'Is owed' : 'Owes'} ₹{Math.abs(balance).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}₹{balance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settlement Suggestions */}
        {settlementSuggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Suggested Settlements</h2>
              <p className="text-gray-600 mt-1">These payments would settle all outstanding balances</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {settlementSuggestions.map((suggestion, index) => {
                  const fromMember = group.members.find(m => m.id === suggestion.from);
                  const toMember = group.members.find(m => m.id === suggestion.to);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-sm font-medium text-red-600 mr-3">
                          {fromMember?.name.charAt(0)}
                        </div>
                        <ArrowRightIcon className="w-5 h-5 text-gray-400 mx-2" />
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-600 mr-3">
                          {toMember?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {fromMember?.name} → {toMember?.name}
                          </p>
                          <p className="text-sm text-gray-500">Settlement payment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{suggestion.amount.toLocaleString()}
                        </span>
                        <button className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                          Mark as Paid
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Settlements */}
        {settlements.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Settlements</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {settlements.map((settlement) => (
                  <div key={settlement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {settlement.fromUser.name} paid {settlement.toUser.name}
                        </p>
                        <p suppressHydrationWarning={true} className="text-sm text-gray-500">
                          {settlement.date.toISOString().slice(0, 10)}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{settlement.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State for Settlements */}
        {settlements.length === 0 && settlementSuggestions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All settled up!</h3>
            <p className="text-gray-600">Everyone's balances are settled in this group.</p>
          </div>
        )}
      </div>
    </div>
  );
} 