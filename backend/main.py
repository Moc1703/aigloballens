import json
import os
import sys
from scraper import NewsScraper
from ai_processor import AIProcessor
import logging
import time
from datetime import datetime, timedelta

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Ensure data directory exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
DATA_FILE = os.path.join(DATA_DIR, "news.json")

# Data retention period (30 days)
RETENTION_DAYS = 30

def load_existing_articles():
    """Load existing articles from disk."""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return []
    return []

def cleanup_old_articles(articles, days=RETENTION_DAYS):
    """Remove articles older than `days` days."""
    cutoff = datetime.now() - timedelta(days=days)
    
    cleaned = []
    removed_count = 0
    
    for article in articles:
        try:
            # Parse published_at or use article id timestamp
            pub_date = None
            if article.get("published_at"):
                # Try common date formats
                for fmt in ["%a, %d %b %Y %H:%M:%S %z", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d"]:
                    try:
                        pub_date = datetime.strptime(article["published_at"][:25], fmt.replace(" %z", "").replace("T", " ").replace("Z", ""))
                        break
                    except:
                        continue
            
            # Fallback: use article ID (which is timestamp-based)
            if not pub_date:
                try:
                    timestamp = int(article["id"].split("-")[0])
                    pub_date = datetime.fromtimestamp(timestamp)
                except:
                    pass
            
            if pub_date and pub_date < cutoff:
                removed_count += 1
                continue
            
            cleaned.append(article)
        except Exception as e:
            cleaned.append(article)  # Keep if we can't parse date
    
    if removed_count > 0:
        print(f"🗑️  Cleaned up {removed_count} articles older than {days} days")
    
    return cleaned

def main():
    scraper = NewsScraper()
    ai = AIProcessor(model="llama3.1") # User can change model here

    print("="*60)
    print("  📈 GlobalLens A1 - Market Intelligence Generator")
    print("="*60)

    # Load existing articles and cleanup old ones
    existing = load_existing_articles()
    existing = cleanup_old_articles(existing)
    existing_urls = {a.get("original_url") for a in existing}

    print(f"\n--- 1. Scraping Financial Sources (Finance, Crypto, Geopolitics) ---")
    raw_articles = scraper.get_latest_articles(limit_per_feed=2)
    print(f"--- Scraped {len(raw_articles)} articles ---")

    # Filter out already processed articles
    new_articles = [a for a in raw_articles if a["original_url"] not in existing_urls]
    print(f"--- {len(new_articles)} new articles to process ---")

    if not new_articles:
        print("✅ No new articles. Database is up to date.")
        # Still save cleaned data
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)
        return

    processed_news = []

    print(f"\n--- 2. AI Market Analysis (Ollama) ---")
    for idx, article in enumerate(new_articles):
        print(f"📊 Analyzing ({idx+1}/{len(new_articles)}): {article['original_title'][:60]}...")
        
        rewritten = ai.rewrite_article(
            article['original_title'], 
            article['content'], 
            article['original_source']
        )
        
        if rewritten:
            # Merge AI result with metadata
            final_article = {
                "id": str(int(time.time())) + f"-{idx}",
                "title": rewritten.get("title", article['original_title']),
                "summary": rewritten.get("summary", ""),
                "content": rewritten.get("content", article['content']),
                "original_url": article['original_url'],
                "image_url": article['image_url'],
                "source": article['original_source'],
                "published_at": article['published_at'],
                "category": rewritten.get("category", "MACRO")  # New: AI-assigned category
            }
            processed_news.append(final_article)
        else:
            print("⚠️  Skipping article due to AI failure.")

    # Merge new with existing (new first for recency)
    all_articles = processed_news + existing
    
    print(f"\n--- 3. Saving {len(all_articles)} total articles to database ---")
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, indent=2, ensure_ascii=False)

    print(f"✅ Done! {len(processed_news)} new articles added. Total: {len(all_articles)}")

if __name__ == "__main__":
    main()
