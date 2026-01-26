import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="pt-28">
      <section className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
        <h1 className="text-2xl font-semibold text-dark">تواصل معنا</h1>
        <p className="mt-2 text-gray-600">
          إذا تبي حجز، أو عندك استفسار قبل الدفع، تواصل وخلّنا نخدمك 🤝
        </p>

        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          <div className="p-6 bg-white border rounded-2xl border-gray-3">
            <h2 className="text-lg font-semibold text-dark">معلومات التواصل</h2>

            <ul className="mt-4 space-y-3 text-gray-700">
              <li>
                📞 الهاتف: <span className="text-gray-500">(ضع رقمك هنا)</span>
              </li>
              <li>
                ✉️ الإيميل: <span className="text-gray-500">(ضع إيميلك هنا)</span>
              </li>
              <li>
                📍 الموقع: أمواج – البحرين
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/resorts"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white rounded-xl bg-blue hover:bg-blue/90"
              >
                شوف الشاليهات
              </Link>
              <a
                href="https://maps.google.com/?q=26.290121,50.669178"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium border rounded-xl border-gray-3 text-dark hover:bg-gray-1"
              >
                افتح الموقع في الخرائط
              </a>
            </div>
          </div>

          <div className="overflow-hidden border rounded-2xl border-gray-3 bg-gray-2">
            <iframe
              title="Amwaj"
              src="https://www.google.com/maps?q=26.290121,50.669178&hl=ar&z=14&output=embed"
              className="w-full h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
