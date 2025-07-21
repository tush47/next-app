'use client';

import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Header /> */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Welcome to SplitMate</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Track, split, and settle expenses with friends. Create groups, add expenses, and keep your finances transparent and fair.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/groups" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">View Your Groups</a>
          <a href="/expenses" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">All Expenses</a>
        </div>
      </main>
    </div>
  );
}
