 'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role) => {
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/home');
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to Learning Academy</h1>
      <div className="space-y-4">
        <button
          onClick={() => handleLogin('user')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
        >
          User Login
        </button>
        <button
          onClick={() => handleLogin('admin')}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded"
        >
          Admin Login
        </button>
      </div>
    </main>
  );
}
  
