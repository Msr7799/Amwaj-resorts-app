import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { resorts } from '@/data/resorts';
import BookingForm from '@/components/booking/BookingForm';
import { ArrowRight } from 'lucide-react';

interface BookingPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return resorts.map((resort) => ({
    id: resort.id,
  }));
}

export default function BookingPage({ params }: BookingPageProps) {
  const resort = resorts.find((r) => r.id === params.id);

  if (!resort) {
    notFound();
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="relative h-64 w-full">
        <Image
          src={resort.images[0]}
          alt={resort.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="container">
            <Link
              href={`/resort/${resort.id}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
            >
              <ArrowRight className="w-5 h-5" />
              العودة إلى تفاصيل الشاليه
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">احجز {resort.name}</h1>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">معلومات مهمة قبل الحجز</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• موعد الدخول: الساعة 3:00 عصرًا</li>
              <li>• موعد الخروج: الساعة 12:00 ظهرًا</li>
              <li>• مبلغ التأمين: 50 دينار (يُعاد عند المغادرة)</li>
              <li>• المبلغ المدفوع غير مسترجع في حال الإلغاء</li>
            </ul>
          </div>

          <BookingForm resort={resort} />
        </div>
      </div>
    </div>
  );
}
