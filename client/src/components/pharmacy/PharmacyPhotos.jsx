import { useState } from 'react';
import { Camera, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PharmacyPhotos({ pharmacy }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const PHOTOS = pharmacy.photos || [
    'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631549916768-4119b295f1c1?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1000&auto=format&fit=crop',
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <h3 className="font-syne font-black text-xl text-navy uppercase italic flex items-center gap-3">
          <Camera size={24} className="text-brand-teal" /> Visual Registry
        </h3>
        <span className="text-[10px] font-black text-navy/20 uppercase tracking-widest italic">{PHOTOS.length} Captured Instances</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {PHOTOS.map((photo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedPhoto({ url: photo, idx })}
            className="aspect-square rounded-[2rem] overflow-hidden group cursor-pointer relative shadow-sm hover:shadow-2xl transition-all"
          >
            <img 
              src={photo} 
              alt={`Node View ${idx + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Maximize2 size={32} className="text-white drop-shadow-lg" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-8 right-8 h-16 w-16 bg-white/10 text-white rounded-[2rem] flex items-center justify-center hover:bg-white hover:text-navy transition-all"
            >
               <X size={32} />
            </button>

            <div className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-full flex items-center justify-center">
               <button className="absolute left-0 h-16 w-16 bg-white/10 text-white rounded-[2rem] flex items-center justify-center hover:bg-white hover:text-navy transition-all">
                  <ChevronLeft size={32} />
               </button>
               
               <motion.img 
                 key={selectedPhoto.url}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 src={selectedPhoto.url} 
                 className="max-w-full max-h-full object-contain rounded-[3rem] shadow-2xl"
               />

               <button className="absolute right-0 h-16 w-16 bg-white/10 text-white rounded-[2rem] flex items-center justify-center hover:bg-white hover:text-navy transition-all">
                  <ChevronRight size={32} />
               </button>
            </div>

            <div className="absolute bottom-8 left-0 right-0 text-center">
               <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">
                  Instance {selectedPhoto.idx + 1} of {PHOTOS.length}
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
