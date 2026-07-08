import './globals.css';

export const metadata = {
  title: 'Review Sheet Generator',
  description: 'Professional curriculum-based review sheet generator for educators',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
