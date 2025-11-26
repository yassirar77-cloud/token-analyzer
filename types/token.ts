export interface TokenSecurityData {
  is_honeypot: string;
  is_mintable: string;
  is_proxy: string;
  can_take_back_ownership: string;
  owner_change_balance: string;
  hidden_owner: string;
  selfdestruct: string;
  external_call: string;
  buy_tax: string;
  sell_tax: string;
  is_blacklisted: string;
  is_whitelisted: string;
  is_in_dex: string;
  transfer_pausable: string;
  trading_cooldown: string;
  personal_slippage_modifiable: string;
  cannot_buy: string;
  cannot_sell_all: string;
  slippage_modifiable: string;
  holder_count: string;
  total_supply: string;
  owner_address: string;
  creator_address: string;
  lp_holder_count: string;
  lp_total_supply: string;
  is_true_token: string;
  is_airdrop_scam: string;
  trust_list: string;
  holders?: Array<{
    address: string;
    balance: string;
    percent: string;
    is_contract: number;
    is_locked: number;
    tag: string;
  }>;
  dex?: Array<{
    name: string;
    liquidity: string;
    pair: string;
  }>;
}

export interface TokenAnalysis {
  address: string;
  chainId: number;
  data: TokenSecurityData;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface Chain {
  id: number;
  name: string;
  shortName: string;
}
