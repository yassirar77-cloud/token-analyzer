'use client';

import { TokenAnalysis } from '@/types/token';

interface Props {
  analysis: TokenAnalysis | null;
  loading: boolean;
  error: string | null;
}

export default function TokenAnalyzer({ analysis, loading, error }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold text-lg mb-2">Error</h3>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { data, riskScore, riskLevel } = analysis;

  const getRiskColor = () => {
    if (riskLevel === 'critical') return 'text-red-500';
    if (riskLevel === 'high') return 'text-orange-500';
    if (riskLevel === 'medium') return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskBgColor = () => {
    if (riskLevel === 'critical') return 'bg-red-500';
    if (riskLevel === 'high') return 'bg-orange-500';
    if (riskLevel === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const SecurityFlag = ({ label, value, dangerous = false }: { label: string; value: boolean | string; dangerous?: boolean }) => {
    const isTrue = value === '1' || value === true;
    const flagColor = isTrue
      ? dangerous
        ? 'bg-red-500/20 text-red-400 border-red-500'
        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      : 'bg-green-500/20 text-green-400 border-green-500';

    return (
      <div className={`border rounded-lg px-4 py-2 ${flagColor}`}>
        <div className="text-xs opacity-70">{label}</div>
        <div className="font-semibold">{isTrue ? 'Yes' : 'No'}</div>
      </div>
    );
  };

  const buyTax = parseFloat(data.buy_tax || '0') * 100;
  const sellTax = parseFloat(data.sell_tax || '0') * 100;

  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Risk Assessment</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(riskScore / 100) * 351.86} 351.86`}
                className={getRiskColor()}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getRiskColor()}`}>{riskScore}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Risk Level</div>
            <div className={`text-2xl font-bold uppercase ${getRiskColor()}`}>
              {riskLevel}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {riskLevel === 'critical' && 'Extremely dangerous - Do not interact'}
              {riskLevel === 'high' && 'High risk - Exercise extreme caution'}
              {riskLevel === 'medium' && 'Moderate risk - Verify before trading'}
              {riskLevel === 'low' && 'Low risk - Appears relatively safe'}
            </div>
          </div>
        </div>
      </div>

      {/* Security Flags */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Security Flags</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <SecurityFlag label="Honeypot" value={data.is_honeypot} dangerous />
          <SecurityFlag label="Mintable" value={data.is_mintable} dangerous />
          <SecurityFlag label="Transfer Pausable" value={data.transfer_pausable} dangerous />
          <SecurityFlag label="Blacklist Function" value={data.is_blacklisted} dangerous />
          <SecurityFlag label="Cannot Sell All" value={data.cannot_sell_all} dangerous />
          <SecurityFlag label="Cannot Buy" value={data.cannot_buy} dangerous />
          <SecurityFlag label="Proxy Contract" value={data.is_proxy} />
          <SecurityFlag label="Hidden Owner" value={data.hidden_owner} dangerous />
          <SecurityFlag label="Self Destruct" value={data.selfdestruct} dangerous />
          <SecurityFlag label="Airdrop Scam" value={data.is_airdrop_scam} dangerous />
          <SecurityFlag label="Trading Cooldown" value={data.trading_cooldown} />
          <SecurityFlag label="In DEX" value={data.is_in_dex} />
        </div>
      </div>

      {/* Taxes */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Trading Taxes</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Buy Tax</div>
            <div className={`text-2xl font-bold ${buyTax > 10 ? 'text-red-400' : 'text-green-400'}`}>
              {buyTax.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Sell Tax</div>
            <div className={`text-2xl font-bold ${sellTax > 10 ? 'text-red-400' : 'text-green-400'}`}>
              {sellTax.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Token Info */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Token Information</h2>
        <div className="grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Holder Count:</span>
            <span className="font-semibold">{data.holder_count || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">LP Holder Count:</span>
            <span className="font-semibold">{data.lp_holder_count || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Owner Address:</span>
            <span className="font-mono text-xs">{data.owner_address || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Creator Address:</span>
            <span className="font-mono text-xs">{data.creator_address || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Top Holders */}
      {data.holders && data.holders.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Top Holders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Address</th>
                  <th className="text-right py-2 text-gray-400">Balance %</th>
                  <th className="text-center py-2 text-gray-400">Locked</th>
                  <th className="text-left py-2 text-gray-400">Tag</th>
                </tr>
              </thead>
              <tbody>
                {data.holders.slice(0, 10).map((holder, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-2 font-mono text-xs">
                      {holder.address.slice(0, 10)}...{holder.address.slice(-8)}
                    </td>
                    <td className="text-right py-2 font-semibold">
                      {(parseFloat(holder.percent) * 100).toFixed(2)}%
                    </td>
                    <td className="text-center py-2">
                      {holder.is_locked === 1 ? (
                        <span className="text-green-400">🔒</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-2 text-gray-400">{holder.tag || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEX Info */}
      {data.dex && data.dex.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">DEX Listings</h2>
          <div className="space-y-3">
            {data.dex.map((dex, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{dex.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{dex.pair}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Liquidity</div>
                  <div className="font-semibold">${parseFloat(dex.liquidity).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
