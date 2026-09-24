export function ScanCameraReticle() {
  return (
    <div className='pointer-events-none absolute inset-0 flex items-center justify-center p-6'>
      <div className='relative h-40 w-64 sm:h-44 sm:w-72 rounded-2xl border-2 border-dashed border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.2)] bg-indigo-950/10 backdrop-blur-2xs'>
        {/* Corner Accents */}
        <div className='absolute -top-1 -left-1 h-5 w-5 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg' />
        <div className='absolute -top-1 -right-1 h-5 w-5 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg' />
        <div className='absolute -bottom-1 -left-1 h-5 w-5 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg' />
        <div className='absolute -bottom-1 -right-1 h-5 w-5 border-b-3 border-r-3 border-emerald-400 rounded-br-lg' />

        {/* Animated Laser Scanning Beam */}
        <div className='h-0.5 w-full bg-linear-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_12px_#34d399]' />
      </div>
    </div>
  );
}
