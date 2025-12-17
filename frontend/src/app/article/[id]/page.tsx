import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from '@/components/Navbar';
import { NewsCard } from '@/components/NewsCard';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, Clock, User, Share2, Bookmark } from 'lucide-react';

import { getArticleById, getAllArticles, Article } from '@/lib/db';

async function getArticle(id: string): Promise<Article | null> {
  // In production (Vercel), this will fetch from Postgres
  // In development, fallback to local JSON if Postgres not configured
  if (process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL) {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), '../backend/data/news.json');
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data: Article[] = JSON.parse(fileContents);
      return data.find((item) => item.id === id) || null;
    } catch (error) {
      console.error("Error reading local news data:", error);
      return null;
    }
  }

  // Production: fetch from database
  return await getArticleById(id);
}

async function getRelatedArticles(currentId: string): Promise<Article[]> {
     // For now, just fetch all and exclude current. Real implementation would be smarter.
     let all: Article[] = [];
     if (process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL) {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), '../backend/data/news.json');
        try {
            all = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch(e) { /* ignore */ }
     } else {
        all = await getAllArticles();
     }
     
     return all.filter(a => a.id !== currentId).slice(0, 4);
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  const relatedArticles = await getRelatedArticles(id);

  if (!article) {
    return (
        <div className="flex items-center justify-center h-screen text-muted-foreground flex-col">
          <h2 className="text-2xl font-bold mb-4">404</h2>
          <p>Artikel tidak ditemukan.</p>
          <Link href="/" className="mt-4 text-primary underline">Kembali ke Beranda</Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 md:px-8 py-10 md:py-16">
        
        {/* ACCESSIBLE HEADER: High Contrast */}
        <header className="mb-10 text-center md:text-left border-b-4 border-black pb-8">
            <div className="flex flex-wrap items-center gap-3 mb-6 justify-center md:justify-start">
                 <Badge className="bg-black text-white hover:bg-black text-sm px-3 py-1 uppercase tracking-widest border-none rounded-none">
                    {article.category || 'News'}
                 </Badge>
                 <span className="font-bold text-black uppercase tracking-widest text-sm">{article.source}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-black mb-6">
                {article.title}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-4 text-black text-lg font-bold">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{article.published_at ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) : 'Just now'}</span>
                </div>
            </div>
        </header>

        {/* MAIN IMAGE: Clear Border */}
        <div className="mb-12 border-2 border-black shadow-none">
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-auto max-h-[600px] object-cover"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* ARTICLE CONTENT (8 cols) */}
            <article className="lg:col-span-8">
                
                {/* Large Summary Lead */}
                <div className="text-2xl md:text-3xl font-serif leading-relaxed text-black font-bold mb-10 border-l-[6px] border-black pl-6 py-2">
                    {article.summary}
                </div>

                {/* Main Body - Prose XL High Contrast */}
                <div className="prose prose-xl md:prose-2xl max-w-none 
                    text-black
                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-black
                    prose-p:leading-loose prose-p:mb-8 text-lg md:text-xl font-medium
                    prose-a:text-blue-800 prose-a:underline hover:prose-a:bg-blue-100
                    prose-strong:text-black">
                    <ReactMarkdown components={{
                        h1: ({node, ...props}) => <h2 className="text-4xl font-bold mt-16 mb-8 text-black" {...props} />,
                        h2: ({node, ...props}) => <h3 className="text-3xl font-bold mt-12 mb-6 text-black border-b-2 border-black pb-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-8 leading-loose text-[22px] text-black" {...props} />,
                    }}>
                        {article.content}
                    </ReactMarkdown>
                </div>

                <div className="mt-16 p-6 bg-white border-2 border-black rounded-none">
                    <p className="font-bold uppercase tracking-wide mb-2 text-sm text-black">Source</p>
                    <a href={article.original_url} target="_blank" rel="noopener noreferrer" className="text-blue-800 font-bold text-lg hover:underline break-all">
                        {article.original_url}
                    </a>
                </div>
            </article>

            {/* SIDEBAR (4 cols) */}
            <aside className="lg:col-span-4 space-y-10">
                <div className="sticky top-24">
                    <div className="border-t-4 border-black pt-6">
                        <h3 className="font-serif text-2xl font-bold mb-6 text-black">Read Next</h3>
                        
                        <div className="flex flex-col gap-8">
                            {relatedArticles.map((item) => (
                               <Link key={item.id} href={`/article/${item.id}`} className="group block">
                                  <div className="aspect-video bg-white border-2 border-black mb-3">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  </div>
                                  <h4 className="font-serif text-xl font-bold leading-tight group-hover:underline decoration-2 underline-offset-4 text-black">
                                    {item.title}
                                  </h4>
                               </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

        </div>
      </main>
      
       <footer className="mt-20 py-12 border-t-4 border-black bg-white text-center">
            <Link href="/" className="font-serif font-bold text-black text-3xl">GlobalLens A1</Link>
            <p className="text-sm font-bold text-black mt-4 uppercase tracking-widest">&copy; 2025 Financial Intelligence Terminal.</p>
       </footer>
    </div>
  );
}
