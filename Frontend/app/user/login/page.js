'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Create form data to send, matching OAuth2PasswordRequestForm expectations
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await res.json();
      // Store the token in sessionStorage
      sessionStorage.setItem('isUserLoggedIn', 'true'); 
      sessionStorage.setItem('accessToken', data.access_token);
      router.push('/user/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.message || 'Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">User Login</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                         transition-all duration-300 group-hover:border-white/30"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
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
          </div>
          
          {/* Login Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     text-white font-semibold p-4 rounded-lg transition-all duration-300 
                     shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-400/30 rounded-lg">
            <p className="text-blue-200 text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-300 space-y-1">
              <p>Username: user@example.com</p>
              <p>Password: 123456</p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
              Don't have an account? 
              <a 
                href="/signup" 
                className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors duration-200"
              >
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}