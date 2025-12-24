'use client';

export default function FloatingGreekLetters() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
      <div className="absolute text-6xl animate-pulse" style={{ top: '10%', left: '5%' }}>α</div>
      <div className="absolute text-6xl animate-pulse" style={{ top: '20%', right: '10%' }}>β</div>
      <div className="absolute text-6xl animate-pulse" style={{ top: '60%', left: '15%' }}>γ</div>
      <div className="absolute text-6xl animate-pulse" style={{ top: '70%', right: '20%' }}>δ</div>
      <div className="absolute text-6xl animate-pulse" style={{ top: '40%', left: '80%' }}>ε</div>
    </div>
  );
}
