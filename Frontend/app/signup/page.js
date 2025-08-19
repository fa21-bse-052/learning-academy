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

    // Validation
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: fullName, // backend expects "username"
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Signup failed');
      }

      // ✅ Redirect to login page after success
      window.location.href = 'http://localhost:3000/user/login';

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] flex items-center justify-center text-white font-sans p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join Us Today</h1>
          <p className="text-blue-200">Create your account to get started</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Create Account
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm flex items-center">
              <svg
                className="h-4 w-4 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold p-4 rounded-lg"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
              Already have an account?
              <a
                href="http://localhost:3000/user/login"
                className="text-blue-400 hover:text-blue-300 font-medium ml-1"
              >
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
