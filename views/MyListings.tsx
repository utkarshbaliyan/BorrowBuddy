
import React from 'react';
import { Item, User } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ArrowLeft, Package, Plus, Trash2 } from 'lucide-react';

interface MyListingsProps {
  user: User;
  items: Item[];
  onItemClick: (item: Item) => void;
  onBack: () => void;
  onCreateNew: () => void;
  onDeleteItem: (itemId: string) => void;
}

export const MyListings: React.FC<MyListingsProps> = ({ user, items, onItemClick, onBack, onCreateNew, onDeleteItem }) => {
  const myItems = items.filter(item => item.sellerId === user.id);

  return (
    <div className="animate-fade-in">
       {/* Header */}
       <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
             <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Listings</h1>
       </div>

       {myItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
                <Package size={40} className="text-purple-500" />
             </div>
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active listings</h2>
             <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8">
                You haven't listed any items for rent or sale yet. Start earning today!
             </p>
             <button
                onClick={onCreateNew}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-purple-500/20"
             >
                <Plus size={20} /> Create Listing
             </button>
          </div>
       ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
             {myItems.map(item => (
                <div key={item.id} className="flex flex-col bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                  {/* We do not pass onDelete to ItemCard anymore, keeping the card pure for navigation */}
                  <ItemCard 
                    item={item} 
                    onClick={onItemClick} 
                  />
                  
                  <button
                    onClick={(e) => {
                       e.stopPropagation();
                       onDeleteItem(item.id);
                    }}
                    className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-95 text-sm font-bold group"
                  >
                    <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                    Delete Listing
                  </button>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};
