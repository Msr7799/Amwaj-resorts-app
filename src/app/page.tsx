import HeroSlider from '@/components/home/HeroSlider';
import ResortCard from '@/components/resort/ResortCard';
import { resorts } from '@/data/resorts';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <section id="resorts" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              شاليهاتنا الفاخرة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اختر من بين شاليهاتنا الفاخرة المجهزة بالكامل للاستمتاع بإقامة لا تُنسى
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resorts.map((resort) => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            جاهز للحجز؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            لا تفوت الفرصة واحجز شاليهك المفضل الآن للاستمتاع بعطلة استثنائية
          </p>
          <a href="#resorts" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4">
            احجز الآن
          </a>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-600">
              نحن هنا للإجابة على جميع استفساراتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الهاتف</h3>
              <a href="tel:+973xxxxxxxx" className="text-gray-600 hover:text-primary transition-colors">
                +973 رقم التواصل هنا
              </a>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">البريد الإلكتروني</h3>
              <a href="mailto:info@amwaj-resort.com" className="text-gray-600 hover:text-primary transition-colors">
الايميل هنا          
              </a>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الموقع</h3>
              <p className="text-gray-600">البحرين، محرق</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
