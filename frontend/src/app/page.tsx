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
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-10">
        
        {/* Header Section - LUXURY BLACK */}
        <section className="text-center py-10 rounded-2xl bg-black text-white mb-10 shadow-2xl">
             <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-4 text-white uppercase drop-shadow-md">Market Intelligence</h1>
             <p className="text-xl font-bold font-mono text-neutral-300 tracking-widest uppercase">Real-time Analysis & Financial Wire</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT: MAIN FEED (8 Cols) */}
            <section className="lg:col-span-8 space-y-10">
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

            {/* RIGHT: MARKET SIDEBAR (4 Cols) */}
            <aside className="hidden lg:block lg:col-span-4 space-y-12">
                {/* LIVE Market Movers - Dynamic Component */}
                <MarketMovers />

                {/* Quick Analysis */}
                <div className="bg-white rounded-xl border-2 border-black p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity className="w-24 h-24 text-black" />
                     </div>
                     <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-2">Analyst Note</h3>
                     <p className="text-lg leading-relaxed font-serif font-bold text-black">
                        "Markets are reacting to the latest Fed signals. Expect high volatility in Tech and Crypto sectors."
                     </p>
                     <div className="mt-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">AI</div>
                        <div className="text-xs font-mono uppercase font-bold text-neutral-600">Senior Analyst, GlobalLens</div>
                     </div>
                </div>

                {/* Trending Topics */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-4 border-b-2 border-black pb-2">Trending Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {['#Inflation', '#Crypto', '#AI', '#Oil', '#China', '#Fed'].map(tag => (
                            <span key={tag} className="bg-white border-2 border-black px-3 py-1 font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer text-sm rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </aside>
        </div>

      </main>

      <footer className="mt-20 border-t border-blue-200 bg-white py-12">
        <div className="container mx-auto px-4 max-w-[1400px] grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="col-span-1 md:col-span-2">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-blue-900">
                   Global<span className="text-blue-600">Lens</span>
                </Link>
                <p className="mt-4 text-blue-800 max-w-sm text-sm leading-relaxed">
                   Redefining journalism with Artificial Intelligence. We curate, verify, and rewrite global stories to bring you the unbiased truth with professional clarity.
                </p>
             </div>
             <div>
                <h4 className="font-bold mb-4 text-blue-900">Sections</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                    <li><a href="#" className="hover:text-blue-500">World</a></li>
                    <li><a href="#" className="hover:text-blue-500">Technology</a></li>
                    <li><a href="#" className="hover:text-blue-500">Business</a></li>
                    <li><a href="#" className="hover:text-blue-500">Science</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold mb-4 text-blue-900">Company</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                    <li><a href="#" className="hover:text-blue-500">About Us</a></li>
                    <li><a href="#" className="hover:text-blue-500">AI Ethics</a></li>
                    <li><a href="#" className="hover:text-blue-500">Careers</a></li>
                    <li><a href="#" className="hover:text-blue-500">Contact</a></li>
                </ul>
             </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-blue-100 flex flex-col md:flex-row justify-between items-center text-xs text-blue-400">
            <p>&copy; 2025 GlobalLens AI Media. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
