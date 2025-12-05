import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'No-Loss Betting Protocol',
  projectId: 'a15fce8a598f3f9c12fb8de72477ff8f', 
  chains: [baseSepolia, sepolia],
  ssr: true,
});
