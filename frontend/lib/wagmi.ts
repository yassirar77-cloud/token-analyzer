import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { localhost, sepolia, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_CHAIN_ID === '1337' ? [localhost] : []),
    sepolia,
    mainnet,
  ],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'PLACEHOLDER_FOR_BUILD';
if (projectId === 'PLACEHOLDER_FOR_BUILD') {
  console.warn('Warning: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Wallet connections may fail.');
}

const { connectors } = getDefaultWallets({
  appName: 'Back Street Dogs',
  projectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
