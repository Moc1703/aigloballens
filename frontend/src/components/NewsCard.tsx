import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    image_url: string;
    source: string;
    published_at: string;
    category?: string;
  };
  variant?: "hero" | "standard" | "compact" | "minimal" | "accessible";
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    "STOCKS": "bg-green-600 hover:bg-green-700 text-white",
    "CRYPTO": "bg-orange-600 hover:bg-orange-700 text-white",
    "FOREX": "bg-blue-600 hover:bg-blue-700 text-white",
    "COMMODITIES": "bg-yellow-600 hover:bg-yellow-700 text-white",
    "GEOPOLITICS": "bg-red-700 hover:bg-red-800 text-white",
    "MACRO": "bg-purple-600 hover:bg-purple-700 text-white",
    "DEFAULT": "bg-primary hover:bg-primary/90 text-primary-foreground",
};

export function NewsCard({ article, variant = "standard", className }: NewsCardProps) {
  const timeAgo = article.published_at 
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) 
    : "Just now";
    
  const category = article.category?.toUpperCase() || "GLOBAL NEWS";
  const badgeColor = CATEGORY_COLORS[category] || CATEGORY_COLORS["DEFAULT"];

  // --- Hero Variant (Big Visual) ---
  if (variant === "hero") {
    return (
      <Link 
        href={`/article/${article.id}`} 
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-card border border-border/20 shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl", 
          className
        )}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={cn("border-none uppercase tracking-widest text-[10px] md:text-xs w-fit", badgeColor)}>
                {category}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/80 uppercase tracking-widest text-[10px] md:text-xs w-fit backdrop-blur-sm">
                {article.source}
              </Badge>
          </div>
          
          <h2 className="mb-4 font-serif text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white drop-shadow-sm line-clamp-3">
            {article.title}
          </h2>
          <p className="mb-6 max-w-2xl text-base md:text-lg text-neutral-200 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
          <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-400 font-medium">
            <span className="text-white/80">Market Impact Analysis</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </Link>
    );
  }

  // --- Compact Variant (Horizontal) ---
  if (variant === "compact") {
    return (
      <Link 
        href={`/article/${article.id}`} 
        className={cn(
          "group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-muted/30 border border-transparent hover:border-border/30", 
          className
        )}
      >
        <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
           <div className="absolute top-1 left-1">
                <div className={cn("w-2 h-2 rounded-full", badgeColor.split(" ")[0])} />
           </div>
        </div>
        <div className="flex flex-col justify-center py-1">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{article.source}</span>
             <span className="text-[10px] text-muted-foreground">•</span>
             <span className={cn("text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm text-white/90", badgeColor.split(" ")[0])}>{category}</span>
          </div>
          <h3 className="font-serif text-base md:text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <span className="mt-2 text-[10px] text-muted-foreground font-medium">{timeAgo}</span>
        </div>
      </Link>
    );
  }
  
  // --- Minimal Variant (Text Only) ---
  if (variant === "minimal") {
      return (
        <Link 
          href={`/article/${article.id}`} 
          className={cn(
            "group flex flex-col justify-between rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md h-full", 
            className
          )}
        >
          <div>
            <div className="flex justify-between items-start mb-3">
                 <Badge variant="outline" className={cn("text-[9px] uppercase border-none text-white", badgeColor.split(" ")[0])}>{article.source}</Badge>
                 <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 translate-x-1" />
            </div>
            <h3 className="font-serif text-lg md:text-xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-3">
                {article.title}
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-medium">
             <span>{timeAgo}</span>
             <span className="font-bold text-[10px] text-foreground/50">{category}</span>
          </div>
        </Link>
      )
  }

  // --- Accessible Variant (High Readability) ---
  if (variant === "accessible") {
    return (
      <Link 
        href={`/article/${article.id}`} 
        className={cn(
          "group flex flex-col md:flex-row gap-6 p-6 rounded-none bg-white border-b-2 border-transparent hover:border-black transition-all duration-300", 
          className
        )}
      >
        {/* Large Thumbnail */}
        <div className="relative h-48 w-full md:w-64 md:h-48 flex-shrink-0 overflow-hidden border-2 border-black bg-neutral-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="h-full w-full object-cover functional-grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        
        {/* Content - No Overlays, Pure Text */}
        <div className="flex flex-col flex-1 justify-center">
          <div className="flex items-center gap-3 mb-3">
             <Badge className={cn("text-xs font-bold uppercase tracking-widest px-2 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white rounded-none", badgeColor)}>
                {category}
             </Badge>
             <span className="text-sm text-black font-bold uppercase tracking-wider">{article.source}</span>
             <span className="text-sm text-neutral-400">•</span>
             <span className="text-sm text-neutral-500 font-bold">{timeAgo}</span>
          </div>
          
          <h3 className="mb-3 font-serif text-2xl md:text-3xl font-bold leading-snug group-hover:underline decoration-2 decoration-black underline-offset-4 transition-all text-black">
            {article.title}
          </h3>
          
          <p className="text-lg text-neutral-600 leading-relaxed line-clamp-3 md:line-clamp-2 font-medium">
            {article.summary}
          </p>
        </div>
      </Link>
    );
  }

  // --- Standard Variant (Vertical Card) ---
  return (
    <Link 
      href={`/article/${article.id}`} 
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-card border border-border/40 shadow-sm transition-all hover:shadow-lg hover:border-primary/30 h-full", 
        className
      )}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img 
          src={article.image_url} 
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className={cn("absolute top-3 left-3 border-none", badgeColor)}>
            {category}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="secondary" className="text-[10px] font-bold tracking-wider">{article.source}</Badge>
          <span className="text-[10px] text-muted-foreground font-medium">{timeAgo}</span>
        </div>
        <h3 className="mb-2 font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="flex-1 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {article.summary}
        </p>
      </div>
    </Link>
  );
}
