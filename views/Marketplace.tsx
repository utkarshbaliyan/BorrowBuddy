
import React, { useState, useMemo, useEffect } from 'react';
import { Item, FilterState, Category } from '../types';
import { ItemCard } from '../components/ItemCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface MarketplaceProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  initialCategory?: Category | 'All';
}

export const Marketplace: React.FC<MarketplaceProps> = ({ items, onItemClick, initialCategory = 'All' }) => {
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    category: initialCategory,
    search: '',
    maxPrice: 10000
  });

  const [showFilters, setShowFilters] = useState(false);

  // Reset category if initialCategory prop changes (e.g., coming from Home navigation)
  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                            item.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'all' || 
                          (filters.type === 'rent' && (item.type === 'rent' || item.type === 'both')) ||
                          (filters.type === 'buy' && (item.type === 'sell' || item.type === 'both'));
      const matchesCategory = filters.category === 'All' || item.category === filters.category;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [items, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="min-h-[80vh]">
      {/* Search Header */}
      <div className="sticky top-16 md:top-20 z-30 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-gray-200 dark:border-slate-800 mb-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search textbooks, draughters, calculators..." 
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none shadow-sm transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-2xl border font-medium flex items-center gap-2 transition-all ${
                showFilters 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 animate-in slide-in-from-top-2 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Filter Options</h3>
                <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"><X size={20} /></button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-3 block">Listing Type</label>
                  <div className="flex p-1.5 bg-gray-100 dark:bg-slate-900 rounded-xl">
                    {(['all', 'rent', 'buy'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters(prev => ({ ...prev, type }))}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                          filters.type === type 
                            ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {type === 'all' ? 'All Items' : type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-3 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...CATEGORIES].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilters(prev => ({ ...prev, category: cat as any }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          filters.category === cat 
                            ? 'bg-purple-50 dark:bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300' 
                            : 'bg-transparent border-gray-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-slate-500 hover:text-purple-600 dark:hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {!showFilters && (filters.type !== 'all' || filters.category !== 'All') && (
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide max-w-4xl mx-auto px-2">
           {filters.type !== 'all' && (
             <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold whitespace-nowrap">
               Type: {filters.type}
               <button onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))} className="hover:bg-purple-200 dark:hover:bg-purple-500/30 rounded-full p-0.5"><X size={12} /></button>
             </span>
           )}
           {filters.category !== 'All' && (
             <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold whitespace-nowrap">
               Category: {filters.category}
               <button onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))} className="hover:bg-purple-200 dark:hover:bg-purple-500/30 rounded-full p-0.5"><X size={12} /></button>
             </span>
           )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center px-8">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Search className="text-slate-400 dark:text-slate-500" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No items found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">We couldn't find what you're looking for. Try adjusting your filters or searching for something else.</p>
          <button 
             onClick={() => setFilters({type: 'all', category: 'All', search: '', maxPrice: 10000})}
             className="mt-6 text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
