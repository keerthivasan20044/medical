import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Standard button architecture for MediReach.
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
  const base = "h-14 px-8 rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative overflow-hidden group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#02C39A] to-[#028090] text-white shadow-mint hover:shadow-2xl hover:-translate-y-px",
    outline: "bg-white border-2 border-[#028090] text-[#028090] hover:bg-gray-50",
    ghost: "bg-transparent text-gray-400 hover:bg-gray-50 hover:text-[#0a1628]",
    danger: "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-xl hover:shadow-2xl"
  };

  return (
    <motion.button 
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <>
          {icon && <span className="group-hover:translate-x-[-2px] transition-transform">{icon}</span>}
          {children}
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
    <div className={`space-y-4 w-full ${className}`}>
      {label && <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4">{label}</label>}
      <div className="relative group">
        <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-gray-300 group-focus-within:text-[#02C39A]'}`}>
          {Icon && <Icon size={20} />}
        </div>
        <input 
          className={`w-full bg-gray-50 border-2 border-transparent rounded-2xl py-6 pr-8 outline-none transition-all font-dm text-lg italic shadow-inner focus:bg-white ${Icon ? 'pl-20' : 'pl-8'} ${error ? 'border-red-500/20' : 'focus:border-[#02C39A]/20'}`}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`text-[10px] font-black uppercase tracking-widest ml-4 ${error ? 'text-red-500' : 'text-gray-300 italic'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Multiple-choice selector architecture.
 */
export function Select({ label, options = [], ...props }) {
  return (
    <div className="space-y-4 w-full">
      {label && <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4">{label}</label>}
      <select 
        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-6 px-8 outline-none transition-all font-dm text-lg italic shadow-inner appearance-none cursor-pointer focus:bg-white focus:border-[#02C39A]/20"
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
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
    <div className="flex gap-3 justify-center">
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
          className="h-16 w-12 text-center text-2xl font-syne font-black bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#02C39A]/40 shadow-inner text-[#0a1628]"
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
    <div className="space-y-4 w-full">
      {label && <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4">{label}</label>}
      <textarea 
        className="w-full bg-gray-50 border-2 border-transparent rounded-[3rem] p-8 outline-none transition-all font-dm text-lg italic shadow-inner focus:bg-white focus:border-[#02C39A]/20 resize-none"
        {...props}
      />
    </div>
  );
}
