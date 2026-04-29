import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { fetchVetData } from '../utils/csvParser';
import { VetClinic } from '../types';
import { Phone, MapPin, Search, Loader2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Fix for default marker icons in Leaflet with React
// Using a custom SVG marker for better aesthetic
const customIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-black/20 transform -translate-x-1/2 -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
        </div>`,
  iconSize: [0, 0], // Anchor is handled by translate
  iconAnchor: [0, 0]
});

const ISTANBUL_CENTER: [number, number] = [41.0082, 28.9784];

export default function MapPage() {
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchVetData();
        setClinics(data);
      } catch (err) {
        console.error('Failed to load vet data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredClinics = clinics.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen pt-16 flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-96 flex flex-col border-r border-gray-200 bg-white z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Veterinerler</h1>
          <p className="text-sm text-gray-500 mb-6 italic">İstanbul genelindeki nöbetçi klinikler</p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Klinik veya ilçe ara..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm">Veriler yükleniyor...</p>
            </div>
          ) : filteredClinics.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm italic">Sonuç bulunamadı.</p>
            </div>
          ) : (
            filteredClinics.map((clinic, idx) => (
              <motion.div 
                key={idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                  selectedClinic?.name === clinic.name 
                    ? 'border-red-500 bg-red-50 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-300 bg-[#FDFCFB]'
                }`}
                onClick={() => setSelectedClinic(clinic)}
              >
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-500 transition-colors uppercase text-sm tracking-tight">
                  {clinic.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {clinic.district}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 italic">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Ayrıntılar İçin Tıkla</span>
                  <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    <Navigation className="w-3 h-3 text-red-500" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative">
        <MapContainer 
          center={ISTANBUL_CENTER} 
          zoom={11} 
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          {filteredClinics.map((clinic, idx) => (
            <Marker 
              key={idx} 
              position={[clinic.lat, clinic.lng]} 
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedClinic(clinic)
              }}
            >
              <Tooltip direction="top" offset={[0, -15]} opacity={1} permanent={false}>
                <div className="px-2 py-1">
                  <div className="font-bold text-gray-900 text-xs italic uppercase tracking-tight">{clinic.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{clinic.district}</div>
                </div>
              </Tooltip>
              <Popup>
                <div className="min-w-[200px] p-1">
                  <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm italic">{clinic.name}</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                    {clinic.phone && clinic.phone !== '-' && (
                      <a 
                        href={`tel:${clinic.phone}`}
                        className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Aramak İçin Tıkla
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Fly to selected clinic */}
          <ClinicFlyer clinic={selectedClinic} />
        </MapContainer>

        {/* Info Card Overlay (Mobile Friendly) */}
        <AnimatePresence>
          {selectedClinic && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-40px)] max-w-sm"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400" />
                <button 
                  onClick={() => setSelectedClinic(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-gray-900 mb-1 italic uppercase tracking-tighter leading-tight">
                      {selectedClinic.name}
                    </h2>
                    <p className="text-sm text-gray-500 italic mb-4">{selectedClinic.district}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3 text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{selectedClinic.address}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${selectedClinic.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-2xl font-bold italic shadow-lg shadow-red-200 hover:bg-red-600 transition-all uppercase tracking-widest text-xs"
                    >
                      <Phone className="w-4 h-4" />
                      ARA
                    </a>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedClinic.lat},${selectedClinic.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 flex items-center justify-center bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      <Navigation className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Separate component for Map hook usage
import { useMap } from 'react-leaflet';
import { HeartPulse } from 'lucide-react';

function ClinicFlyer({ clinic }: { clinic: VetClinic | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (clinic) {
      map.flyTo([clinic.lat, clinic.lng], 15, {
        duration: 1.5
      });
    }
  }, [clinic, map]);
  
  return null;
}
