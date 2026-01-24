import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          عذرًا، الصفحة التي تبحث عنها غير موجودة
        </p>
        <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
          <Home className="w-5 h-5" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
