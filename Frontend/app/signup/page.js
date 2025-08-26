'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare payload matching SignupRequest schema
      const payload = {
        username: fullName, // using full name as username
        email,
        password
      };

      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      const data = await res.json();
      console.log(data.message); // "Signup successful"

      // Redirect user to /user/login page after successful signup
      router.push('/user/login');
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join Us Today</h1>
          <p className="text-blue-200">Create your account to get started</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Create Account</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm animate-pulse flex items-center">
              <svg className="h-4 w-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Full Name Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent 
                         transition-all duration-300 group-hover:border-white/30"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent 
                         transition-all duration-300 group-hover:border-white/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent 
                         transition-all duration-300 group-hover:border-white/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative group">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent 
                         transition-all duration-300 group-hover:border-white/30"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-400/30 rounded-lg">
            <div className="flex items-start">
              <svg className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-200 text-xs">
                By creating an account, you agree to our 
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors duration-200">
                  Terms of Service
                </a> and 
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors duration-200">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>

          {/* Signup Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                     text-white font-semibold p-4 rounded-lg transition-all duration-300 
                     shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </div>
            )}
          </button>

          {/* Password Requirements */}
          <div className="mt-4 p-3 bg-gray-800/40 border border-gray-600/40 rounded-lg">
            <p className="text-gray-300 text-xs font-medium mb-2">Password Requirements:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 6 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                At least 6 characters
              </li>
              <li className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${password && confirmPassword && password === confirmPassword ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                Passwords match
              </li>
            </ul>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
              Already have an account? 
              <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors duration-200">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}