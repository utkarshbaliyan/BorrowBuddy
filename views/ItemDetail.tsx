
import React, { useState } from 'react';
import { Item, User } from '../types';
import { ArrowLeft, ShieldCheck, Star, MessageCircle, Check } from 'lucide-react';

interface ItemDetailProps {
  item: Item;
  seller: User;
  onBack: () => void;
  onChat: (seller: User, item: Item) => void;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({ item, seller, onBack, onChat }) => {
  const [days, setDays] = useState(1);
  const [isBooked, setIsBooked] = useState(false);

  const serviceFee = 49; // Fixed fee in INR
  const totalCost = item.type === 'rent' 
    ? ((item.dailyRate || 0) * days + serviceFee)
    : ((item.price || 0) + serviceFee);

  if (isBooked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Check size={48} className="text-emerald-600 dark:text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Request Sent!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          <span className="font-bold text-slate-900 dark:text-white">{seller.name.split(' ')[0]}</span> will review your request shortly. <br className="hidden md:block"/>
          The exact pickup location will be revealed upon confirmation.
        </p>
        <button 
          onClick={onBack}
          className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      
      {/* Left Column: Image */}
      <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
        
        {/* Mobile Back Button - Hidden on Desktop as header has nav */}
        <button 
          onClick={onBack}
          className="md:hidden absolute top-4 left-4 bg-white/80 dark:bg-black/40 backdrop-blur-md p-2 rounded-full text-slate-900 dark:text-white hover:bg-white dark:hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
           {item.type === 'rent' ? (
             <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg backdrop-blur-md">
               For Rent
             </div>
           ) : (
             <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg backdrop-blur-md">
               For Sale
             </div>
           )}
        </div>
      </div>

      {/* Right Column: Details & Action */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
           <div>
              <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full mb-3">
                {item.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{item.title}</h1>
           </div>
        </div>

        {/* Seller Info & Chat */}
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 mb-8 shadow-sm">
          <img src={seller.avatar} alt={seller.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-slate-700" />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-200 text-lg">{seller.name}</h3>
              {seller.isVerified && <ShieldCheck size={18} className="text-emerald-500" />}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {seller.trustScore}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <span>{seller.campus}</span>
            </div>
          </div>
          <button 
            onClick={() => onChat(seller, item)}
            className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-xl font-bold text-sm hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Description</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{item.description}</p>
        </div>

        {item.type === 'rent' && (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800">
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Rental Duration</h3>
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => days > 1 && setDays(days - 1)}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white hover:border-purple-500 dark:hover:border-purple-500 transition-colors shadow-sm"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white block">{days}</span>
                  <span className="text-xs text-slate-500 font-bold uppercase">Days</span>
                </div>
                <button 
                  onClick={() => setDays(days + 1)}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white hover:border-purple-500 dark:hover:border-purple-500 transition-colors shadow-sm"
                >
                  +
                </button>
             </div>
          </div>
        )}

        {/* Action Box */}
        <div className="mt-auto bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-lg sticky bottom-4 md:static">
          <div className="flex justify-between items-end mb-6">
             <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">₹{totalCost}</span>
                  <span className="text-sm text-slate-500">incl. fees</span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">{item.type === 'rent' ? `₹${item.dailyRate}/day` : 'One-time payment'}</p>
             </div>
          </div>
          
          <button 
            onClick={() => setIsBooked(true)}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] text-lg"
          >
            {item.type === 'rent' ? 'Request to Book' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
