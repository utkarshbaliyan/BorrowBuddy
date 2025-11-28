import React, { useState } from 'react';
import { Category, ItemType } from '../types';
import { CATEGORIES } from '../constants';
import { Upload, IndianRupee, Calendar, Info, Camera, X, Plus, Trash2 } from 'lucide-react';

interface SellerZoneProps {
  onAddItem: (data: any) => void;
  onCancel: () => void;
}

export const SellerZone: React.FC<SellerZoneProps> = ({ onAddItem, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech' as Category,
    type: 'rent' as ItemType,
    price: '',
    dailyRate: '',
    images: [] as string[]
  });

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 0.6 quality to save space
            resolve(canvas.toDataURL('image/jpeg', 0.6));
          } else {
            reject(new Error("Canvas context unavailable"));
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        if (typeof event.target?.result === 'string') {
           img.src = event.target.result;
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      
      Promise.all(files.map(file => resizeImage(file)))
      .then(newImages => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      })
      .catch(err => {
        console.error("Error uploading images", err);
        alert("Failed to process images. Please try a different file.");
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const calculateEarnings = (amount: string) => {
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    return (val * 0.9).toFixed(0);
  };

  const isValid = () => {
    if (step === 1) return formData.title && formData.description;
    if (step === 2) return (formData.type === 'rent' && formData.dailyRate) || (formData.type === 'sell' && formData.price);
    if (step === 3) return formData.images.length > 0;
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    onAddItem({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
      dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : undefined,
      images: formData.images // Pass the real images array
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Listing</h1>
        <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Step {step} of 3</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-full mb-10">
        <div 
          className="h-full bg-purple-600 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
              <input 
                type="text" 
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                placeholder="e.g. Canon DSLR Camera Kit"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat})}
                    className={`p-3 rounded-xl text-sm font-medium border transition-all ${
                      formData.category === cat
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-slate-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea 
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white h-32 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none transition-all"
                placeholder="Describe the condition, included accessories, and any defects..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">I want to...</label>
              <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'rent'})}
                  className={`flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.type === 'rent' 
                    ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Calendar size={18} /> Rent it out
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'sell'})}
                  className={`flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.type === 'sell' 
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <IndianRupee size={18} /> Sell it
                </button>
              </div>
            </div>

            {formData.type === 'rent' ? (
              <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-purple-200 dark:border-purple-500/30 shadow-sm">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Daily Rate (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">₹</span>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl py-4 pl-8 pr-4 text-slate-900 dark:text-white text-2xl font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="0"
                    value={formData.dailyRate}
                    onChange={e => setFormData({...formData, dailyRate: e.target.value})}
                    autoFocus
                  />
                </div>
                <div className="mt-6 flex justify-between items-center text-sm p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">You earn per day:</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">₹{calculateEarnings(formData.dailyRate)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1"><Info size={12}/> 10% platform service fee deducted</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 shadow-sm">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sale Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">₹</span>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl py-4 pl-8 pr-4 text-slate-900 dark:text-white text-2xl font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    autoFocus
                  />
                </div>
                <div className="mt-6 flex justify-between items-center text-sm p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">You earn total:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">₹{calculateEarnings(formData.price)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1"><Info size={12}/> 10% platform service fee deducted</p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Add Photos</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Upload at least one photo. Images are automatically compressed.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 dark:border-slate-700 shadow-sm">
                    <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-start justify-end p-2">
                        <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="bg-white/90 dark:bg-black/60 text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0"
                        >
                            <X size={16} />
                        </button>
                    </div>
                  </div>
                ))}
                
                <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-400 dark:hover:border-purple-500 transition-all group text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 bg-gray-50 dark:bg-slate-900">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload} 
                  />
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                     <Plus size={24} />
                  </div>
                  <span className="text-xs font-bold">Add Image</span>
                </label>
              </div>
              
              {formData.images.length === 0 && (
                <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-500 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                    <Info size={16} />
                    <span>Please upload at least one image to continue.</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button 
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-8 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 transition-colors"
            >
              Back
            </button>
          )}
          <button 
            type={step === 3 ? 'submit' : 'button'}
            onClick={() => step < 3 && isValid() && setStep(step + 1)}
            disabled={!isValid()}
            className={`flex-1 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              isValid() 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-purple-500/30' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            {step === 3 ? 'Publish Listing' : 'Next Step'}
          </button>
        </div>
      </form>
    </div>
  );
};