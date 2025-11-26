import { TokenSecurityData, TokenAnalysis } from '@/types/token';

const GOPLUS_API_BASE = 'https://api.gopluslabs.io/api/v1';

export async function analyzeToken(
  chainId: number,
  address: string
): Promise<TokenAnalysis> {
  const url = `${GOPLUS_API_BASE}/token_security/${chainId}?contract_addresses=${address}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 1) {
      throw new Error(data.message || 'API returned error');
    }

    const tokenData: TokenSecurityData = data.result[address.toLowerCase()];

    if (!tokenData) {
      throw new Error('Token not found or invalid address');
    }

    const riskScore = calculateRiskScore(tokenData);
    const riskLevel = getRiskLevel(riskScore);

    return {
      address,
      chainId,
      data: tokenData,
      riskScore,
      riskLevel,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to analyze token');
  }
}

function calculateRiskScore(data: TokenSecurityData): number {
  let score = 0;

  if (data.is_honeypot === '1') score += 50;
  if (data.is_mintable === '1') score += 15;
  if (data.transfer_pausable === '1') score += 15;
  if (data.is_blacklisted === '1') score += 20;
  if (data.cannot_sell_all === '1') score += 25;
  if (data.cannot_buy === '1') score += 25;
  if (data.is_proxy === '1') score += 10;
  if (data.can_take_back_ownership === '1') score += 15;
  if (data.hidden_owner === '1') score += 20;
  if (data.selfdestruct === '1') score += 30;
  if (data.is_airdrop_scam === '1') score += 40;

  const buyTax = parseFloat(data.buy_tax || '0');
  const sellTax = parseFloat(data.sell_tax || '0');

  if (buyTax > 0.1) score += 10;
  if (buyTax > 0.2) score += 10;
  if (sellTax > 0.1) score += 10;
  if (sellTax > 0.2) score += 10;
  if (sellTax > 0.5) score += 20;

  return Math.min(100, score);
}

function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

export const CHAINS = [
  { id: 1, name: 'Ethereum', shortName: 'ETH' },
  { id: 56, name: 'BNB Smart Chain', shortName: 'BSC' },
  { id: 137, name: 'Polygon', shortName: 'MATIC' },
  { id: 42161, name: 'Arbitrum', shortName: 'ARB' },
  { id: 8453, name: 'Base', shortName: 'BASE' },
  { id: 10, name: 'Optimism', shortName: 'OP' },
  { id: 43114, name: 'Avalanche', shortName: 'AVAX' },
];
