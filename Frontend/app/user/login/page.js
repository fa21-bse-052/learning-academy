'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserLoginPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: fullName,
          password: password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Invalid full name or password');
      }

      const data = await response.json();

      // ✅ Save JWT token and user info in sessionStorage
      sessionStorage.setItem('token', data.access_token);
      sessionStorage.setItem('userName', fullName);
      sessionStorage.setItem('isUserLoggedIn', 'true');

      // Redirect to dashboard
      router.push('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">User Login</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="relative group">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
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

          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
              Don't have an account? 
              <a href="/user/signup" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors duration-200">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
