
import React from 'react';
import { ViewState } from '../types';
import { Home, Search, PlusCircle, User, Sun, Moon, GraduationCap, MessageCircle } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onChange, theme, toggleTheme }) => {
  const navItems = [
    { id: 'home' as ViewState, icon: Home, label: 'Home' },
    { id: 'marketplace' as ViewState, icon: Search, label: 'Marketplace' },
    { id: 'create' as ViewState, icon: PlusCircle, label: 'Sell/Rent' },
    { id: 'profile' as ViewState, icon: User, label: 'Profile' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onChange('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-purple-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform">
            <GraduationCap size={20} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-emerald-400">
            Borrow Buddy
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-full border border-gray-200 dark:border-slate-800">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle & Mobile Action */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Inbox Button */}
          <button
            onClick={() => onChange('chat-list')}
            className={`p-2.5 rounded-full transition-colors border border-gray-200 dark:border-slate-800 ${currentView === 'chat-list' || currentView === 'chat-room' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'}`}
            aria-label="Messages"
          >
            <MessageCircle size={18} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-800"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <div className="md:hidden">
            <button 
              onClick={() => onChange('create')}
              className="bg-purple-600 text-white p-2 rounded-lg"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
