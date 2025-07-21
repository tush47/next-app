'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UsersIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();
  const navigation = [
    { name: 'Groups', href: '/groups', icon: UsersIcon },
    { name: 'Expenses', href: '/expenses', icon: CurrencyRupeeIcon },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/groups" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <CurrencyRupeeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SplitMate</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
} 