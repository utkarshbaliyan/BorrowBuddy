
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { getMessagesBetween, sendMessage } from '../utils/database';
import { ArrowLeft, Send, Smile } from 'lucide-react';

interface ChatRoomProps {
  currentUser: User;
  recipient: User;
  onBack: () => void;
  initialMessage?: string; // Optional context message (e.g., "Is this available?")
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ currentUser, recipient, onBack, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load existing messages
    const msgs = getMessagesBetween(currentUser.id, recipient.id);
    setMessages(msgs);

    // If there's an initial message (e.g., from item detail) and no chat exists yet
    if (initialMessage && msgs.length === 0) {
      setNewMessage(initialMessage);
    }
  }, [currentUser.id, recipient.id, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const sent = sendMessage({
      senderId: currentUser.id,
      receiverId: recipient.id,
      text: newMessage.trim()
    });

    setMessages([...messages, sent]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[600px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800 animate-fade-in">
      {/* Chat Header */}
      <div className="bg-white dark:bg-slate-900 p-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="relative">
          <img src={recipient.avatar} alt={recipient.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700" />
          {recipient.isVerified && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{recipient.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {recipient.trustScore >= 4.5 ? 'Highly Rated Student' : 'Student'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
              <Smile size={32} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">Start the conversation with {recipient.name.split(' ')[0]}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-sm ${
                    isMe 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-purple-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 dark:bg-slate-950 border-0 rounded-full px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none text-sm"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors shadow-md shadow-purple-500/20"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
