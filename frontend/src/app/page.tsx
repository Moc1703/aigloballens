import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; 
import Navbar from "@/components/Navbar";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

import { getAllArticles, Article } from '@/lib/db';
import { NewsCard } from '@/components/NewsCard';
import { MarketMovers } from '@/components/MarketMovers';
import { ArrowRight, Activity } from 'lucide-react';

async function getNews(): Promise<Article[]> {
  // In production (Vercel), this will fetch from Postgres
  // In development, you can add a fallback to local JSON if needed
  if (process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL) {
    // Fallback to local JSON in dev if Postgres not configured
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), '../backend/data/news.json');
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error("Error reading local news data:", error);
      return [];
    }
  }
  
  // Production: fetch from database
  return await getAllArticles();
}

export default async function Home() {
  const news = await getNews();

  // Distribute articles into different layout slots
  const heroArticle = news[0];
  const featured = news.slice(1, 4); // 3 articles for side/bottom
  const quickReads = news.slice(4, 8); // 4 articles for compact list
  const editorial = news.slice(8, 10); // 2 articles for bottom features
  const remaining = news.slice(10);

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground selection:bg-blue-100">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-3 md:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Header Section - LUXURY BLACK */}
        <section className="text-center py-6 md:py-10 rounded-xl md:rounded-2xl bg-black text-white mb-6 md:mb-10 shadow-2xl">
             <h1 className="text-2xl md:text-5xl lg:text-7xl font-serif font-bold tracking-tighter mb-2 md:mb-4 text-white uppercase drop-shadow-md">Market Intelligence</h1>
             <p className="text-xs md:text-xl font-bold font-mono text-neutral-300 tracking-wider md:tracking-widest uppercase">Real-time Analysis & Financial Wire</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            {/* LEFT: MAIN FEED (8 Cols) */}
            <section className="lg:col-span-8 space-y-6 lg:space-y-10">
                <div className="flex items-center justify-between border-b-4 border-black pb-2 mb-6">
                    <h2 className="text-2xl font-bold uppercase tracking-widest bg-black text-white px-4 py-1 rounded-t-sm">Latest Wire</h2>
                    <span className="font-mono text-xs font-bold text-black animate-pulse flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        LIVE UPDATES
                    </span>
                </div>

                {news.map((article, index) => (
                    <div key={article.id}>
                        <NewsCard 
                            article={article} 
                            variant="accessible" 
                        />
                        {/* Elegant divider - LUXURY BLACK */}
                        {index < news.length - 1 && (
                            <Separator className="mt-10 bg-black h-[1px]" />
                        )}
                    </div>
                ))}

                {news.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-neutral-300 rounded-xl bg-white">
                         <p className="text-xl font-bold font-mono text-black">WAITING FOR MARKET DATA...</p>
                    </div>
                )}
            </section>

            {/* MARKET SIDEBAR (4 Cols on desktop, full width on mobile at top) */}
            <aside className="lg:col-span-4 space-y-6 lg:space-y-12 order-first lg:order-last">
                {/* LIVE Market Movers - Dynamic Component */}
                <MarketMovers />

            </aside>
        </div>

      </main>

      <footer className="mt-12 border-t-2 border-black bg-black py-6">
        <div className="container mx-auto px-4 max-w-[1400px] flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400">
            <p>&copy; 2025 GlobalLens A1 - Financial Intelligence Terminal</p>
            <p className="mt-2 md:mt-0">Powered by AI • Real-time Market Data</p>
        </div>
      </footer>
    </div>
  );
}
