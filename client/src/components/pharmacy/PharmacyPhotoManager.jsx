import React, { useState } from 'react';
import { Camera, RefreshCw, Trash2, CheckCircle, Plus, Loader2, X } from 'lucide-react';
import { pharmacyService } from '../../services/apiServices';
import { toast } from 'react-hot-toast';

const PharmacyPhotoManager = ({ pharmacy, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefetch = async () => {
    try {
      setRefreshing(true);
      const data = await pharmacyService.fetchPhoto(pharmacy._id);
      toast.success(data.isFallback ? 'No new photos found, used fallbacks.' : 'Photos updated from Google!');
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to fetch photos from Google.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSetMain = async (url) => {
    try {
      setLoading(true);
      await pharmacyService.setMainPhoto(pharmacy._id, url);
      toast.success('Main photo updated!');
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to set main photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      setLoading(true);
      await pharmacyService.deletePhoto(pharmacy._id, url);
      toast.success('Photo removed.');
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to delete photo.');
    } finally {
      setLoading(false);
    }
  };

  const allPhotos = [
    ...(pharmacy.customPhotos || []),
    ...(pharmacy.photos || [])
  ];

  return (
    <div className="bg-[#12151f] rounded-[2.5rem] p-8 border border-white/5 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-syne font-black text-2xl text-white uppercase italic tracking-tighter">Photo Management</h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest italic">Manage Google & Custom Photos</p>
        </div>
        
        <button 
          onClick={handleRefetch}
          disabled={refreshing}
          className="h-12 px-6 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center gap-3 text-teal-400 text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
        >
          {refreshing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          Refetch from Google
        </button>
      </div>

      {/* Main Preview */}
      <div className="relative w-full h-64 bg-white/5 rounded-[2rem] overflow-hidden group">
        <img 
          src={pharmacy.mainPhoto || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80'} 
          className="w-full h-full object-cover" 
          alt="Main"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div className="px-4 py-2 bg-teal-500 text-[#0a1628] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-2">
            <Camera size={14} /> Active Hero Photo
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allPhotos.map((url, idx) => (
          <div key={idx} className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden group border border-white/5">
            <img src={url} className="w-full h-full object-cover transition-all group-hover:scale-110" alt={`Gallery ${idx}`} />
            
            <div className="absolute inset-0 bg-[#0a1628]/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
              <button 
                onClick={() => handleSetMain(url)}
                disabled={loading || pharmacy.mainPhoto === url}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${pharmacy.mainPhoto === url ? 'bg-teal-500 text-[#0a1628]' : 'bg-white/10 text-white hover:bg-white'}`}
              >
                <CheckCircle size={18} />
              </button>
              <button 
                onClick={() => handleDelete(url)}
                disabled={loading}
                className="h-10 w-10 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {pharmacy.mainPhoto === url && (
              <div className="absolute top-2 right-2 h-6 w-6 bg-teal-500 rounded-lg flex items-center justify-center text-[#0a1628] shadow-lg">
                <CheckCircle size={14} />
              </div>
            )}
          </div>
        ))}

        <button className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-teal-500/50 hover:text-teal-400 transition-all">
          <Plus size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Upload Custom</span>
        </button>
      </div>
    </div>
  );
};

export default PharmacyPhotoManager;
