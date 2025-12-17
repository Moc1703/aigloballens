# GlobalLens A1 - Financial Intelligence Terminal

![GlobalLens Banner](https://via.placeholder.com/1200x400/000000/FFFFFF?text=GlobalLens+A1+-+Financial+Intelligence)

A real-time financial news aggregator powered by **AI** and **live market data**.

## ✨ Features

- 🤖 **AI-Powered News** - Ollama (LLaMA 3.1) rewrites articles into Indonesian market analysis
- 📊 **Live Market Movers** - Real-time BTC, ETH, SOL, NVDA, TSLA, AAPL prices
- 🚀 **30-Second Updates** - News and market data refresh every 30 seconds
- 🏦 **Tier-1 Sources** - Bloomberg, Reuters, BBC, NYT, CoinDesk, CNBC
- 🎨 **Luxury Black Theme** - Premium high-contrast UI for professionals

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | Python (Ollama, feedparser, yfinance) |
| Database | Vercel Postgres |
| AI Model | LLaMA 3.1 via Ollama |
| Deployment | Vercel |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- [Ollama](https://ollama.ai) with `llama3.1` model

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend (Scheduler)
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python scheduler.py
```

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 👤 Author

Built with ❤️ by [Christian]
