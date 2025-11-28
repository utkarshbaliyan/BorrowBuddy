
import React, { useState } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../utils/database';
import { GraduationCap, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return email.toLowerCase().endsWith('@bennett.edu.in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      if (!validateEmail(email)) {
        throw new Error('Only @bennett.edu.in email addresses are allowed.');
      }

      if (!isLogin && !name) {
        throw new Error('Please enter your name');
      }

      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isLogin) {
        const user = loginUser(email, password);
        onLogin(user);
      } else {
        const newUser: User = {
          id: 'u_' + Date.now(),
          name: name,
          email: email,
          isVerified: false,
          trustScore: 5.0,
          sustainabilityLevel: 0,
          campus: 'Bennett University',
          balance: 0,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff`
        };
        const createdUser = registerUser(newUser, password);
        onLogin(createdUser);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 p-8 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg mb-4">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
            {isLogin ? 'Welcome Back' : 'Join Bennett Campus'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center max-w-xs">
            The exclusive marketplace for Bennett University students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="Arjun Mehta"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">University Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-slate-800 border rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 transition-all ${error && error.toLowerCase().includes('email') ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-slate-700 focus:ring-purple-500/50'}`}
                placeholder="roll_number@bennett.edu.in"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm animate-fade-in">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 mt-4 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                {isLogin ? 'Login to Campus' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
