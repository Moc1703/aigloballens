'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface AssetData {
  symbol: string;
  price: number;
  change: number;
}

// CoinGecko API (free, no key required)
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';
const CRYPTO_IDS = 'bitcoin,ethereum,solana';

export function MarketMovers() {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // Fetch crypto prices from CoinGecko (free, CORS-enabled)
      const url = `${COINGECKO_API}?ids=${CRYPTO_IDS}&vs_currencies=usd&include_24hr_change=true`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      
      const data = await response.json();
      
      const cryptoData: AssetData[] = [
        { 
          symbol: 'BTC', 
          price: data.bitcoin?.usd || 0, 
          change: data.bitcoin?.usd_24h_change || 0 
        },
        { 
          symbol: 'ETH', 
          price: data.ethereum?.usd || 0, 
          change: data.ethereum?.usd_24h_change || 0 
        },
        { 
          symbol: 'SOL', 
          price: data.solana?.usd || 0, 
          change: data.solana?.usd_24h_change || 0 
        },
      ];
      
      setAssets(cryptoData);
      setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
      setError('Unable to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Poll every 60 seconds (CoinGecko rate limit friendly)
    const interval = setInterval(fetchData, 60000);
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

  return (
    <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="bg-black p-4 border-b-2 border-black flex justify-between items-center">
        <h3 className="text-lg font-bold uppercase tracking-widest text-white">Market Movers</h3>
        <span className="text-[10px] font-mono text-neutral-400">{lastUpdate}</span>
      </div>
      <ul className="divide-y divide-neutral-200">
        {assets.map((asset) => {
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
        {error && (
          <li className="p-4 text-center text-neutral-500 font-mono text-sm">
            {error}
          </li>
        )}
      </ul>
    </div>
  );
}
