import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { TrendingUp, Activity, Globe, DollarSign } from 'lucide-react';

export default function Navbar() {
  const currentDate = new Date();

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
        <nav className="w-full border-b border-black bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1400px]">
            
            {/* Left: Date & Status */}
            <div className="hidden md:flex flex-col text-[10px] md:text-xs text-black font-bold font-mono uppercase tracking-widest border-r border-black pr-4 mr-4">
              <span className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-none bg-black animate-pulse"></span>
                 LIVE FEED
              </span>
              <span className="text-black">{format(currentDate, 'dd MMM yyyy - HH:mm', { locale: id })} WIB</span>
            </div>

             <div className="flex-1 md:flex-none flex justify-center md:justify-start">
                  <Link href="/" className="flex items-center space-x-2 group">
                     <div className="h-8 w-8 bg-black rounded-none flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black">
                         <span className="text-white font-serif font-bold italic text-lg">A1</span>
                    </div>
                    <div className="flex flex-col">
                         <span className="font-serif text-xl font-bold tracking-tight leading-none group-hover:opacity-100 transition-opacity text-black">
                             GlobalLens
                         </span>
                         <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold font-sans">Financial Intelligence</span>
                    </div>
                </Link>
            </div>

            {/* Center: Navigation Links (ADDED) */}
            <div className="hidden md:flex items-center space-x-8">
                <Link href="#" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white px-3 py-1 rounded-none transition-all">Markets</Link>
                <Link href="#" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white px-3 py-1 rounded-none transition-all">Technology</Link>
                <Link href="#" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white px-3 py-1 rounded-none transition-all">World</Link>
                <Link href="#" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white px-3 py-1 rounded-none transition-all">Politics</Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end space-x-4">
                 <div className="hidden lg:flex items-center space-x-1 text-xs font-bold font-mono border border-black rounded-none px-2 py-1 bg-white text-black">
                    <TrendingUp className="w-3 h-3" />
                    <span>MARKET: BULLISH</span>
                 </div>
                 <button className="text-sm font-bold bg-black text-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black px-6 py-2 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-wide">
                    LOGIN
                 </button>
            </div>
          </div>
        </nav>
    </header>
  );
}
