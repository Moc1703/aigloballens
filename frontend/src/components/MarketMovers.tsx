'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

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

export function MarketMovers() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await fetch('/api/market-data', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
        setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-black p-4 border-b-2 border-black">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Market Movers
          </h3>
        </div>
        <div className="p-8 text-center">
          <p className="text-neutral-500 font-mono text-sm">Loading live data...</p>
        </div>
      </div>
    );
  }

  const allAssets = [
    ...(marketData?.crypto || []).map(c => ({ ...c, type: 'crypto', change: c.change_24h })),
    ...(marketData?.stocks || []).map(s => ({ ...s, type: 'stock', change: s.change_pct })),
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="bg-black p-4 border-b-2 border-black flex justify-between items-center">
        <h3 className="text-lg font-bold uppercase tracking-widest text-white">Market Movers</h3>
        <span className="text-[10px] font-mono text-neutral-400">{lastUpdate}</span>
      </div>
      <ul className="divide-y divide-neutral-200">
        {allAssets.map((asset) => {
          const isPositive = asset.change >= 0;
          return (
            <li key={asset.symbol} className="flex justify-between items-center p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="font-bold text-black">{asset.symbol}</span>
                <span className="text-xs text-neutral-400 font-mono">{formatPrice(asset.price)}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-sm font-bold ${
                isPositive 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {formatChange(asset.change)}
              </span>
            </li>
          );
        })}
        {allAssets.length === 0 && (
          <li className="p-4 text-center text-neutral-500 font-mono text-sm">
            No data available. Run market_data.py
          </li>
        )}
      </ul>
    </div>
  );
}
