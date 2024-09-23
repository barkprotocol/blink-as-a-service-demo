'use client'

import { ThemeProvider } from 'next-themes'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { Navbar } from '@/components/ui/layout/navbar'

require('@solana/wallet-adapter-react-ui/styles.css')

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <Navbar />
          <main>{children}</main>
        </WalletModalProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}