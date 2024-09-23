'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletConnectButton() {
  const { wallet, connect, disconnect, connecting, connected, publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully.');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.info('Wallet disconnected.');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet. Please try again.');
    }
  };

  if (!isClient) {
    return null; // Prevent SSR issues
  }

  if (connecting) {
    return (
      <Button disabled className="bg-primary text-primary-foreground" aria-label="Connecting wallet">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        Connecting...
      </Button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600" aria-label="Connected wallet address">
          {`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
        </span>
        <Button onClick={handleDisconnect} variant="outline" aria-label="Disconnect wallet">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <WalletMultiButton
      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
      startIcon={<Wallet className="mr-2 h-4 w-4" aria-hidden="true" />}
      onClick={handleConnect}
      aria-label="Connect Wallet"
    >
      Connect Wallet
    </WalletMultiButton>
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const network = clusterApiUrl('devnet');
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={network}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

export function SolanaWalletWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      {children}
    </WalletProvider>
  );
}