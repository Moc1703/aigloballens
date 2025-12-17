"""
GlobalLens A1 - Automated Market Intelligence Scheduler
Runs the scraper + AI processor every minute, then uploads to Vercel.
"""
import subprocess
import sys
import time
import os
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INTERVAL_SECONDS = 30  # 30 seconds for A1-class speed

def log(message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def run_script(script_name):
    """Run a Python script and return success status."""
    try:
        result = subprocess.run(
            [sys.executable, script_name],
            cwd=SCRIPT_DIR,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        if result.returncode == 0:
            return True, result.stdout
        else:
            return False, result.stderr
    except subprocess.TimeoutExpired:
        return False, "Timeout expired"
    except Exception as e:
        return False, str(e)

def main():
    print("="*60)
    print("  🚀 GlobalLens A1 - Automated Scheduler")
    print("  Interval: Every 60 seconds")
    print("  Press Ctrl+C to stop")
    print("="*60)
    
    cycle = 0
    
    while True:
        cycle += 1
        log(f"--- Cycle {cycle} Started ---")
        
        # Step 1: Generate news (scrape + AI)
        log("📥 Running main.py (Scrape + AI)...")
        success, output = run_script("main.py")
        
        if success:
            # Count new articles from output
            if "new articles added" in output:
                log("✅ " + output.split("✅")[-1].strip())
            elif "No new articles" in output:
                log("📊 No new articles this cycle.")
            else:
                log("✅ Generation complete.")
        else:
            log(f"⚠️  Generation error: {output[:100]}...")
        
        # Step 2: Upload to Vercel (if configured)
        log("☁️  Running upload.py (Sync to Vercel)...")
        success, output = run_script("upload.py")
        
        if success:
            if "Success" in output:
                log("✅ " + output.split("✅")[-1].strip().split("\n")[0])
            else:
                log("✅ Upload complete.")
        else:
            if "SYNC_API_KEY" in output:
                log("⏭️  Skipping upload (API key not configured).")
            else:
                log(f"⚠️  Upload error: {output[:100]}...")
        
        # Step 3: Fetch live market data (crypto + stocks)
        log("📊 Running market_data.py (Live Prices)...")
        success, output = run_script("market_data.py")
        
        if success:
            log("✅ Market data updated.")
        else:
            log(f"⚠️  Market data error: {output[:100]}...")
        
        log(f"--- Cycle {cycle} Complete. Next in {INTERVAL_SECONDS}s ---\n")
        
        # Wait for next cycle
        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Scheduler stopped by user.")
