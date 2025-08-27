'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Pages where we want to HIDE Header and Footer
  const hideLayoutOn = ['/', '/user/login', '/admin/login', '/signup'];

  const shouldHideLayout = hideLayoutOn.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
