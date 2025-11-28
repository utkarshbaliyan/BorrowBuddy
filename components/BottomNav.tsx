import React from 'react';
import { ViewState } from '../types';
import { Home, Search, PlusCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
  const navItems = [
    { id: 'home' as ViewState, icon: Home, label: 'Home' },
    { id: 'marketplace' as ViewState, icon: Search, label: 'Browse' },
    { id: 'create' as ViewState, icon: PlusCircle, label: 'Sell/Rent' },
    { id: 'profile' as ViewState, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 z-50 pb-safe safe-area-inset-bottom transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isActive ? 'text-purple-600 dark:text-purple-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-purple-100 dark:bg-purple-500/10 translate-y-[-2px]' : ''}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium mt-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};