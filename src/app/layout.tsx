import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'أمواج Resort - شاليهات فاخرة للإيجار',
  description: 'احجز شاليهك الفاخر مع مسبح خاص وشاطئ خاص في أمواج Resort',
  keywords: 'شاليهات, حجز, مسبح خاص, شاطئ خاص, أمواج',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
