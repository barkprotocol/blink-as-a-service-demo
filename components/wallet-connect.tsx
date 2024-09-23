'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useConnection } from '@solana/wallet-adapter-react';

const wallets = [
  { name: 'Phantom', icon: '/icons/wallets/phantom.png' },
  { name: 'Solflare', icon: '/icons/wallets/solflare.png' },
  { name: 'Ledger', icon: '/icons/wallets/ledger.png' },
  { name: 'Torus', icon: '/icons/wallets/torus.png' },
];

const solanaLogo = 'https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png';
const barkLogo = 'https://ucarecdn.com/74392932-2ff5-4237-a1fa-e0fd15725ecc/bark.svg';

export function WalletConnect() {
  const { select, connect, disconnect, connecting, connected, publicKey, wallet, wallets: adapterWallets } = useWallet();
  const { connection } = useConnection();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = useCallback(async () => {
    if (publicKey) {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1e9); // Convert lamports to SOL
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance(null);
      }
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, fetchBalance]);

  const handleWalletConnect = async (walletName: string) => {
    try {
      const selectedWallet = adapterWallets.find(w => w.adapter.name === walletName);
      if (selectedWallet) {
        await select(selectedWallet.adapter.name);
        await connect();
        setIsWalletOpen(false);
        toast.success(`${walletName} connected successfully!`);
      } else {
        throw new Error('Wallet not found');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error(`Failed to connect ${walletName}. Please try again.`);
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

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      toast.success('Address copied to clipboard!');
    }
  };

  if (connecting) {
    return (
      <Button disabled className="bg-gray-800 text-white hover:bg-gray-700">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          className="bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
          onClick={copyAddress}
        >
          <Image 
            src={wallet?.adapter.icon || '/placeholder.svg'}
            alt={`${wallet?.adapter.name} icon`} 
            width={16}
            height={16}
            className="mr-2"
          />
          {`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
        </Button>
        {balance !== null && (
          <span className="text-sm text-gray-300 bg-gray-800 py-2 px-3 rounded-md">
            {balance.toFixed(2)} SOL
          </span>
        )}
        <Button 
          onClick={handleDisconnect} 
          variant="destructive" 
          className="bg-red-600 hover:bg-red-700"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isWalletOpen} onOpenChange={setIsWalletOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200">
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">Connect your wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet, index) => {
            const adapterWallet = adapterWallets.find(w => w.adapter.name === wallet.name);
            const isInstalled = adapterWallet?.readyState === WalletReadyState.Installed;
            return (
              <Button
                key={index}
                className="w-full justify-between text-left font-normal bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200"
                onClick={() => handleWalletConnect(wallet.name)}
                disabled={!isInstalled}
              >
                <div className="flex items-center">
                  <Image src={wallet.icon} alt={`${wallet.name} icon`} width={24} height={24} className="mr-3" />
                  {wallet.name}
                </div>
                {isInstalled ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <span className="text-xs text-gray-400">Not installed</span>
                )}
              </Button>
            );
          })}
        </div>
        <div className="mt-6 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Image src={barkLogo} alt="BARK Logo" width={24} height={24} />
            <span className="text-sm text-gray-300">Powered by</span>
            <Image src={solanaLogo} alt="Solana Logo" width={20} height={20} />
            <span className="text-sm font-semibold text-[#01010]">Solana</span>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-900 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <p className="text-sm text-yellow-300">
              Please make sure you're on the correct network before connecting your wallet.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}