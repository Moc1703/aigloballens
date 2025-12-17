'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      // Force GMT+7 (WIB - Waktu Indonesia Barat)
      const now = new Date();
      const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
      
      const hours = wibTime.getHours().toString().padStart(2, '0');
      const minutes = wibTime.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const day = wibTime.getDate().toString().padStart(2, '0');
      const month = months[wibTime.getMonth()];
      const year = wibTime.getFullYear();
      setCurrentDate(`${day} ${month} ${year}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <nav className="w-full border-b-2 border-black bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="container mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between max-w-[1400px]">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 bg-black rounded-none flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black">
              <span className="text-white font-serif font-bold italic text-lg">A1</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight leading-none text-black">
                GlobalLens
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-500 font-bold font-sans">Financial Intelligence</span>
            </div>
          </Link>

          {/* Right: Time Display */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-black">
            <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
            <span className="hidden md:inline">{currentDate} - </span>
            <span>{currentTime} WIB</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
