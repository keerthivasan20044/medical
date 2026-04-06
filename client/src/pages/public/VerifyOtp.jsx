export default function VerifyOtp() {
  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-soft text-center">
        <h1 className="font-heading text-2xl">OTP Verification</h1>
        <p className="text-sm text-brand-muted">Enter the 6-digit OTP sent to your phone.</p>
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <input key={i} className="w-10 h-12 border border-brand-border rounded-xl text-center text-lg" />
          ))}
        </div>
        <button className="mt-6 w-full bg-brand-teal text-white py-2 rounded-xl">Verify</button>
      </div>
    </div>
  );
}
