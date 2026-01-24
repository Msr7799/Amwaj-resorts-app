'use client';

import { useState } from 'react';
import { Resort } from '@/types';
import { Calendar, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { calculateTotalPrice, calculateNights, formatPrice } from '@/lib/utils';

interface BookingFormProps {
  resort: Resort;
}

export default function BookingForm({ resort }: BookingFormProps) {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const totalPrice =
    formData.checkIn && formData.checkOut
      ? calculateTotalPrice(
          resort.priceRegular,
          resort.priceWeekend,
          new Date(formData.checkIn),
          new Date(formData.checkOut)
        )
      : 0;

  const nights =
    formData.checkIn && formData.checkOut
      ? calculateNights(new Date(formData.checkIn), new Date(formData.checkOut))
      : 0;

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال طلب الحجز!</h3>
        <p className="text-gray-700 mb-6">
          سنتواصل معك قريباً لتأكيد الحجز عبر الهاتف أو البريد الإلكتروني
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn btn-primary"
        >
          حجز جديد
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">احجز الآن</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline ml-2" />
              تاريخ الدخول
            </label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline ml-2" />
              تاريخ الخروج
            </label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
              required
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline ml-2" />
            عدد الضيوف
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max="12"
            required
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline ml-2" />
            الاسم الكامل
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="input"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline ml-2" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline ml-2" />
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input"
              placeholder="+973 XXXX XXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline ml-2" />
            طلبات خاصة (اختياري)
          </label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={4}
            className="input resize-none"
            placeholder="أخبرنا إذا كان لديك أي طلبات خاصة..."
          />
        </div>

        {totalPrice > 0 && (
          <div className="bg-primary/10 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">عدد الليالي:</span>
              <span className="font-semibold text-gray-900">{nights} ليلة</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">مبلغ التأمين:</span>
              <span className="font-semibold text-gray-900">50 دينار</span>
            </div>
            <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">المجموع:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(totalPrice, resort.currency)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              * مبلغ التأمين سيتم إرجاعه عند المغادرة
            </p>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full text-lg py-4">
          إرسال طلب الحجز
        </button>

        <p className="text-sm text-gray-600 text-center">
          بإرسال الطلب، أنت توافق على{' '}
          <a href="/policy" className="text-primary hover:underline">
            القوانين والشروط
          </a>
        </p>
      </form>
    </div>
  );
}
