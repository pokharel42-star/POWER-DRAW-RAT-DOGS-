import './globals.css';

export const metadata = {
  title: 'Power Draw Championship',
  description: 'Live-updating tournament dashboard for manager team ownership tracking.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
