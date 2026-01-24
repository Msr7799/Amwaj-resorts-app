import { policies } from '@/data/policies';
import { Shield, Clock, DollarSign, AlertTriangle } from 'lucide-react';

export default function PolicyPage() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-20">
        <div className="container text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            القوانين والشروط
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            يرجى قراءة القوانين والشروط بعناية قبل إتمام الحجز
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">الدخول</h3>
              <p className="text-gray-600">3:00 عصرًا</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">الخروج</h3>
              <p className="text-gray-600">12:00 ظهرًا</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">التأمين</h3>
              <p className="text-gray-600">50 دينار</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  قوانين وشروط الحجز
                </h2>
                <p className="text-gray-600">
                  يرجى الالتزام بجميع القوانين التالية لضمان إقامة مريحة وآمنة للجميع
                </p>
              </div>
            </div>

            <ol className="space-y-6">
              {policies.map((policy) => (
                <li key={policy.id} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {policy.id}
                  </span>
                  <p className="text-gray-700 text-lg leading-relaxed pt-1">
                    {policy.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-secondary/10 border-r-4 border-secondary rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              ملاحظة هامة
            </h3>
            <p className="text-gray-700 leading-relaxed">
              نحن نهدف إلى توفير تجربة استثنائية لجميع ضيوفنا. الالتزام بهذه القوانين يساعدنا 
              في الحفاظ على جودة خدماتنا ومرافقنا. نشكر لكم تعاونكم وتفهمكم.
            </p>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/#resorts"
              className="btn btn-primary text-lg px-8 py-4 inline-block"
            >
              احجز شاليهك الآن
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
