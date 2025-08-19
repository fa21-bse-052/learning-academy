// app/layout.js
import './globals.css';
import LayoutWrapper from '../components/LayoutWrapper';

export const metadata = {
  title: 'Learning Academy',
  description: 'Your online learning hub',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
