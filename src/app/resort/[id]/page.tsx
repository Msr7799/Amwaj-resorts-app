import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { resorts } from '@/data/resorts';
import ImageGallery from '@/components/resort/ImageGallery';
import { ResortStickyScroll } from '@/components/resort/ResortStickyScroll';
import { Bed, Bath, Waves, Sparkles, Check, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ResortPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return resorts.map((resort) => ({
    id: resort.id,
  }));
}

export default function ResortPage({ params }: ResortPageProps) {
  const resort = resorts.find((r) => r.id === params.id);

  if (!resort) {
    notFound();
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative h-96 w-full">
        <Image
          src={resort.images[20]}
          alt={resort.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="container text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{resort.name}</h1>
            {resort.type === 'vip' && (
              <div className="inline-flex bg-[#87b4cc] cursor-pointer border-2 border-[#050c13] mt-4 text-[#181717] items-center gap-2 bg-secondary px-4 py-2 rounded-full text-lg font-semibold">
                <Sparkles className="w-5 h-5 " />
                VIP Resort
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">عن الشاليه</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {resort.description}
              </p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed className="w-6 h-6 text-primary" />
                  <span className="text-lg">{resort.bedrooms} غرف نوم</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bath className="w-6 h-6 text-primary" />
                  <span className="text-lg">{resort.bathrooms} دورات مياه</span>
                </div>
                {resort.hasPrivatePool && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Waves className="w-6 h-6 text-primary" />
                    <span className="text-lg">مسبح خاص</span>
                  </div>
                )}
                {resort.hasPrivateBeach && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span className="text-lg">شاطئ خاص</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">المساحة والتوزيع</h2>
              <ul className="space-y-3">
                {resort.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">الخدمات والمرافق</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resort.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">معرض الصور</h2>
              <ImageGallery images={resort.images} resortName={resort.name} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">الأسعار</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">يوم عادي</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(resort.priceRegular, resort.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">عطلة نهاية الأسبوع</span>
                    <span className="text-2xl font-bold text-secondary">
                      {formatPrice(resort.priceWeekend, resort.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">مبلغ التأمين</span>
                    <span className="text-xl font-semibold text-gray-900">50 دينار</span>
                  </div>
                </div>

                <Link
                  href={`/booking/${resort.id}`}
                  className="btn btn-primary w-full text-lg py-4 mb-4"
                >
                  احجز الآن
                </Link>

                <Link
                  href="/policy"
                  className="text-sm text-gray-600 hover:text-primary text-center block"
                >
                  اقرأ القوانين والشروط
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResortStickyScroll resortId={resort.id} />
    </div>
  );
}
