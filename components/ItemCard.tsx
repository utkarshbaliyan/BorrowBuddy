
import React from 'react';
import { Item } from '../types';
import { Tag, IndianRupee, Clock, Trash2 } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onClick: (item: Item) => void;
  onDelete?: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, onDelete }) => {
  return (
    <div 
      onClick={() => onClick(item)}
      className="group glass-panel rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/30 relative"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={item.images[0]} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
        />
        
        {/* Delete Button (if permitted) */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onDelete(item.id);
            }}
            className="absolute top-2 left-2 z-20 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110"
            title="Delete Listing"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        )}

        <div className="absolute top-2 right-2 flex gap-1">
          {item.type !== 'sell' && (
            <span className="bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-sm">
              <Clock size={12} /> Rent
            </span>
          )}
          {item.type !== 'rent' && (
            <span className="bg-emerald-600/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-sm">
              <IndianRupee size={12} /> Buy
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 flex-1 mr-2">{item.title}</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1">
          <Tag size={12} /> {item.category}
        </p>
        
        <div className="flex items-center justify-between mt-auto border-t border-gray-100 dark:border-slate-800 pt-3">
          <div className="flex flex-col">
            {item.type !== 'sell' && (
              <span className="text-purple-600 dark:text-purple-400 font-bold text-sm flex items-center">₹{item.dailyRate}<span className="text-xs text-slate-500 font-normal ml-1">/day</span></span>
            )}
            {item.type !== 'rent' && (
               <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center">₹{item.price}<span className="text-xs text-slate-500 font-normal ml-1"> buy</span></span>
            )}
          </div>
          <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full text-slate-400 dark:text-slate-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};
