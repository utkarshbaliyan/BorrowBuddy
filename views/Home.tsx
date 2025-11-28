
import React from 'react';
import { ViewState, Item, Category } from '../types';
import { ArrowRight, Leaf, IndianRupee, Repeat, Smartphone, BookOpen, Shirt, Music, Activity, MoreHorizontal } from 'lucide-react';
import { ItemCard } from '../components/ItemCard';

interface HomeProps {
  items: Item[];
  onItemClick: (item: Item) => void;
  onChangeView: (view: ViewState) => void;
  onCategorySelect: (category: Category) => void;
}

export const Home: React.FC<HomeProps> = ({ items, onItemClick, onChangeView, onCategorySelect }) => {
  
  // Use the first 5 items as "Trending" (Recently Uploaded)
  const recentItems = items.slice(0, 6);

  const categoryIcons: Record<Category, React.ReactNode> = {
    'Tech': <Smartphone size={24} />,
    'Textbooks': <BookOpen size={24} />,
    'Fashion': <Shirt size={24} />,
    'Party': <Music size={24} />,
    'Sports': <Activity size={24} />,
    'Other': <MoreHorizontal size={24} />
  };

  const categoryColors: Record<Category, string> = {
    'Tech': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'Textbooks': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    'Fashion': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    'Party': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'Sports': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Other': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-purple-900/20 rounded-[2.5rem] border border-gray-200 dark:border-purple-500/20 p-8 md:p-12 mb-10 shadow-sm dark:shadow-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
              <span className="block text-slate-800 dark:text-slate-100">Turn Hostel</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-pink-400">Clutter to Cash</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
              The sustainable marketplace for verified students. Rent, buy, and sell safely on campus.
            </p>
            
            <div className="flex gap-4 w-full md:w-auto">
               <button 
                onClick={() => onChangeView('marketplace')}
                className="flex-1 md:flex-none bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-4 px-6 rounded-2xl font-bold flex flex-col md:flex-row items-center gap-3 transition-all border border-gray-200 dark:border-slate-700"
               >
                <div className="bg-white dark:bg-slate-700/50 p-2 rounded-full shadow-sm">
                  <ArrowRight size={20} className="text-emerald-500 dark:text-emerald-400" />
                </div>
                <span>I need a...</span>
               </button>

               <button 
                onClick={() => onChangeView('create')}
                className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-2xl font-bold flex flex-col md:flex-row items-center gap-3 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/50 transition-all"
               >
                <div className="bg-white/20 p-2 rounded-full">
                  <IndianRupee size={20} />
                </div>
                <span>I have a...</span>
               </button>
            </div>
          </div>
          
          {/* Decorative Hero Image/Graphic for Desktop */}
          <div className="hidden md:block w-64 h-64 md:w-80 md:h-80 relative">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-emerald-400 rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse"></div>
             <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                   <div className="space-y-2">
                      <div className="h-2 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-2 w-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
                   </div>
                </div>
                <div className="h-32 bg-gray-100 dark:bg-slate-900 rounded-xl mb-4 flex items-center justify-center text-slate-300 dark:text-slate-600">
                  <IndianRupee size={48} />
                </div>
                <div className="flex justify-between items-center">
                   <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
                   <button className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">Buy</button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="mb-12">
         <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
           <Repeat className="text-purple-500" size={20} /> Browse by Category
         </h2>
         <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
           {(Object.keys(categoryIcons) as Category[]).map((cat) => (
             <button
               key={cat}
               onClick={() => onCategorySelect(cat)}
               className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg dark:hover:shadow-purple-900/10 transition-all group"
             >
               <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${categoryColors[cat]}`}>
                 {categoryIcons[cat]}
               </div>
               <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat}</span>
             </button>
           ))}
         </div>
      </div>

      {/* Recently Uploaded (Trending) */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Leaf className="text-emerald-500" size={20} /> Fresh Recommendations
           </h2>
           <button 
             onClick={() => onChangeView('marketplace')}
             className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline"
           >
             View All
           </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-hide snap-x">
          {recentItems.map((item) => (
            <div key={item.id} className="w-64 shrink-0 snap-start">
               <ItemCard item={item} onClick={onItemClick} />
            </div>
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <Activity className="text-orange-500" size={20} /> Campus Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
            <span className="text-3xl md:text-4xl font-bold text-emerald-500 dark:text-emerald-400 mb-1">₹10L+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Student Savings</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
            <span className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">580+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Items Rescued</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center md:col-span-2 bg-gradient-to-r from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 border-purple-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-1 rounded text-xs font-bold">New</span>
               <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Sustainability Leaderboard</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Top hostel: <span className="font-bold text-slate-800 dark:text-white">Cauvery Hostel</span> just saved 50kg of CO2!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
