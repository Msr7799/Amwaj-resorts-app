import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getResortById } from "@/assets/resorts";
import { ResortDetailClient } from "./ResortDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

function isVideo(path: string) {
  return path.toLowerCase().endsWith(".mp4") || path.toLowerCase().endsWith(".webm");
}

export default async function ResortDetailPage({ params }: Props) {
  const { id } = await params;
  const resort = getResortById(id);
  
  if (!resort) {
    return notFound();
  }

  const hero =
    resort.images.find((p) => p.includes("hero")) ?? resort.images[0];

  if (!hero) return notFound();

  const galleryImages = resort.images.filter((p) => !isVideo(p));
  const mapSrc = resort.location
    ? `https://www.google.com/maps?q=${resort.location.lat},${resort.location.lng}&hl=ar&z=15&output=embed`
    : null;
  const mapLink = resort.location
    ? `https://maps.google.com/?q=${resort.location.lat},${resort.location.lng}`
    : "https://maps.google.com";

  return (
    <main className="pt-28">
      <section className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative w-full overflow-hidden bg-background rounded-2xl h-[360px] lg:h-[460px]">
            <Image
              src={hero}
              alt={resort.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-semibold text-heading">
                  {resort.name}
                </h1>
                <p className="mt-2 text-text">{resort.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                {String(resort.type).toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-5 text-sm text-text">
              <span className="rounded-lg bg-background-hover px-3 py-2">
                🛏️ {resort.bedrooms} غرف
              </span>
              <span className="rounded-lg bg-background-hover px-3 py-2">
                🚿 {resort.bathrooms} حمّامات
              </span>
              {resort.hasPrivatePool && (
                <span className="rounded-lg bg-background-hover px-3 py-2">
                  🏊‍♂️ مسبح خاص
                </span>
              )}
              {resort.hasPrivateBeach && (
                <span className="rounded-lg bg-background-hover px-3 py-2">
                  🏖️ شاطئ خاص
                </span>
              )}
            </div>

            <div className="grid gap-4 mt-6 sm:grid-cols-2">
              <div className="p-4 border rounded-xl border-background-hover bg-background-hover">
                <p className="text-sm text-text">السعر (الأيام العادية)</p>
                <p className="mt-1 text-2xl font-semibold text-heading">
                  {resort.priceRegular} {resort.currency}
                </p>
              </div>
              <div className="p-4 border rounded-xl border-background-hover bg-background-hover">
                <p className="text-sm text-text">سعر الويكند</p>
                <p className="mt-1 text-2xl font-semibold text-heading">
                  {resort.priceWeekend} {resort.currency}
                </p>
              </div>
            </div>

            {/* Payment info text */}
            <div className="p-4 mt-5 rounded-xl bg-background-hover border border-background-hover">
              <p className="text-sm text-text mb-2">
                احجز الآن ببطاقة البنك أو Apple Pay أو Google Pay
              </p>
              <p className="text-sm text-text">
                وسائل الدفع محمية وآمنة وتستخدم SSL وضد انتي فاي ومدعومة من أمنيتي فاي & stripe provider
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-5">
              <Link
                href={`/payment?resortId=${id}&resortName=${encodeURIComponent(resort.name)}`}
                className="inline-flex items-center border-2 border-white/60 justify-center px-5 py-3 text-sm font-medium text-white rounded-xl bg-green-600 hover:bg-green-700 transition"
              >
                احجز الآن
             
              
             <img
                  src="/payment/payment-01.svg"
                  alt="Stripe Link"
                  className="w-8 h-8 mr-5 mb-1"
                />
                <img
                  src="/payment/payment-03.svg"
                  alt="Stripe Link"
                  className="w-8 h-8 mr-5 mb-1"
                />
                <img
                  src="/payment/payment-02.svg"
                  alt="Stripe Link"
                  className="w-8 h-8 mr-5 mb-1"
                />
                <img
                  src="/payment/payment-04.svg"
                  alt="Stripe Link"
                  className="w-16 h-8 mr-5 mb-1 filter backdrop-brightness-2000  border-2 border-white/20 rounded-md"
                />
                <img
                  src="/payment/payment-05.svg"
                  alt="Stripe Link"
                  className="w-19 h-10 mr-5 mb-1 filter backdrop-brightness-0  border-2 border-white/20 rounded-md"
                />

              </Link>
              
              <a
                href={resort.paymentLink || mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-medium text-white rounded-xl bg-black hover:bg-gray-800 transition"
              >
                <span>ادفع الآن عبر Link</span>
                <img
                  src="/payment/link-logo.png"
                  alt="Stripe Link"
                  className="w-8 h-8 mr-12 mb-1"
                />
              </a>

              <a
                href="https://wa.me/97336118277?text=مرحباً، أحتاج مساعدة في الحجز والدفع"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white rounded-xl bg-black hover:bg-gray-800 transition"
              >
             
                <div className="text-right">
                  <div className="font-semibold">مساعدة وحلول مصرفية</div>
                  <div className="text-xs">متاح 24/7</div>
                  
                </div>
                <img
                  src="/payment/whatsapp-logo.svg"
                  alt="WhatsApp"
                  className="w-8 h-8 mr-10 mb-1"
                />
              </a>

              <Link
                href="/resorts"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium border rounded-xl border-background-hover text-heading hover:bg-background-hover transition"
              >
                رجوع لكل الشاليهات
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-text">
              {resort.checkIn && (
                <p>
                  <span className="font-semibold">الدخول:</span> {resort.checkIn}
                </p>
              )}
              {resort.checkOut && (
                <p>
                  <span className="font-semibold">الخروج:</span> {resort.checkOut}
                </p>
              )}
              {typeof resort.deposit === "number" && (
                <p>
                  <span className="font-semibold">التأمين:</span> {resort.deposit} {resort.currency}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-8 mt-12 lg:grid-cols-2">
          <div className="p-6 border rounded-2xl border-background-hover bg-background-hover">
            <h2 className="text-xl font-semibold text-heading">🛏️ المساحة والتوزيع</h2>
            <ul className="mt-4 space-y-2 text-text list-disc list-inside">
              {resort.features.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 border rounded-2xl border-background-hover bg-background-hover">
            <h2 className="text-xl font-semibold text-heading">🏊‍♂️ المرافق والخدمات</h2>
            <ul className="mt-4 space-y-2 text-text list-disc list-inside">
              {resort.amenities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Policy */}
        {resort.policy?.length ? (
          <div className="p-6 mt-8 border rounded-2xl border-background-hover bg-background-hover">
            <h2 className="text-xl font-semibold text-heading">📌 التعليمات والقوانين</h2>
            <ol className="mt-4 space-y-2 text-text list-decimal list-inside">
              {resort.policy.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {/* Location */}
        <div className="grid gap-6 mt-8 lg:grid-cols-2">
          <div className="p-6 border rounded-2xl border-background-hover bg-background-hover">
            <h2 className="text-xl font-semibold text-heading">📍 الموقع</h2>

            {resort.location ? (
              <div className="mt-4 space-y-2 text-text">
                <p>
                  <span className="font-semibold">Villa:</span> {resort.location.villa}
                </p>
                <p>
                  <span className="font-semibold">Road:</span> {resort.location.road}
                </p>
                <p>
                  <span className="font-semibold">Block:</span> {resort.location.block}
                </p>
                <p>
                  <span className="font-semibold">Area:</span> {resort.location.area}
                </p>

                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center mt-3 px-4 py-2 text-sm font-medium text-white rounded-lg bg-black hover:bg-background-hover transition"
                >
                  افتح الموقع في Google Maps
                </a>
              </div>
            ) : (
              <p className="mt-4 text-text">لا توجد بيانات موقع حالياً.</p>
            )}
          </div>

          <div className="overflow-hidden border rounded-2xl border-background-hover bg-background-hover">
            {mapSrc ? (
              <iframe
                title="Resort location"
                src={mapSrc}
                className="w-full h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex items-center justify-center h-[320px] text-text">
                الخريطة غير متاحة
              </div>
            )}
          </div>
        </div>

        {/* Client Components for Gallery and Sticky Scroll */}
        <ResortDetailClient 
          resort={resort}
          galleryImages={galleryImages}
          resortId={id}
          video={resort.video}
        />
      </section>
    </main>
  );
}
