
import { User, Message } from '../types';
import { MOCK_USER } from '../constants';

const USERS_KEY = 'bb_users';
const MESSAGES_KEY = 'bb_messages';

interface StoredUser extends User {
  password?: string;
}

export const initializeDB = () => {
  try {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
      // Seed with mock user so the default account works
      const initialUsers: StoredUser[] = [
        { ...MOCK_USER, password: 'password123' } // Default password for the mock user
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
    
    if (!localStorage.getItem(MESSAGES_KEY)) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
    }
  } catch (e) {
    console.error("Storage initialization failed", e);
  }
};

export const registerUser = (user: User, password: string): User => {
  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error('User with this email already exists.');
  }

  const newUser: StoredUser = { ...user, password };
  users.push(newUser);
  
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    throw new Error("Storage full. Cannot register new user.");
  }
  
  // Return user without password
  const { password: _, ...safeUser } = newUser;
  return safeUser;
};

export const loginUser = (email: string, password: string): User => {
  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  // Case-insensitive email match
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('User not found. Please register first.');
  }

  if (user.password !== password) {
    throw new Error('Invalid password.');
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const updateUserInDB = (updatedUser: User): void => {
  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const index = users.findIndex(u => u.id === updatedUser.id);
  
  if (index !== -1) {
    // Preserve the existing password while updating other fields
    users[index] = { ...updatedUser, password: users[index].password };
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to update user in DB", e);
    }
  }
};

export const getUserById = (id: string): User | undefined => {
  try {
    const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    // Check mock user or DB users
    if (id === MOCK_USER.id) return MOCK_USER;
    
    const user = users.find(u => u.id === id);
    if (user) {
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
  } catch (e) {
    console.error("Failed to retrieve user", e);
  }
  return undefined;
};

// --- Messaging System ---

export const sendMessage = (msg: Omit<Message, 'id' | 'timestamp'>): Message => {
  const messages: Message[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  const newMessage: Message = {
    ...msg,
    id: `msg_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to send message due to storage quota", e);
    // We return the message so the UI updates, even if storage fails
  }
  return newMessage;
};

export const getMessagesBetween = (user1Id: string, user2Id: string): Message[] => {
  try {
    const messages: Message[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    return messages.filter(
      m => (m.senderId === user1Id && m.receiverId === user2Id) || 
           (m.senderId === user2Id && m.receiverId === user1Id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch (e) {
    return [];
  }
};

export const getConversations = (userId: string): string[] => {
  try {
    const messages: Message[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    const interactedUserIds = new Set<string>();
    
    messages.forEach(m => {
      if (m.senderId === userId) interactedUserIds.add(m.receiverId);
      if (m.receiverId === userId) interactedUserIds.add(m.senderId);
    });
    
    return Array.from(interactedUserIds);
  } catch (e) {
    return [];
  }
};
    