
import React, { useState, useEffect } from 'react';
import { ViewState, Item, User, Category } from './types';
import { MOCK_ITEMS, MOCK_USER } from './constants';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { Home } from './views/Home';
import { Marketplace } from './views/Marketplace';
import { SellerZone } from './views/SellerZone';
import { ItemDetail } from './views/ItemDetail';
import { Profile } from './views/Profile';
import { Auth } from './views/Auth';
import { MyListings } from './views/MyListings';
import { ChatList } from './views/ChatList';
import { ChatRoom } from './views/ChatRoom';
import { initializeDB, updateUserInDB, getUserById } from './utils/database';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);

  // App State
  const [currentView, setCurrentView] = useState<ViewState>('home');
  
  // Initialize items from localStorage or use Mock data
  const [items, setItems] = useState<Item[]>(() => {
    const storedItems = localStorage.getItem('bb_items');
    if (storedItems) {
      try {
        return JSON.parse(storedItems).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
      } catch (e) {
        console.error("Failed to parse items", e);
        return MOCK_ITEMS;
      }
    }
    return MOCK_ITEMS;
  });

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Chat State
  const [chatRecipient, setChatRecipient] = useState<User | null>(null);
  const [initialChatMessage, setInitialChatMessage] = useState<string>('');

  // Simulate loading
  const [isLoading, setIsLoading] = useState(true);

  // Save items to localStorage whenever they change
  useEffect(() => {
    const saveItems = () => {
      try {
        localStorage.setItem('bb_items', JSON.stringify(items));
      } catch (e: any) {
        console.error("Failed to save items to localStorage", e);
        // If quota exceeded, try to clear the key first then save
        // This helps if we are shrinking the data size (like deleting an item) but the overwrite fails
        if (e.name === 'QuotaExceededError' || e.code === 22) {
           try {
             console.warn("Quota exceeded, attempting clear-and-save strategy...");
             localStorage.removeItem('bb_items');
             localStorage.setItem('bb_items', JSON.stringify(items));
             console.log("Recovery save successful");
           } catch (retryErr) {
             console.error("Critical: Unable to save items even after clear.", retryErr);
             alert("Storage is full. Your changes (like deleting items) may not persist if you reload. Please try deleting more items.");
           }
        }
      }
    };
    saveItems();
  }, [items]);

  useEffect(() => {
    // Initialize DB
    initializeDB();

    // Initialize theme from local storage or default to dark
    if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // Check if user is logged in (Simulated session)
    const storedUser = localStorage.getItem('user_auth');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('user_auth', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user_auth');
    setCurrentView('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Update state
    setUser(updatedUser);
    // Update session
    try {
      localStorage.setItem('user_auth', JSON.stringify(updatedUser));
    } catch(e) {
      console.error("Storage error updating user session", e);
    }
    // Update database
    updateUserInDB(updatedUser);
  };

  const handleAddItem = (newItemData: Partial<Item>) => {
    const newItem: Item = {
      id: `i${Date.now()}`,
      sellerId: user.id,
      status: 'available',
      createdAt: new Date(),
      images: newItemData.images || [],
      title: newItemData.title || 'Untitled',
      description: newItemData.description || '',
      category: newItemData.category || 'Other',
      type: newItemData.type || 'rent',
      price: newItemData.price,
      dailyRate: newItemData.dailyRate
    };

    setItems(prevItems => [newItem, ...prevItems]);
    setCurrentView('marketplace');
    setActiveCategory('All'); // Reset category to see all
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      setItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setCurrentView('item-detail');
  };

  const handleCategorySelect = (category: Category) => {
    setActiveCategory(category);
    setCurrentView('marketplace');
  };

  const handleStartChat = (recipient: User, item?: Item) => {
    if (recipient.id === user.id) {
      alert("You can't chat with yourself!");
      return;
    }
    setChatRecipient(recipient);
    if (item) {
      setInitialChatMessage(`Hi! I'm interested in your listing "${item.title}". Is it still available?`);
    } else {
      setInitialChatMessage('');
    }
    setCurrentView('chat-room');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Borrow Buddy</h1>
      </div>
    );
  }

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
         <Auth onLogin={handleLogin} />
         <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2.5 rounded-full bg-white/10 backdrop-blur-md text-slate-600 dark:text-slate-400 hover:bg-white/20 transition-colors border border-gray-200/20 z-50"
          >
            {theme === 'light' ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> 
              : 
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            }
          </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 flex flex-col">
      <Header 
        currentView={currentView} 
        onChange={setCurrentView} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-24 md:pb-12 px-4 md:px-6">
        {currentView === 'home' && (
          <Home 
            items={items} 
            onItemClick={handleItemClick} 
            onChangeView={setCurrentView} 
            onCategorySelect={handleCategorySelect}
          />
        )}
        
        {currentView === 'marketplace' && (
          <Marketplace 
            items={items} 
            onItemClick={handleItemClick} 
            initialCategory={activeCategory}
          />
        )}

        {currentView === 'create' && (
          <SellerZone 
            onAddItem={handleAddItem} 
            onCancel={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'profile' && (
          <Profile 
            user={user} 
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            onViewMyListings={() => setCurrentView('my-listings')}
            myListingsCount={items.filter(i => i.sellerId === user.id).length}
          />
        )}

        {currentView === 'my-listings' && (
          <MyListings 
            user={user} 
            items={items} 
            onItemClick={handleItemClick}
            onBack={() => setCurrentView('profile')}
            onCreateNew={() => setCurrentView('create')}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {currentView === 'item-detail' && selectedItem && (
          <ItemDetail 
            item={selectedItem} 
            seller={getUserById(selectedItem.sellerId) || MOCK_USER} 
            onBack={() => setCurrentView('marketplace')}
            onChat={handleStartChat}
          />
        )}

        {currentView === 'chat-list' && (
          <ChatList 
            currentUser={user}
            onSelectChat={(recipient) => handleStartChat(recipient)}
          />
        )}

        {currentView === 'chat-room' && chatRecipient && (
          <ChatRoom 
            currentUser={user}
            recipient={chatRecipient}
            onBack={() => setCurrentView('chat-list')}
            initialMessage={initialChatMessage}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <div className="md:hidden">
        {currentView !== 'item-detail' && currentView !== 'create' && currentView !== 'chat-room' && (
          <BottomNav currentView={currentView} onChange={setCurrentView} />
        )}
      </div>
    </div>
  );
};

export default App;
