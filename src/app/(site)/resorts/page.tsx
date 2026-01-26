

"use client";
import Link from "next/link";
import Image from "next/image";

import { resorts } from "@/assets/resorts";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useRouter } from "next/navigation";

export default function ResortsPage() {
  const router = useRouter();
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

        {/* Light mode cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12 dark:hidden">
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
                  <button onClick={() => router.push(`/resorts/${resort.id}`)}>
                  <Image
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
                      href={`/resorts/${resort.id}`}
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
        <div className="relative hidden dark:grid gap-6 md:grid-cols-2 xl:grid-cols-2mb-12">
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
                  <button onClick={() => router.push(`/resorts/${resort.id}`)}>
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
                      href={`/resorts/${resort.id}`}
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
