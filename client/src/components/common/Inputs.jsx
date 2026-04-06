import { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, Phone, X, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 4-6 digit security protocol input.
 */
export function OTPInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.slice(-1);
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < length - 1) inputs.current[index + 1].focus();
    if (newOtp.every(x => x !== '') && onComplete) onComplete(newOtp.join(''));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-4 justify-center py-6">
      {otp.map((digit, i) => (
        <input 
          key={i}
          ref={el => inputs.current[i] = el}
          className="h-20 w-16 bg-gray-50 border-2 border-transparent rounded-2xl text-center font-syne font-black text-2xl text-[#0a1628] focus:bg-white focus:border-[#02C39A]/20 outline-none transition-all shadow-inner"
          value={digit}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          maxLength={1}
        />
      ))}
    </div>
  );
}

/**
 * Standard +91 mobile enclave input.
 */
export function PhoneInput({ prefix = "+91", ...props }) {
  return (
    <div className="space-y-4 w-full">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-6">Mobile Architecture</label>
      <div className="relative group flex items-center bg-gray-50 border-2 border-transparent rounded-[3rem] px-8 py-6 focus-within:bg-white focus-within:border-[#02C39A]/20 transition-all shadow-inner">
         <div className="flex items-center gap-3 pr-8 border-r border-gray-100 mr-8 text-gray-400 font-syne font-black text-lg group-focus-within:text-[#0a1628] transition">
            <Phone size={18} className="text-[#02C39A]" /> {prefix}
         </div>
         <input 
            type="tel"
            className="w-full bg-transparent outline-none font-dm text-lg italic tracking-widest placeholder-gray-200"
            placeholder="91234 56789"
            {...props}
         />
      </div>
    </div>
  );
}

/**
 * Advanced search terminal with live node suggestions.
 */
export function SearchInput({ placeholder, suggestions = [], onSearch }) {
  const [val, setVal] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full group">
       <div className="h-20 bg-white border border-gray-100 rounded-full px-8 flex items-center gap-6 shadow-2xl transition-all focus-within:shadow-mint/20 focus-within:border-[#02C39A]/40 duration-500">
          <div className="h-10 w-10 bg-[#0a1628] text-[#02C39A] rounded-xl flex items-center justify-center shadow-lg"><SearchIcon size={20} /></div>
          <input 
            className="flex-1 bg-transparent border-none outline-none font-syne font-black text-xl placeholder-gray-200"
            placeholder={placeholder}
            value={val}
            onChange={e => { setVal(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
          />
          {val && <button onClick={() => setVal('')} className="text-gray-300 hover:text-red-500 transition"><X size={20} /></button>}
          <button className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-focus-within:text-[#028090] transition hover:bg-white"><SlidersHorizontal size={20}/></button>
       </div>
       
       <AnimatePresence>
          {isOpen && val && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-24 left-4 right-4 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_45px_100px_rgba(0,0,0,0.1)] z-[100] space-y-8"
            >
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-200">Recommended Enclave Nodes</h4>
               <div className="space-y-4">
                  {suggestions.slice(0, 5).map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setVal(s); setIsOpen(false); }}
                      className="w-full text-left p-6 hover:bg-gray-50 rounded-2xl transition flex items-center justify-between group/item"
                    >
                       <span className="font-syne font-black text-lg text-[#0a1628]">{s}</span>
                       <ArrowUpRight className="text-gray-200 group-hover/item:text-[#02C39A] transition" size={18} />
                    </button>
                  ))}
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}

/**
 * Filter architecture price range enclave.
 */
export function PriceRangeSlider({ min = 0, max = 2000, onChange }) {
  const [range, setRange] = useState([min, max]);

  return (
    <div className="space-y-8 py-6">
       <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Price Architecture</label>
          <div className="font-syne font-black text-xs text-[#0a1628]">₹{range[0]} — ₹{range[1]}</div>
       </div>
       <div className="relative h-2 bg-gray-50 rounded-full border border-gray-100 shadow-inner group">
          <div className="absolute h-full bg-[#02C39A] rounded-full" style={{ left: '0%', right: '0%' }} />
          <div className="absolute top-1/2 left-[0%] -translate-y-1/2 h-8 w-8 bg-white border-4 border-[#0a1628] rounded-2xl shadow-xl cursor-pointer hover:border-[#02C39A] transition duration-500" />
          <div className="absolute top-1/2 left-[100%] -translate-x-full -translate-y-1/2 h-8 w-8 bg-white border-4 border-[#0a1628] rounded-2xl shadow-xl cursor-pointer hover:border-[#02C39A] transition duration-500" />
       </div>
       <div className="flex items-center justify-between text-[8px] font-black text-gray-200 uppercase tracking-widest italic">
          <span>₹{min} Protocol</span>
          <span>₹{max} Max Enclave</span>
       </div>
    </div>
  );
}
