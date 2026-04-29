import { Link, useLocation } from 'react-router-dom';
import { ShieldPlus, MapPin, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const isMap = location.pathname === '/map';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-red-500 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-semibold text-xl tracking-tight text-gray-900">Vetİst</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${!isMap ? 'text-red-500' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Ana Sayfa
          </Link>
          <Link 
            to="/map" 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isMap 
                ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Harita
          </Link>
        </div>
      </div>
    </nav>
  );
}
