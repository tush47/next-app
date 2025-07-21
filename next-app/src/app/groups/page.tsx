'use client';

import Link from 'next/link';
import { mockGroups } from '@/data/mockData';
import { PlusIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';
export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Groups</h1>
            <p className="text-gray-600 mt-2">Manage expenses and settlements with your friends</p>
          </div>
          <Link
            href="/groups/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Group
          </Link>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGroups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {group.members.length} members
                  </span>
                </div>
                
                {group.description && (
                  <p className="text-gray-600 mb-4">{group.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    <span>{group.members.length} people</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{group.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Member Avatars */}
                <div className="flex items-center mt-4">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 3).map((member, index) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-700"
                      >
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {group.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        +{group.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {mockGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
            <p className="text-gray-600 mb-6">Create your first group to start tracking expenses with friends</p>
            <Link
              href="/groups/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Your First Group
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 