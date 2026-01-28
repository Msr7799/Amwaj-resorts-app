

"use client";
import Link from "next/link";
import Image from "next/image";

import { resorts } from "@/assets/resorts";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ResortsPage() {
  const router = useRouter();

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);

  const buildResortHref = (id: string) => {
    const sp = new URLSearchParams();
    if (checkIn) sp.set("checkIn", checkIn);
    if (checkOut) sp.set("checkOut", checkOut);
    sp.set("guests", String(guests || 1));
    const qs = sp.toString();
    return qs ? `/resorts/${id}?${qs}` : `/resorts/${id}`;
  };

  const onOpenResort = (id: string) => {
    router.push(buildResortHref(id));
  };

  return (
    <main className="pt-28">
      <section className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-4">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl font-semibold text-heading">
            شاليهات أمواج
          </h1>
          <p className="text-text">
            اختَر الشاليه المناسب، شوف الصور والتفاصيل، وخلّ الحجز على طول 😉
          </p>
        </div>

        {/* Booking bar */}
        <div className="mb-28 rounded-2xl border border-background-hover bg-background-hover p-4">
          <div className="grid gap-4 md:grid-cols-5 ">
            <div>
              <label className="block mb-2 text-sm font-medium text-text">
                تاريخ الدخول
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  const v = e.target.value;
                  setCheckIn(v);
                  if (checkOut && v && checkOut <= v) {
                    setCheckOut("");
                  }
                }}
                min={todayStr}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text">
                تاريخ الخروج
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || todayStr}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text">
                عدد الضيوف
              </label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value || 1))}
                min={1}
                max={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  if (!checkIn) return;
                  const first = resorts[0]?.id;
                  if (first) onOpenResort(first);
                }}
                disabled={!checkIn}
                className="w-full px-5 py-3 text-sm font-medium text-white rounded-xl bg-black hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                اختر الشاليه وأكمل الحجز
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-text">
            ملاحظة: اختر التواريخ هنا، ثم افتح أي شاليه وسيتم تمرير التواريخ تلقائياً.
          </p>
        </div>

        {/* Light mode cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2 mb-12 dark:hidden">
          {resorts.map((resort) => {
            const cover =
              resort.images.find((p) => p.includes("hero")) ?? resort.images[0];

            if (!cover) return null;

            return (
              <div
                key={`light-${resort.id}`}
                className="overflow-hidden bg-white border rounded-xl border-gray-200"
              >
   <div className="relative w-full h-56 bg-gray-50 ">
                  <button className="w-full h-full" onClick={() => onOpenResort(resort.id)}>                  <Image
                    src={cover}
                    alt={resort.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw "
                    className="object-cover "
                    priority
                  />
                  </button>
                </div>

                <div className="p-5 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-heading">
                        {resort.name}
                      </h2>
                      <p className="mt-1 text-sm text-text">
                        {resort.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                      {resort.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-text">
                    <span>
                      🛏️ {resort.bedrooms} غرف
                    </span>
                    <span>
                      🚿 {resort.bathrooms} حمّامات
                    </span>
                    {resort.hasPrivatePool && <span>🏊‍♂️ مسبح خاص</span>}
                    {resort.hasPrivateBeach && <span>🏖️ شاطئ خاص</span>}
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-5">
                    <div>
                      <p className="text-xs text-text">السعر (عادي)</p>
                      <p className="text-base font-semibold text-heading">
                        {resort.priceRegular} {resort.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text">الويكند</p>
                      <p className="text-base font-semibold text-heading">
                        {resort.priceWeekend} {resort.currency}
                      </p>
                    </div>

                    <Link
                      href={buildResortHref(resort.id)}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-black hover:bg-background transition"
                    >
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dark mode cards with gradient */}
        <div className="relative hidden dark:grid gap-6 md:grid-cols-2 xl:grid-cols-2 mb-12">
          {resorts.map((resort) => {
            const cover =
              resort.images.find((p) => p.includes("hero")) ?? resort.images[0];

            if (!cover) return null;

            return (
              <BackgroundGradient
                key={resort.id}
                className="overflow-hidden bg-[#18181b] rounded-xl"
              >
                <div className="relative w-full h-56 bg-[#18181b]">
                  <button onClick={() => onOpenResort(resort.id)}>
                  <Image
                    src={cover}
                    alt={resort.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                    priority
                  />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-heading">
                        {resort.name}
                      </h2>
                      <p className="mt-1 text-sm text-text">
                        {resort.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                      {resort.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-text">
                    <span>
                      🛏️ {resort.bedrooms} غرف
                    </span>
                    <span>
                      🚿 {resort.bathrooms} حمّامات
                    </span>
                    {resort.hasPrivatePool && <span>🏊‍♂️ مسبح خاص</span>}
                    {resort.hasPrivateBeach && <span>🏖️ شاطئ خاص</span>}
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-5">
                    <div>
                      <p className="text-xs text-text">السعر (عادي)</p>
                      <p className="text-base font-semibold text-heading">
                        {resort.priceRegular} {resort.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text">الويكند</p>
                      <p className="text-base font-semibold text-heading">
                        {resort.priceWeekend} {resort.currency}
                      </p>
                    </div>

                    <Link
                      href={buildResortHref(resort.id)}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-black hover:bg-background transition"
                    >
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </BackgroundGradient>
            );
          })}
        </div>
      </section>
    </main>
  );
}
