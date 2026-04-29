import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, ShieldCheck, ArrowRight, Dog, Cat } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-red-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                7/24 Kesintisiz Hizmet
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
                Dostlarınız İçin <span className="text-red-500 italic font-medium">Güvenli</span> Bir Durak.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                İstanbul genelindeki tüm 7/24 açık nöbetçi veterinerleri anında bulun. Acil durumlarda en yakın yardıma saniyeler içinde ulaşın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/map"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 text-white rounded-2xl font-semibold shadow-xl shadow-red-200 hover:bg-red-600 hover:-translate-y-1 transition-all group"
                >
                  Haritayı Keşfet
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-3 items-center ml-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
                    <Dog className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center">
                    <Cat className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="pl-6 text-sm font-medium text-gray-500">Binin üzerinde kayıtlı klinik</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-red-100 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=1000" 
                  alt="Veterinarian with dog" 
                  className="w-full h-full object-cover mix-blend-multiply opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-xs"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Doğrulanmış</div>
                    <div className="font-semibold text-gray-900">Güncel Veriler</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-snug">
                  Klinik bilgileri düzenli olarak kontrol edilir ve güncellenir.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neden Vetİst?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto italic">
              Evcil dostlarınızın sağlığı hiçbir saniye beklemeye gelmez.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "En Yakın Klinik",
                desc: "Konumunuzu kullanarak saniyeler içinde size en yakın açık veteinerleri bulun."
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "7/24 Aktif",
                desc: "Sadece geceleri değil, günün her saati hizmet veren klinikleri listeliyoruz."
              },
              {
                icon: <Phone className="w-6 h-6" />,
                title: "Tek Tıkla Arama",
                desc: "Harita üzerinden doğrudan klinik numaralarını arayın veya yol tarifi alın."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-[#FDFCFB] border border-gray-100 hover:border-red-200 group transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
