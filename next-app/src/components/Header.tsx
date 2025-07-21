import Link from 'next/link';
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/groups" className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <CurrencyRupeeIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">SplitMate</span>
        </Link>
        <span className="text-sm text-gray-500 font-medium hidden sm:block">Track, Split, and Settle Expenses with Friends</span>
      </div>
    </header>
  );
} 