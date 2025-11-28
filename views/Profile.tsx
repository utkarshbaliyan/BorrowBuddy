
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { ShieldCheck, Star, Leaf, Settings, LogOut, Package, IndianRupee, Camera, Save, X, User as UserIcon, BookOpen, Calendar } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser?: (updatedUser: User) => void;
  onLogout?: () => void;
  onViewMyListings?: () => void;
  myListingsCount?: number;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout, onViewMyListings, myListingsCount = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser(editForm);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setEditForm(prev => ({ ...prev, avatar: ev.target!.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-slate-800 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600 relative">
           {!isEditing ? (
             <button 
               onClick={() => setIsEditing(true)}
               className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
               title="Edit Profile"
             >
               <Settings size={20}/>
             </button>
           ) : (
             <div className="absolute top-4 right-4 flex gap-2">
                <button 
                 onClick={handleCancel}
                 className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-colors"
                 title="Cancel"
                >
                  <X size={20}/>
                </button>
                <button 
                 onClick={handleSave}
                 className="p-2 bg-emerald-500/80 backdrop-blur-md rounded-full text-white hover:bg-emerald-600 transition-colors"
                 title="Save Changes"
                >
                  <Save size={20}/>
                </button>
             </div>
           )}
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex flex-col items-center">
            <div className="relative group">
              <img 
                src={isEditing ? editForm.avatar : user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-full object-cover border-[6px] border-white dark:border-slate-900 shadow-lg bg-slate-200" 
              />
              
              {isEditing && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-[6px] border-transparent"
                >
                  <Camera className="text-white" size={24} />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}

              {!isEditing && user.isVerified && (
                <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-900" title="Verified Student">
                  <ShieldCheck size={20} />
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="mt-4 w-full max-w-sm space-y-3 animate-fade-in">
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-center text-slate-900 dark:text-white font-bold text-xl outline-none focus:border-purple-500"
                    placeholder="Your Name"
                  />
                </div>
                <div className="flex gap-2">
                   <div className="relative flex-1">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input 
                        type="number"
                        min="16"
                        max="99"
                        onKeyDown={(e) => {
                          // Prevent negative signs and other non-numeric keys that shouldn't be in age
                          if (["-", "+", "e", "E"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        value={editForm.age || ''} 
                        onChange={e => {
                          const val = e.target.value;
                          // Handle empty string
                          if (val === '') {
                             setEditForm({...editForm, age: undefined});
                             return;
                          }
                          const num = parseInt(val);
                          // Ensure it's a valid number
                          if (!isNaN(num)) {
                             // Just in case, clamp logic or strictly positive
                             if (num > 0 && num < 100) {
                                setEditForm({...editForm, age: num});
                             }
                          }
                        }}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-center text-slate-600 dark:text-slate-300 outline-none focus:border-purple-500 text-sm"
                        placeholder="Age"
                      />
                   </div>
                   <div className="relative flex-[2]">
                      <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input 
                        type="text" 
                        value={editForm.course || ''} 
                        onChange={e => setEditForm({...editForm, course: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-center text-slate-600 dark:text-slate-300 outline-none focus:border-purple-500 text-sm"
                        placeholder="Course (e.g. B.Tech CSE)"
                      />
                   </div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-1">{user.name}</h1>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                  <span>{user.course || 'Student'}</span>
                  {user.age && (
                    <>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{user.age} y/o</span>
                    </>
                  )}
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{user.campus}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{user.email}</div>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 md:gap-8 divide-x divide-gray-100 dark:divide-slate-800 mb-8">
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                {user.trustScore} <Star size={18} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Trust Score</div>
            </div>
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                {user.sustainabilityLevel} <Leaf size={18} />
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Eco Level</div>
            </div>
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ₹{user.balance.toFixed(0)}
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Balance</div>
            </div>
          </div>

          {!isEditing && (
            <div className="flex justify-center">
               <button 
                onClick={() => setIsEditing(true)}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
               >
                 Edit Profile
               </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Menu Section */}
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-4 px-2">Dashboard</h3>
          <div className="space-y-3">
            <div 
              onClick={onViewMyListings}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl flex items-center justify-between border border-gray-200 dark:border-slate-800 cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 group transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-500/20 p-3 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">My Listings</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{myListingsCount} Active Item{myListingsCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-transform">&rarr;</div>
            </div>

             <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl flex items-center justify-between border border-gray-200 dark:border-slate-800 cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 group transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <IndianRupee size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Recent Sales</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">+₹0 this week</p>
                </div>
              </div>
              <div className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-transform">&rarr;</div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-4 px-2">Account</h3>
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <button className="w-full p-4 text-left text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800 transition-colors text-sm font-medium">
                Notifications
              </button>
              <button className="w-full p-4 text-left text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800 transition-colors text-sm font-medium">
                Payment Methods
              </button>
              <button className="w-full p-4 text-left text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800 transition-colors text-sm font-medium">
                Privacy & Security
              </button>
              <button 
                onClick={onLogout}
                className="w-full p-4 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-bold flex items-center gap-2"
              >
                <LogOut size={16} /> Log Out
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
