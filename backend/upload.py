import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "news.json")
VERCEL_URL = os.getenv("VERCEL_URL", "http://localhost:3000")  # Default to localhost for testing
API_KEY = os.getenv("SYNC_API_KEY", "")

def upload_to_vercel():
    """Upload articles from local JSON to Vercel database."""
    
    if not API_KEY:
        print("❌ Error: SYNC_API_KEY not found in environment variables")
        print("   Create a .env file in the backend directory with:")
        print("   SYNC_API_KEY=your-secret-key")
        print("   VERCEL_URL=https://your-app.vercel.app")
        return False
    
    if not os.path.exists(DATA_FILE):
        print(f"❌ Error: News data file not found at {DATA_FILE}")
        print("   Run 'python main.py' first to generate news articles.")
        return False
    
    # Read articles
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        articles = json.load(f)
    
    if not articles:
        print("⚠️  No articles found in news.json")
        return False
    
    print(f"📤 Uploading {len(articles)} articles to {VERCEL_URL}...")
    
    # Send to Vercel
    try:
        response = requests.post(
            f"{VERCEL_URL}/api/sync",
            json={"articles": articles},
            headers={
                "Content-Type": "application/json",
                "X-API-Key": API_KEY
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"   - Inserted: {data.get('inserted', 0)} new articles")
            print(f"   - Updated: {data.get('updated', 0)} existing articles")
            print(f"   - Total: {data.get('total', 0)} articles processed")
            return True
        else:
            print(f"❌ Upload failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False

if __name__ == "__main__":
    print("="*60)
    print("  GlobalLens AI - Upload to Vercel")
    print("="*60)
    upload_to_vercel()
