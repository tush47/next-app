'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Group, User, ExpenseCategory } from '@/types';
import { dataService } from '@/utils/dataService';
import { 
  ArrowLeftIcon, 
  CurrencyRupeeIcon,
  UserIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import React from "react";

const expenseCategories: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'Food & Dining', icon: '🍽️' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'utilities', label: 'Utilities', icon: '⚡' },
  { value: 'other', label: 'Other', icon: '📝' },
];

export default function AddExpensePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [group, setGroup] = useState<Group | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'other' as ExpenseCategory,
    paidBy: '',
    splitBetween: [] as string[],
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupData, usersData] = await Promise.all([
          dataService.getGroupById(id),
          dataService.getUsers()
        ]);

        if (!groupData) {
          router.push('/404');
          return;
        }

        setGroup(groupData);
        setUsers(usersData);
        
        // Initialize form with group data
        setFormData(prev => ({
          ...prev,
          paidBy: groupData.members[0]?.id || '',
          splitBetween: groupData.members.map(member => member.id),
        }));
      } catch (err) {
        setError('Failed to load group data');
        console.error('Error fetching group data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSplitToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(memberId)
        ? prev.splitBetween.filter(id => id !== memberId)
        : [...prev.splitBetween, memberId]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.paidBy) {
      newErrors.paidBy = 'Please select who paid';
    }

    if (formData.splitBetween.length === 0) {
      newErrors.splitBetween = 'At least one person must be selected for splitting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const paidByUser = users.find(user => user.id === formData.paidBy);
      const splitBetweenUsers = users.filter(user => formData.splitBetween.includes(user.id));
      
      if (!paidByUser) {
        setErrors({ submit: 'Invalid user selected' });
        return;
      }

      const newExpense = await dataService.createExpense({
        title: formData.title,
        amount: parseFloat(formData.amount),
        paidBy: paidByUser,
        splitBetween: splitBetweenUsers,
        category: formData.category,
        date: new Date(formData.date),
        notes: formData.notes,
        groupId: id,
      });

      if (newExpense) {
        router.push(`/groups/${id}`);
      } else {
        setErrors({ submit: 'Failed to create expense. Please try again.' });
      }
    } catch (err) {
      console.error('Error creating expense:', err);
      setErrors({ submit: 'Failed to create expense. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading group data...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/groups/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to {group.name}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
          <p className="text-gray-600 mt-2">Record a new expense for {group.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Expense Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Dinner at Restaurant"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Amount and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                {expenseCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Paid By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid By
            </label>
            <div className="grid grid-cols-2 gap-3">
              {group.members.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.paidBy === member.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paidBy"
                    value={member.id}
                    checked={formData.paidBy === member.id}
                    onChange={(e) => handleInputChange('paidBy', e.target.value)}
                    className="sr-only text-black"
                  />
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium mr-3">
                    {member.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-500">{member.name}</span>
                </label>
              ))}
            </div>
            {errors.paidBy && <p className="text-red-600 text-sm mt-1">{errors.paidBy}</p>}
          </div>

          {/* Split Between */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split Between
            </label>
            <div className="grid grid-cols-2 gap-3">
              {group.members.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.splitBetween.includes(member.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.splitBetween.includes(member.id)}
                    onChange={() => handleSplitToggle(member.id)}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium mr-3">
                    {member.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-500">{member.name}</span>
                </label>
              ))}
            </div>
            {errors.splitBetween && <p className="text-red-600 text-sm mt-1">{errors.splitBetween}</p>}
          </div>

          {/* Date and Notes */}
          <div suppressHydrationWarning={true} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <input
                type="text"
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Additional details..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/groups/${id}`}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-lg transition-colors ${
                submitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Adding Expense...' : 'Add Expense'}
            </button>
          </div>
          {errors.submit && <p className="text-red-600 text-sm mt-2 text-center">{errors.submit}</p>}
        </form>
      </div>
    </div>
  );
} 