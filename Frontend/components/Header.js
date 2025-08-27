'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [homeLink, setHomeLink] = useState('/user/dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    
    if (path.startsWith('/admin')) {
      setHomeLink('/admin/dashboard');
      setIsAdmin(true);
    } else {
      setHomeLink('/user/dashboard');
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setHomeLink('/admin/dashboard');
        setIsAdmin(true);
      } else {
        setHomeLink('/user/dashboard');
        setIsAdmin(false);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Learning Academy</h1>
        <nav className="space-x-4">
          <Link href={homeLink} className="hover:underline">Home</Link>

          {!isAdmin && (
            <>
              <Link href="/courses" className="hover:underline">Courses</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
              <Link href="/quiz" className="hover:underline">Quiz</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
