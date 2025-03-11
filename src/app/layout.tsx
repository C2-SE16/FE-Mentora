import { Geist, Geist_Mono, Roboto_Condensed } from 'next/font/google';
import './globals.css';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-roboto-condensed',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={robotoCondensed.variable}>
      <body className="font-roboto-condensed">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
