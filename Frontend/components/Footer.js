'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center mt-10">
      <p>&copy; {new Date().getFullYear()} Learning Academy. All rights reserved.</p>
    </footer>
  );
}
