import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4 opacity-30">α β γ</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">This text has been lost to history...</p>
        <Link href="/" className="px-6 py-3 bg-[#C9A227] text-black rounded-lg font-bold hover:bg-[#E8D5A3]">
          Return Home
        </Link>
      </div>
    </div>
  );
}
