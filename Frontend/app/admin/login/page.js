'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already logged in so redirect to dashboard
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    // signup creds for admin/checking krta
    if (
      email.toLowerCase() === 'admin@learningacademy.com' &&
      password === 'admin1234'
    ) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid email or password.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-300">Secure administrative access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Administrator Login</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm animate-pulse flex items-center">
              <svg className="h-4 w-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                placeholder="admin@learningacademy.com"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 
                         focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent 
                         transition-all duration-300 group-hover:border-white/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-8">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Secure Password
              </label>
              <input
                type="password"
                placeholder="Enter admin password"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 
                         focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent 
                         transition-all duration-300 group-hover:border-white/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-8">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-amber-900/30 border border-amber-600/30 rounded-lg">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-amber-200 text-xs">
                This is a secure admin area. All activities are logged.
              </p>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                     text-white font-semibold p-4 rounded-lg transition-all duration-300 
                     shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Access Admin Panel
              </div>
            )}
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-800/40 border border-slate-600/40 rounded-lg">
            <p className="text-slate-300 text-sm font-medium mb-2 flex items-center">
              <svg className="h-4 w-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Demo Credentials:
            </p>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <p>Email: admin@learningacademy.com</p>
              <p>Password: admin1234</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs">
              Learning Academy Administration Portal v2.0
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}