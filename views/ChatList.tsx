
import React, { useState, useEffect } from 'react';
import { User, Message } from '../types';
import { getConversations, getMessagesBetween, getUserById } from '../utils/database';
import { MessageSquare, Search } from 'lucide-react';

interface ChatListProps {
  currentUser: User;
  onSelectChat: (user: User) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ currentUser, onSelectChat }) => {
  const [conversations, setConversations] = useState<{user: User, lastMessage: Message}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChats = () => {
      const contactIds = getConversations(currentUser.id);
      const chats = contactIds.map(id => {
        const contact = getUserById(id);
        if (!contact) return null;
        
        const msgs = getMessagesBetween(currentUser.id, id);
        const lastMsg = msgs[msgs.length - 1];
        
        return { user: contact, lastMessage: lastMsg };
      }).filter(Boolean) as {user: User, lastMessage: Message}[];

      // Sort by newest message
      chats.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
      
      setConversations(chats);
      setIsLoading(false);
    };

    loadChats();
  }, [currentUser.id]);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading chats...</div>;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto min-h-[60vh]">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Messages</h1>
      
      {/* Search bar simulation */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search conversations..." 
          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      <div className="space-y-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <MessageSquare size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No messages yet</p>
            <p className="text-sm text-slate-400 max-w-xs mt-2">Browse the marketplace and chat with sellers to start a conversation.</p>
          </div>
        ) : (
          conversations.map(({ user, lastMessage }) => (
            <div 
              key={user.id}
              onClick={() => onSelectChat(user)}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 cursor-pointer transition-all group shadow-sm hover:shadow-md"
            >
              <div className="relative">
                 <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                 {user.isVerified && <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"></div>}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{user.name}</h3>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(lastMessage.timestamp).toLocaleDateString() === new Date().toLocaleDateString()
                      ? new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      : new Date(lastMessage.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {lastMessage.senderId === currentUser.id ? 'You: ' : ''}{lastMessage.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
