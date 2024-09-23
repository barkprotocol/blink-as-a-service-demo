'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from "@/components/ui/button"
import { Loader2, Wallet, ChevronDown } from 'lucide-react'
import { useToast } from "@/lib/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConnection } from '@solana/wallet-adapter-react'

export function WalletButton() {
  const { wallet, connect, disconnect, connecting, connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchBalance = useCallback(async () => {
    if (publicKey) {
      try {
        const balance = await connection.getBalance(publicKey)
        setBalance(balance / 1e9) // Convert lamports to SOL
      } catch (error) {
        console.error('Failed to fetch balance:', error)
        setBalance(null)
        toast({
          title: "Balance Fetch Failed",
          description: "Failed to fetch wallet balance. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [publicKey, connection, toast])

  useEffect(() => {
    if (publicKey) {
      fetchBalance()
    } else {
      setBalance(null)
    }
  }, [publicKey, fetchBalance])

  const handleConnect = async () => {
    try {
      if (wallet) {
        await connect()
      } else {
        setVisible(true)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!isClient) {
    return null // Prevent SSR issues
  }

  if (connecting) {
    return (
      <Button variant="outline" disabled className="w-[180px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-between">
            <Wallet className="mr-2 h-4 w-4" />
            <span className="mx-2">{truncateAddress(publicKey.toBase58())}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={fetchBalance}>
            Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Fetch Balance'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`https://explorer.solana.com/address/${publicKey.toBase58()}`, '_blank')}>
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant="outline" onClick={handleConnect} className="w-[180px]">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}