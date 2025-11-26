# 🔒 Token Security Analyzer

A Next.js web application that analyzes ERC-20 tokens for honeypots, scams, and security risks across multiple blockchains.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

- 🔍 **Token Analysis** - Paste any contract address to analyze
- ⛓️ **Multi-Chain Support** - Ethereum, BSC, Polygon, Arbitrum, Base, Optimism, Avalanche
- 🎯 **Risk Score** - 0-100 risk assessment with color-coded levels
- 🚩 **Security Flags** - Detect honeypots, mint functions, pause mechanisms, blacklists
- 💰 **Tax Analysis** - View buy/sell taxes
- 👥 **Top Holders** - See token distribution and locked liquidity
- 🌙 **Dark Theme** - Beautiful dark UI optimized for readability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🎯 How to Use

1. **Select a blockchain** from the chain selector buttons
2. **Enter a token contract address** (must start with 0x)
3. **Click Analyze** or press Enter
4. **Review the results**:
   - Risk score and level
   - Security flags (honeypot, mint, pause, etc.)
   - Buy/sell taxes
   - Token information
   - Top holders
   - DEX listings

### Example Tokens to Try

- **USDT on Ethereum**: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- **USDT on BSC**: `0x55d398326f99059fF775485246999027B3197955`

## 🔧 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: GoPlus Security API (free, no key required)

## 📁 Project Structure

```
token-analyzer/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with search
│   └── globals.css         # Global styles
├── components/
│   └── TokenAnalyzer.tsx   # Analysis results component
├── lib/
│   └── goplusApi.ts        # API integration
├── types/
│   └── token.ts            # TypeScript types
└── package.json
```

## 🔐 API Information

This application uses the [GoPlus Security API](https://gopluslabs.io/) which provides:
- No API key required
- Free to use
- Real-time token security data
- Support for 7+ blockchains

## ⚠️ Disclaimer

This tool provides security analysis based on smart contract code and on-chain data. Always DYOR (Do Your Own Research) before investing in any token. This is not financial advice.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details
