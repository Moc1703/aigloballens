import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // No caching - always fresh data
export const revalidate = 0;

interface CryptoData {
  symbol: string;
  price: number;
  change_24h: number;
}

interface StockData {
  symbol: string;
  price: number;
  change_pct: number;
}

interface MarketData {
  updated_at: string;
  crypto: CryptoData[];
  stocks: StockData[];
}

export async function GET() {
  try {
    // In development, read from local file
    const marketDataPath = path.join(process.cwd(), '../backend/data/market_movers.json');
    
    if (fs.existsSync(marketDataPath)) {
      const fileContents = fs.readFileSync(marketDataPath, 'utf8');
      const marketData: MarketData = JSON.parse(fileContents);
      
      return NextResponse.json(marketData, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    // Return empty data if file doesn't exist
    return NextResponse.json({
      updated_at: new Date().toISOString(),
      crypto: [],
      stocks: []
    });
    
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
