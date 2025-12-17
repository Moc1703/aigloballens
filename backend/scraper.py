import feedparser
from newspaper import Article
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

RSS_FEEDS = [
    # === TIER 1: FINANCE & MARKETS (The Big Names) ===
    "https://feeds.bloomberg.com/markets/news.rss",               # Bloomberg Markets
    "https://feeds.content.dowjones.io/public/rss/mw_topstories", # MarketWatch (WSJ Family)
    "https://www.cnbc.com/id/100003114/device/rss/rss.html",      # CNBC World
    "https://feeds.finance.yahoo.com/rss/2.0/headline",          # Yahoo Finance
    
    # === TIER 1: CRYPTO (Most Trusted) ===
    "https://www.coindesk.com/arc/outboundfeeds/rss/",            # CoinDesk - #1 Crypto
    "https://cointelegraph.com/rss",                               # Cointelegraph
    
    # === TIER 1: WORLD NEWS (Most Credible) ===
    "https://feeds.bbci.co.uk/news/world/rss.xml",                # BBC World News
    "https://feeds.reuters.com/reuters/worldNews",                 # Reuters - Gold Standard
    "https://www.theguardian.com/world/rss",                       # The Guardian World
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",     # New York Times World
    
    # === TIER 1: BUSINESS & TECH ===
    "https://feeds.bloomberg.com/technology/news.rss",            # Bloomberg Tech
    "https://www.ft.com/?format=rss",                              # Financial Times (Limited)
]

class NewsScraper:
    def __init__(self):
        self.feeds = RSS_FEEDS

    def get_latest_articles(self, limit_per_feed=2):
        articles_data = []
        
        for feed_url in self.feeds:
            logging.info(f"Fetching feed: {feed_url}")
            feed = feedparser.parse(feed_url)
            
            count = 0
            for entry in feed.entries:
                if count >= limit_per_feed:
                    break
                
                try:
                    article = Article(entry.link)
                    article.download()
                    article.parse()
                    
                    # Basic validation
                    if not article.text or len(article.text) < 200:
                        continue

                    articles_data.append({
                        "original_title": article.title,
                        "original_url": article.url,
                        "original_source": feed.feed.get('title', 'Unknown Source'),
                        "published_at": entry.get('published', ''),
                        "image_url": article.top_image,
                        "content": article.text
                    })
                    count += 1
                    
                except Exception as e:
                    logging.error(f"Error extracting {entry.link}: {e}")
                    continue
                    
        return articles_data
