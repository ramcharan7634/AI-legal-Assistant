'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scale, 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  MessageSquare,
  FilePlus,
  Bot,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Risk Analyzer', href: '/dashboard/risk', icon: AlertTriangle },
  { name: 'Upload PDF', href: '/dashboard/upload', icon: FileText },
  { name: 'Summarizer', href: '/dashboard/summarize', icon: FileText },
  { name: 'Entity Extraction', href: '/dashboard/entities', icon: Bot },
  { name: 'Document Generator', href: '/dashboard/generator', icon: FilePlus },
  { name: 'GenAI Chat', href: '/dashboard/chat', icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 dark:bg-gray-900">
      <div className="flex items-center h-16 px-4 border-b border-gray-700">
        <Scale className="h-8 w-8 text-primary-500" />
        <span className="ml-2 text-xl font-bold text-white">Legal AI</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-colors mb-2"
        >
          {darkMode ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

