"""
GlobalLens A1 - Real-Time Market Data Fetcher
Fetches live prices from CoinGecko (crypto) and Yahoo Finance (stocks).
"""
import json
import os
import sys
from datetime import datetime
import requests

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Optional: yfinance for stocks (install if not present)
try:
    import yfinance as yf
    HAS_YFINANCE = True
except ImportError:
    HAS_YFINANCE = False
    print("⚠️  yfinance not installed. Stock data will be unavailable. Run: pip install yfinance")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "market_movers.json")

# ===== CONFIGURATION =====
CRYPTO_IDS = ["bitcoin", "ethereum", "solana"]  # CoinGecko IDs
STOCK_SYMBOLS = ["NVDA", "TSLA", "AAPL", "MSFT"]  # Yahoo Finance symbols

def fetch_crypto_data():
    """Fetch crypto prices from CoinGecko (FREE, no API key)."""
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": ",".join(CRYPTO_IDS),
        "vs_currencies": "usd",
        "include_24hr_change": "true"
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        result = []
        symbol_map = {"bitcoin": "BTC", "ethereum": "ETH", "solana": "SOL"}
        
        for coin_id in CRYPTO_IDS:
            if coin_id in data:
                coin_data = data[coin_id]
                result.append({
                    "symbol": symbol_map.get(coin_id, coin_id.upper()),
                    "price": coin_data.get("usd", 0),
                    "change_24h": round(coin_data.get("usd_24h_change", 0), 2)
                })
        
        return result
    except Exception as e:
        print(f"❌ Crypto fetch error: {e}")
        return []

def fetch_stock_data():
    """Fetch stock prices from Yahoo Finance."""
    if not HAS_YFINANCE:
        return []
    
    try:
        result = []
        for symbol in STOCK_SYMBOLS:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="2d")
            
            if len(hist) >= 2:
                current = hist['Close'].iloc[-1]
                previous = hist['Close'].iloc[-2]
                change_pct = ((current - previous) / previous) * 100
                
                result.append({
                    "symbol": symbol,
                    "price": round(current, 2),
                    "change_pct": round(change_pct, 2)
                })
            elif len(hist) == 1:
                result.append({
                    "symbol": symbol,
                    "price": round(hist['Close'].iloc[-1], 2),
                    "change_pct": 0
                })
        
        return result
    except Exception as e:
        print(f"❌ Stock fetch error: {e}")
        return []

def main():
    print("📊 Fetching real-time market data...")
    
    crypto_data = fetch_crypto_data()
    print(f"   ✅ Crypto: {len(crypto_data)} assets")
    
    stock_data = fetch_stock_data()
    print(f"   ✅ Stocks: {len(stock_data)} assets")
    
    market_data = {
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "crypto": crypto_data,
        "stocks": stock_data
    }
    
    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Save to JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(market_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved to {OUTPUT_FILE}")
    return market_data

if __name__ == "__main__":
    data = main()
    print(json.dumps(data, indent=2))
