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

const { connectors } = getDefaultWallets({
  appName: 'Back Street Dogs',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
