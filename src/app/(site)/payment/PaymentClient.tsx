"use client";

import { useSearchParams } from "next/navigation";
import { Iphone } from "@/components/ui/iphone";
import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";
import { getResortById } from "@/assets/resorts";
import { calculateNights, calculateTotalPrice } from "@/utils/utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [draft, setDraft] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests?: string | number;
    email?: string;
    phone?: string;
  } | null>(null);

  const resortId = searchParams.get("resortId") || "";
  const resortName = searchParams.get("resortName") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const nights = searchParams.get("nights") || "0";
  const totalPrice = searchParams.get("totalPrice") || "0";
  const currency = searchParams.get("currency") || "د.ب";
  const fullName = searchParams.get("fullName") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const guests = searchParams.get("guests") || "";

  useEffect(() => {
    try {
      // Payment page doesn't know resortId reliably, so prefer last saved draft if exists.
      const keys = Object.keys(sessionStorage);
      const lastKey = keys
        .filter((k) => k.startsWith("bookingDraft:"))
        .slice(-1)[0];
      if (!lastKey) return;
      const raw = sessionStorage.getItem(lastKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") setDraft(parsed);
    } catch {
      // ignore
    }
  }, []);

  const effective = useMemo(() => {
    return {
      checkIn: checkIn || draft?.checkIn || "",
      checkOut: checkOut || draft?.checkOut || "",
      phone: phone || draft?.phone || "",
      guests: guests || (draft?.guests != null ? String(draft.guests) : ""),
      fullName: fullName || (draft as any)?.fullName || "",
      email: email || draft?.email || "",
    };
  }, [checkIn, checkOut, phone, guests, draft, fullName, email]);

  const resort = useMemo(() => {
    if (!resortId) return undefined;
    return getResortById(resortId);
  }, [resortId]);

  const pricing = useMemo(() => {
    const safeCurrency = resort?.currency || currency || "د.ب";
    const deposit = typeof resort?.deposit === "number" ? resort.deposit : 50;

    const checkInDate = effective.checkIn
      ? new Date(`${effective.checkIn}T00:00:00`)
      : null;
    const checkOutDate = effective.checkOut
      ? new Date(`${effective.checkOut}T00:00:00`)
      : null;

    const computedNights =
      checkInDate && checkOutDate ? calculateNights(checkInDate, checkOutDate) : 0;

    const computedSubtotal =
      resort && checkInDate && checkOutDate
        ? calculateTotalPrice(
            resort.priceRegular,
            resort.priceWeekend,
            checkInDate,
            checkOutDate
          )
        : 0;

    const fallbackSubtotal = Number(totalPrice) || 0;
    const fallbackNights = Number(nights) || 0;

    const subtotal = computedSubtotal || fallbackSubtotal;
    const nightsCount = computedNights || fallbackNights;

    return {
      currency: safeCurrency,
      deposit,
      nights: nightsCount,
      subtotal,
      finalTotal: subtotal + deposit,
      resortName: resort?.name || resortName,
    };
  }, [resort, resortName, currency, effective.checkIn, effective.checkOut, nights, totalPrice]);

  const handlePayment = async () => {
    if (!effective.checkIn || !effective.checkOut || !effective.phone || !effective.email) {
      setError("يرجى إدخال تاريخ الدخول والخروج ورقم التواصل والبريد الإلكتروني أولاً");
      return;
    }

    if (!effective.fullName || effective.fullName.trim().length < 2) {
      setError("يرجى إدخال الاسم الكامل");
      return;
    }

    if (!pricing.resortName) {
      setError("تعذر تحديد الشاليه. يرجى الرجوع وإعادة المحاولة.");
      return;
    }

    if (!pricing.nights || !pricing.subtotal) {
      setError("تعذر حساب السعر. يرجى التأكد من التواريخ ثم إعادة المحاولة.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const paymentData = {
        resortId,
        resortName: pricing.resortName,
        checkIn: effective.checkIn,
        checkOut: effective.checkOut,
        nights: String(pricing.nights),
        totalPrice: String(pricing.subtotal),
        currency: pricing.currency,
        deposit: pricing.deposit,
        fullName: effective.fullName.trim(),
        email: effective.email.trim(),
        phone: effective.phone.trim(),
        guests: effective.guests || "1",
      };

      console.log("PaymentClient: Initiating checkout", {
        resortName: paymentData.resortName,
        checkIn: paymentData.checkIn,
        checkOut: paymentData.checkOut,
        nights: paymentData.nights,
        hasFullName: !!paymentData.fullName,
        hasEmail: !!paymentData.email,
        hasPhone: !!paymentData.phone,
      });

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("PaymentClient: Checkout API error", data);
        throw new Error(data.error || "فشل إنشاء جلسة الدفع");
      }

      console.log("PaymentClient: Checkout session created", {
        sessionId: data.sessionId,
        hasUrl: !!data.url
      });

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("فشل تحميل Stripe");
      }

      try {
        sessionStorage.setItem("lastStripeSessionId", data.sessionId);
        console.log("PaymentClient: Session ID saved to sessionStorage");
      } catch (err) {
        console.warn("PaymentClient: Failed to save session ID", err);
      }

      console.log("PaymentClient: Redirecting to Stripe checkout...");

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
    <main className="min-h-screen  pt-28 pb-16 bg-gray-50 dark:bg-background">
      <div className="px-6 mx-auto max-w-7xl sm:px-6 xl:px-4 md:px-8 md:py-8 xl:py-12 sm">
        <h1 className="mb-8 text-3xl font-bold text-heading">إتمام الدفع</h1>

        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
            <WorldMap
              dots={[
                {
                  start: { lat: 64.2008, lng: -149.4937 },
                  end: { lat: 34.0522, lng: -118.2437 },
                },
                {
                  start: { lat: 64.2008, lng: -149.4937 },
                  end: { lat: -15.7975, lng: -47.8919 },
                },
                {
                  start: { lat: -15.7975, lng: -47.8919 },
                  end: { lat: 38.7223, lng: -9.1393 },
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 },
                  end: { lat: 28.6139, lng: 77.209 },
                },
                {
                  start: { lat: 28.6139, lng: 77.209 },
                  end: { lat: 43.1332, lng: 131.9113 },
                },
                {
                  start: { lat: 28.6139, lng: 77.209 },
                  end: { lat: -1.2921, lng: 36.8219 },
                },
              ]}
            />
          </div>

          <div className="relative mt-8 z-10">
            <div className="mb-10">
              <div className="max-w-7xl mx-auto text-center">
                <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
                  Secure Payment{" "}
                  <span className="text-neutral-400">
                    {"".split("").map((word, idx) => (
                      <motion.span
                        key={idx}
                        className="inline-block"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.04 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                </p>
                <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
                  احجز الآن ببطاقة البنك أو Apple Pay أو Google Pay
                  <br />
                  وسائل الدفع محمية وآمنة وتستخدم SSL وضد انتي فاي ومدعومة من أمنيتي فاي & stripe provider
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Payment Info */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-6 bg-white rounded-xl dark:bg-[#18181b] border border-gray-200 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-heading">ملخص الحجز</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text">الشاليه:</span>
                  <span className="font-medium text-heading">{pricing.resortName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">تاريخ الدخول:</span>
                  <span className="font-medium text-heading">{effective.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">تاريخ الخروج:</span>
                  <span className="font-medium text-heading">{effective.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">عدد الليالي:</span>
                  <span className="font-medium text-heading">{pricing.nights} ليلة</span>
                </div>

                {effective.guests ? (
                  <div className="flex justify-between">
                    <span className="text-text">عدد الضيوف:</span>
                    <span className="font-medium text-heading">{effective.guests}</span>
                  </div>
                ) : null}

                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between">
                    <span className="text-text">الإجمالي:</span>
                    <span className="font-medium text-heading">
                      {pricing.subtotal} {pricing.currency}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-text">مبلغ التأمين:</span>
                    <span className="font-medium text-heading">{pricing.deposit} {pricing.currency}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-gray-300 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-heading">المجموع النهائي:</span>
                    <span className="text-primary">
                      {pricing.finalTotal} {pricing.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-6 bg-white rounded-xl dark:bg-[#18181b] border border-gray-200 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-heading">بيانات التواصل</h2>
              <div className="space-y-2 text-sm">
                {effective.fullName ? (
                  <div className="flex justify-between">
                    <span className="text-text">الاسم:</span>
                    <span className="font-medium text-heading">{effective.fullName}</span>
                  </div>
                ) : null}
                {effective.email ? (
                  <div className="flex justify-between">
                    <span className="text-text">البريد:</span>
                    <span className="font-medium text-heading">{effective.email}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span className="text-text">الهاتف:</span>
                  <span className="font-medium text-heading">{effective.phone}</span>
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
              className="mt-4 text-sm font-bold mb-10 text-success hover:underline"
            >
              فتح المصدر الرسمي من Apple
            </a>
          </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
