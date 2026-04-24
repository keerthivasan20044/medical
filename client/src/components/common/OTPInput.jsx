import { useRef } from 'react';

export default function OTPInput({ length = 6, value = [], onChange, onComplete, autoFocus = false }) {
  const refs = useRef([]);

  const handleChange = (idx, val) => {
    const cleaned = val.replace(/\s/g, '').slice(-1);
    const next = [...value];
    next[idx] = cleaned;
    onChange(next);
    if (cleaned && refs.current[idx + 1]) refs.current[idx + 1].focus();
    if (next.every((d) => d)) onComplete?.(next.join(''));
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !value[idx] && refs.current[idx - 1]) refs.current[idx - 1].focus();
    if (e.key === 'ArrowLeft' && refs.current[idx - 1]) refs.current[idx - 1].focus();
    if (e.key === 'ArrowRight' && refs.current[idx + 1]) refs.current[idx + 1].focus();
  };

  const handlePaste = (idx, e) => {
    const pasted = e.clipboardData.getData('text');
    if (!pasted) return;
    const digits = pasted.replace(/\D/g, '').slice(0, length);
    if (!digits) return;
    e.preventDefault();
    const next = [...value];
    digits.split('').forEach((digit, offset) => {
      if (idx + offset < length) next[idx + offset] = digit;
    });
    onChange(next);
    const nextIndex = Math.min(idx + digits.length, length - 1);
    refs.current[nextIndex]?.focus();
    if (next.every((d) => d)) onComplete?.(next.join(''));
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          className="w-12 h-14 md:w-16 md:h-20 text-center border-2 border-gray-100 rounded-2xl text-2xl font-syne font-black text-[#0a1628] focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 transition-all outline-none bg-white shadow-soft"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
