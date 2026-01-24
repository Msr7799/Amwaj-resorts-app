import Image from 'next/image';
import Link from 'next/link';
import { Resort } from '@/types';
import { Bed, Bath, Waves, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ResortCardProps {
  resort: Resort;
}

export default function ResortCard({ resort }: ResortCardProps) {
  return (
    <div className="card group hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={resort.images[0]}
          alt={resort.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {resort.type === 'vip' && (
          <div className="absolute top-4 right-4 bg-secondary px-3 py-1 rounded-full flex items-center gap-1 text-white text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            VIP
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{resort.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{resort.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Bed className="w-5 h-5 text-primary" />
            <span>{resort.bedrooms} غرف نوم</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Bath className="w-5 h-5 text-primary" />
            <span>{resort.bathrooms} دورات مياه</span>
          </div>
          {resort.hasPrivatePool && (
            <div className="flex items-center gap-2 text-gray-700">
              <Waves className="w-5 h-5 text-primary" />
              <span>مسبح خاص</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500">يوم عادي</p>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(resort.priceRegular, resort.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">عطلة نهاية الأسبوع</p>
            <p className="text-2xl font-bold text-secondary">
              {formatPrice(resort.priceWeekend, resort.currency)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/resort/${resort.id}`} className="btn btn-outline flex-1">
            عرض التفاصيل
          </Link>
          <Link href={`/booking/${resort.id}`} className="btn btn-primary flex-1">
            احجز الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
