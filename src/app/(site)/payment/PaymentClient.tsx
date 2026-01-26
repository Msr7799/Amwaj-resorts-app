"use client";

import { useSearchParams } from "next/navigation";
import { Iphone } from "@/components/ui/iphone";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const resortName = searchParams.get("resortName") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const nights = searchParams.get("nights") || "0";
  const totalPrice = searchParams.get("totalPrice") || "0";
  const currency = searchParams.get("currency") || "د.ب";
  const fullName = searchParams.get("fullName") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  const handlePayment = async () => {
    if (!checkIn || !checkOut || !fullName || !email || !phone) {
      setError("يرجى إكمال جميع بيانات الحجز أولاً");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resortName,
          checkIn,
          checkOut,
          nights,
          totalPrice,
          currency,
          fullName,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل إنشاء جلسة الدفع");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("فشل تحميل Stripe");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء معالجة الدفع");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-background">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-4">
        <h1 className="mb-8 text-3xl font-bold text-heading">إتمام الدفع</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Payment Info */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-6 bg-white rounded-xl dark:bg-[#18181b] border border-gray-200 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-heading">ملخص الحجز</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text">الشاليه:</span>
                  <span className="font-medium text-heading">{resortName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">تاريخ الدخول:</span>
                  <span className="font-medium text-heading">{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">تاريخ الخروج:</span>
                  <span className="font-medium text-heading">{checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">عدد الليالي:</span>
                  <span className="font-medium text-heading">{nights} ليلة</span>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span className="text-text">الإجمالي:</span>
                    <span className="font-medium text-heading">
                      {totalPrice} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-text">مبلغ التأمين:</span>
                    <span className="font-medium text-heading">50 {currency}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-heading">المجموع النهائي:</span>
                    <span className="text-primary">
                      {Number(totalPrice) + 50} {currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-6 bg-white rounded-xl dark:bg-[#18181b] border border-gray-200 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-heading">بيانات العميل</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text">الاسم:</span>
                  <span className="font-medium text-heading">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">البريد:</span>
                  <span className="font-medium text-heading">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">الهاتف:</span>
                  <span className="font-medium text-heading">{phone}</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-6 py-4 text-lg font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "جاري المعالجة..." : "ادفع الآن"}
            </button>

            <p className="text-sm text-center text-text">🔒 الدفع آمن ومشفّر بواسطة Stripe</p>

            {/* WhatsApp Support Button */}
            <a
              href="https://wa.me/97336118277?text=مرحباً، أحتاج مساعدة في عملية الدفع"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 text-white transition rounded-lg bg-[#25D366] hover:bg-[#20BA59]"
            >
              <img
                src="/payment/whatsapp-logo.svg"
                alt="WhatsApp"
                className="w-6 h-6"
              />
              <div className="text-right">
                <div className="font-semibold">مساعدة وحلول مصرفية</div>
                <div className="text-xs">متاح 24/7 - +973 3611 8277</div>
              </div>
            </a>
          </div>

          {/* Right: iPhone Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-heading">ادفع بواسطة Apple Pay</h2>
              <p className="text-text">شاهد كيفية الدفع بواسطة Apple Pay من Apple مباشرة</p>
            </div>

            <div className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[240px] lg:max-w-[260px]">
              <Iphone
                src="/payment/app;e-pay.gif"
                mediaClassName="object-contain"
                className="mx-auto"
              />
            </div>

            <a
              href="https://www.apple.com/apple-pay/how-to/#video-pay-online"
              target="_blank"
              rel="noreferrer"
              className="mt-6 text-sm text-primary hover:underline"
            >
              فتح المصدر الرسمي من Apple
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
