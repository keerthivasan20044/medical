import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight } from 'lucide-react';

/**
 * Standard button architecture for MediPharm.
 * @param {string} variant - primary | outline | ghost | danger
 * @param {boolean} loading - spinner inside button
 * @param {ReactNode} icon - icon left of text
 */
export function Button({ 
  children, 
  variant = 'primary', 
  loading, 
  icon, 
  className = '', 
  ...props 
}) {
  const base = "h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl font-syne font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 relative overflow-hidden group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-navy text-teal-400 shadow-lg hover:shadow-2xl hover:bg-teal-500 hover:text-white",
    outline: "bg-white border-2 border-navy text-navy hover:bg-gray-50",
    ghost: "bg-transparent text-gray-400 hover:bg-gray-50 hover:text-navy",
    danger: "bg-red-500 text-white shadow-xl hover:bg-red-600"
  };

  return (
    <motion.button 
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <>
          {icon && <span className="group-hover:translate-x-[-2px] transition-transform shrink-0">{icon}</span>}
          <span className="truncate">{children}</span>
        </>
      )}
    </motion.button>
  );
}

/**
 * Specialized input architecture with labels and error states.
 */
export function Input({ label, icon: Icon, error, helperText, className = '', ...props }) {
  return (
    <div className={`space-y-2 md:space-y-4 w-full ${className}`}>
      {label && <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-300 ml-3 md:ml-4">{label}</label>}
      <div className="relative group">
        <div className={`absolute left-5 md:left-6 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-gray-300 group-focus-within:text-teal-600'}`}>
          {Icon && <Icon size={18} />}
        </div>
        <input 
          className={`w-full bg-gray-50 border-2 border-transparent rounded-xl md:rounded-2xl py-4 md:py-6 pr-6 md:pr-8 outline-none transition-all font-dm text-base md:text-lg italic shadow-inner focus:bg-white ${Icon ? 'pl-14 md:pl-20' : 'pl-6 md:pl-8'} ${error ? 'border-red-500/20' : 'focus:border-teal-500/20'}`}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-3 md:ml-4 ${error ? 'text-red-500' : 'text-gray-300 italic'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export function Select({ label, options = [], ...props }) {
  return (
    <div className="space-y-2 md:space-y-4 w-full">
      {label && <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-300 ml-3 md:ml-4">{label}</label>}
      <div className="relative">
        <select 
          className="w-full bg-gray-50 border-2 border-transparent rounded-xl md:rounded-2xl py-4 md:py-6 px-6 md:px-8 outline-none transition-all font-dm text-base md:text-lg italic shadow-inner appearance-none cursor-pointer focus:bg-white focus:border-teal-500/20"
          {...props}
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
           <ChevronRight size={18} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}

/**
 * OTP input: individual digit boxes with auto-focus.
 * @param {number} length - number of OTP digits (default 6)
 * @param {function} onComplete - called with full OTP string when all digits filled
 */
export function OTPInput({ length = 6, onComplete }) {
  const inputs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    e.target.value = val.slice(-1);
    if (val && idx < length - 1) inputs.current[idx + 1]?.focus();
    const otp = inputs.current.map(i => i?.value || '').join('');
    if (otp.length === length) onComplete?.(otp);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
    if (e.key === 'Enter') {
      const otp = inputs.current.map(i => i?.value || '').join('');
      if (otp.length === length) onComplete?.(otp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
    if (!data) return;
    
    data.split('').forEach((char, i) => {
      if (inputs.current[i]) {
        inputs.current[i].value = char;
      }
    });

    const otp = inputs.current.map(i => i?.value || '').slice(0, data.length).join('');
    if (otp.length === length) {
       onComplete?.(otp);
       inputs.current[length - 1]?.focus();
    } else {
       inputs.current[data.length]?.focus();
    }
  };

  return (
    <div className="flex gap-2 md:gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="h-12 w-9 md:h-16 md:w-12 text-center text-xl md:text-2xl font-syne font-black bg-gray-50 border-2 border-transparent rounded-xl md:rounded-2xl outline-none transition-all focus:bg-white focus:border-teal-500/40 shadow-inner text-navy"
        />
      ))}
    </div>
  );
}

/**
 * Multi-line entry node.
 */
export function Textarea({ label, ...props }) {
  return (
    <div className="space-y-2 md:space-y-4 w-full">
      {label && <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-300 ml-3 md:ml-4">{label}</label>}
      <textarea 
        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl md:rounded-[3rem] p-6 md:p-8 outline-none transition-all font-dm text-base md:text-lg italic shadow-inner focus:bg-white focus:border-teal-500/20 resize-none"
        {...props}
      />
    </div>
  );
}
