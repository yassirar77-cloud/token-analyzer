# Back Street Dogs - Decentralized Music Platform

A full-stack Web3 music platform where underground musicians can sell their music as both streaming access and limited edition NFTs. Built with Solidity smart contracts, Node.js backend, and Next.js frontend.

## 🎵 Features

### For Musicians (Artists)
- **Upload Tracks**: Upload music files to IPFS with metadata
- **Dual Revenue Streams**:
  - Sell unlimited streaming access
  - Sell limited edition NFTs (e.g., 100 editions per track)
- **Automatic Royalties**: Earn 10% on all NFT resales (ERC-2981)
- **Revenue Split**: 70% to artist, 20% to platform, 10% to reflections
- **Analytics Dashboard**: Track streams, sales, and earnings
- **Artist Verification**: Verified badge system

### For Fans
- **Stream Music**: Purchase permanent streaming access with BSD tokens
- **Collect NFTs**: Own limited edition music NFTs
- **Resell NFTs**: Trade NFTs on the built-in marketplace
- **Music Discovery**: Browse and search tracks by genre, artist, price
- **Wallet Integration**: Connect with MetaMask for seamless transactions

### Platform Features
- **BSD Token**: ERC-20 token with 10% reflection mechanism
- **IPFS Storage**: Decentralized music file storage
- **Web3 Authentication**: Sign-in with wallet signatures
- **PostgreSQL Database**: Track metadata and analytics
- **Responsive Design**: Mobile-friendly interface
- **Waveform Player**: Visual audio player with WaveSurfer.js

## 🏗️ Architecture

### Smart Contracts (Solidity)
- **BSDToken.sol**: ERC-20 token with reflection mechanism
- **MusicNFT.sol**: ERC-721 NFTs with royalties (ERC-2981)
- **StreamingAccess.sol**: Manages permanent streaming rights
- **MusicMarketplace.sol**: Primary and secondary NFT sales

### Backend (Node.js/Express)
- RESTful API with PostgreSQL database
- IPFS integration for file storage
- Web3 wallet authentication (JWT)
- Audio streaming endpoints
- Purchase history and analytics

### Frontend (Next.js/React)
- Landing page with featured tracks
- Explore/browse page with search and filters
- Artist dashboard with upload and analytics
- Music player with waveform visualization
- MetaMask wallet integration (RainbowKit + Wagmi)
- Tailwind CSS styling

## 📦 Installation

### Prerequisites
- Node.js v18+ and npm
- PostgreSQL database
- IPFS node (or use a gateway)
- MetaMask wallet

### 1. Clone the Repository
```bash
git clone <repository-url>
cd token-analyzer
```

### 2. Install Dependencies

#### Smart Contracts
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Setup Database
```bash
# Create PostgreSQL database
createdb backstreet_dogs

# Update backend/.env with your database credentials
```

### 4. Deploy Smart Contracts
```bash
# Start local blockchain (Hardhat)
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Copy contract addresses to backend/.env and frontend/.env.local
```

### 5. Run the Application

#### Backend API
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## 🧪 Testing

### Smart Contract Tests
```bash
npx hardhat test
```

Expected output: All tests should pass with detailed gas reports

## 📝 Smart Contract Details

### BSDToken (Back Street Dogs Token)
- **Type**: ERC-20 with reflection mechanism
- **Supply**: Configurable (1M default)
- **Reflection Fee**: 10% (distributed to all holders)
- **Features**: Fee exclusion list, adjustable fees

### MusicNFT
- **Type**: ERC-721 with ERC-2981 royalties
- **Features**:
  - Limited editions per track
  - Artist verification system
  - Automatic 10% royalty on resales
  - IPFS metadata storage

### StreamingAccess
- **Purpose**: Track permanent streaming rights
- **Features**:
  - Grant/revoke access
  - Purchase history
  - Analytics (purchases, revenue)
  - Batch operations

### MusicMarketplace
- **Features**:
  - Buy streaming access with BSD tokens
  - Buy NFT editions with BSD tokens
  - List NFTs for resale
  - Automatic revenue distribution (70/20/10 split)
  - Royalty enforcement on resales

## 🔐 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Role-based permissions
- **Rate Limiting**: API request throttling
- **Helmet.js**: HTTP security headers
- **Input Validation**: Joi schemas
- **JWT Authentication**: Secure API access
- **Signature Verification**: Web3 wallet authentication

## 📊 Revenue Model

### Streaming Purchase
- **Total**: 100%
- **Artist**: 70%
- **Platform**: 20%
- **Reflections**: 10% (distributed to all BSD token holders)

### NFT Purchase (Primary Sale)
- Same split as streaming

### NFT Resale
- **Seller**: 90%
- **Artist Royalty**: 10%

## 🚀 Deployment

### Testnet Deployment (Sepolia)
```bash
# Configure hardhat.config.js with Sepolia network
# Get testnet ETH from faucet
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet Deployment
```bash
# ⚠️ Audit contracts before mainnet deployment
# Configure hardhat.config.js with mainnet settings
npx hardhat run scripts/deploy.js --network mainnet
```

## 📚 API Documentation

### Authentication
- `GET /api/auth/nonce/:walletAddress` - Get nonce for signing
- `POST /api/auth/verify` - Verify signature and get JWT

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/library` - Get purchased tracks

### Tracks
- `POST /api/tracks/upload` - Upload track to IPFS
- `POST /api/tracks` - Create track record
- `GET /api/tracks` - Get all tracks (with filters)
- `GET /api/tracks/:id` - Get track by ID
- `GET /api/tracks/:id/stream` - Stream audio
- `GET /api/tracks/:id/analytics` - Get track analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for Ethereum development environment
- Next.js for the React framework
- WaveSurfer.js for audio visualization
- RainbowKit for wallet connection UI

---

Built with ❤️ for underground musicians worldwide 🎵
