'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockUsers } from '@/data/mockData';
import { 
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function CreateGroupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedMembers: [mockUsers[0]?.id].filter(Boolean),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }

    if (formData.selectedMembers.length < 2) {
      newErrors.members = 'At least 2 members are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // In a real app, you would save this to your backend
    console.log('Creating group:', formData);
    
    // For now, just redirect to groups page
    router.push('/groups');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/groups"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Groups
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Group</h1>
          <p className="text-gray-600 mt-2">Start tracking expenses with your friends</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Group Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Trip to Manali, Apartment Rent"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the group..."
            />
          </div>

          {/* Select Members */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Members
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockUsers.map((user) => (
                <label
                  key={user.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.selectedMembers.includes(user.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedMembers.includes(user.id)}
                    onChange={() => handleMemberToggle(user.id)}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.members && <p className="text-red-600 text-sm mt-1">{errors.members}</p>}
            <p className="text-sm text-gray-500 mt-2">
              {formData.selectedMembers.length} member{formData.selectedMembers.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/groups"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 