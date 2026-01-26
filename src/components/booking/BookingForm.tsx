"use client";

import { useState } from "react";
import { Resort } from "@/types/resort";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  resort: Resort;
}

export default function BookingForm({ resort }: BookingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const calculateNights = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = (nights: number): number => {
    if (nights === 0) return 0;
    // Simple calculation: all nights at regular price for now
    // You can enhance this to detect weekends
    return nights * resort.priceRegular;
  };

  const nights = calculateNights(formData.checkIn, formData.checkOut);
  const totalPrice = calculateTotalPrice(nights);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.checkIn) {
      newErrors.checkIn = "يرجى اختيار تاريخ الدخول";
    }
    if (!formData.checkOut) {
      newErrors.checkOut = "يرجى اختيار تاريخ الخروج";
    }
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = "تاريخ الخروج يجب أن يكون بعد تاريخ الدخول";
      }
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = "يرجى إدخال الاسم الكامل";
    }
    if (!formData.email.trim()) {
      newErrors.email = "يرجى إدخال البريد الإلكتروني";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "يرجى إدخال رقم الهاتف";
    }
    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = "يجب الموافقة على القوانين والشروط";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const queryParams = new URLSearchParams({
      resortName: resort.name,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      nights: nights.toString(),
      totalPrice: totalPrice.toString(),
      currency: resort.currency,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      guests: formData.guests.toString(),
      specialRequests: formData.specialRequests,
    });

    router.push(`/payment?${queryParams.toString()}`);
  };

  return (
    <div className="p-6 bg-white rounded-xl dark:bg-[#18181b] border border-gray-200 dark:border-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-heading">احجز الآن</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Check-in & Check-out */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-text">
              📅 تاريخ الدخول
            </label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.checkIn ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.checkIn && (
              <p className="mt-1 text-xs text-red-500">{errors.checkIn}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-text">
              📅 تاريخ الخروج
            </label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              min={formData.checkIn || new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.checkOut ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.checkOut && (
              <p className="mt-1 text-xs text-red-500">{errors.checkOut}</p>
            )}
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block mb-2 text-sm font-medium text-text">
            👥 عدد الضيوف
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max="12"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-text">
            👤 الاسم الكامل
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="أدخل اسمك الكامل"
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.fullName ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-text">
              ✉️ البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-text">
              📞 رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+973 XXXX XXXX"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block mb-2 text-sm font-medium text-text">
            💬 طلبات خاصة (اختياري)
          </label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={3}
            placeholder="أخبرنا إذا كان لديك أي طلبات خاصة..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none dark:border-gray-700 bg-white dark:bg-background text-heading focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Price Summary */}
        {totalPrice > 0 && (
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text">عدد الليالي:</span>
              <span className="font-semibold text-heading">{nights} ليلة</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text">سعر الإقامة:</span>
              <span className="font-semibold text-heading">
                {totalPrice} {resort.currency}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text">مبلغ التأمين:</span>
              <span className="font-semibold text-heading">50 {resort.currency}</span>
            </div>
            <div className="pt-2 border-t border-primary/20">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-heading">المجموع:</span>
                <span className="text-primary">
                  {totalPrice + 50} {resort.currency}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-text">
              * مبلغ التأمين سيتم إرجاعه عند المغادرة
            </p>
          </div>
        )}

        {/* Terms Acceptance */}
        <div className="p-4 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-background/50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-text">
              لقد قرأت ووافقت على{" "}
              <a
                href="/policy"
                target="_blank"
                className="font-medium underline text-primary hover:text-primary/80"
              >
                القوانين والشروط
              </a>{" "}
              الخاصة بالحجز
            </span>
          </label>
          {errors.acceptedTerms && (
            <p className="mt-2 text-xs text-red-500">{errors.acceptedTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-4 text-lg font-semibold text-white transition rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          متابعة إلى الدفع
        </button>
      </form>
    </div>
  );
}
