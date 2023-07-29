"use client";

import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import "./global.css";

export const metadata = {
  title: "Web3Paypal",
  description: "My Web3Paypal Application",
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={config}>
          {children}
        </WagmiConfig>
      </body>
    </html>
  );
}
