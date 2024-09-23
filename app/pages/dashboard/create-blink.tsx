'use client'

import React from 'react'
import { CreateBlink } from '@/components/ui/create-blink'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { ConnectionProvider } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
export default function Page() {
  return <h1>Blink</h1>
}

// You can add more wallets here
const wallets = [new PhantomWalletAdapter()]

// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
const network = clusterApiUrl('devnet')

export default function BlinkPage() {
  const handleBack = () => {
    // Implement your back navigation logic here
    console.log('Navigating back')
  }

  const handleCreateSuccess = (newBlink) => {
    // Handle the newly created Blink
    console.log('New Blink created:', newBlink)
  }

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create a New Blink</h1>
            <CreateBlink onBack={handleBack} onCreateSuccess={handleCreateSuccess} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}