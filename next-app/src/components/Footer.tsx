import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-gray-500 text-sm mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} SplitMate. All rights reserved.
        </div>
        <div className="flex space-x-4 text-sm">
          <Link href="/groups" className="text-blue-600 hover:underline">Groups</Link>
          <Link href="/expenses" className="text-blue-600 hover:underline">Expenses</Link>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
        </div>
      </div>
    </footer>
  );
} 