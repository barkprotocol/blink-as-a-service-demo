'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownUp, Loader2, AlertCircle, RefreshCw, Wallet } from 'lucide-react'
import { useToast } from "@/lib/use-toast"
import Image from 'next/image'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Jupiter } from '@jup-ag/core'

const tokenList = [
  { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112' },
  { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  { symbol: 'BARK', mint: '2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg' },
]

const TokenIcon = ({ token }: { token: string }) => (
  <div className="w-6 h-6 mr-2">
    <Image src={`/icons/${token.toLowerCase()}.png`} alt={`${token} icon`} width={24} height={24} />
  </div>
)

export function JupiterSwap() {
  const [fromToken, setFromToken] = useState(tokenList[0])
  const [toToken, setToToken] = useState(tokenList[1])
  const [amount, setAmount] = useState('')
  const [routes, setRoutes] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const { toast } = useToast()
  const { connection } = useConnection()
  const wallet = useWallet()

  useEffect(() => {
    fetchBalance()
    if (amount && fromToken && toToken) {
      fetchRoutes()
    }
  }, [fromToken, toToken, amount, wallet.publicKey, connection])

  const fetchBalance = async () => {
    if (wallet.publicKey) {
      try {
        const balance = await connection.getBalance(wallet.publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
        toast({
          title: "Error",
          description: "Failed to fetch balance. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const fetchRoutes = async () => {
    setIsLoading(true)
    try {
      const jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: wallet.publicKey ?? undefined,
      })

      const computedRoutes = await jupiter.computeRoutes({
        inputMint: new PublicKey(fromToken.mint),
        outputMint: new PublicKey(toToken.mint),
        amount: parseFloat(amount) * LAMPORTS_PER_SOL,
        slippageBps: 50,
      })

      setRoutes(computedRoutes.routesInfos)
      setSelectedRoute(computedRoutes.routesInfos[0])
    } catch (error) {
      console.error('Failed to fetch routes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch swap routes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!wallet.publicKey || !selectedRoute) {
      toast({
        title: "Error",
        description: "Please connect your wallet and select a route.",
        variant: "destructive",
      })
      return
    }

    setIsSwapping(true)
    try {
      const jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: wallet.publicKey,
      })

      const { execute } = await jupiter.exchange({
        routeInfo: selectedRoute,
      })

      const swapResult = await execute()

      if ('error' in swapResult) {
        throw new Error(swapResult.error)
      }

      toast({
        title: "Swap Successful",
        description: `Swapped ${amount} ${fromToken.symbol} to ${selectedRoute.outAmount / LAMPORTS_PER_SOL} ${toToken.symbol}`,
        variant: "default",
      })
      setAmount('')
      fetchBalance()
    } catch (error) {
      console.error('Swap failed:', error)
      toast({
        title: "Swap Failed",
        description: "An error occurred while processing the swap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSwapping(false)
    }
  }

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Jupiter Swap</CardTitle>
        <CardDescription>Swap tokens using Jupiter aggregator</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {wallet.publicKey ? (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Wallet Balance:</span>{' '}
            {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
          </div>
        ) : (
          <div className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
            <Wallet className="w-4 h-4 mr-1" />
            Please connect your wallet
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="from-token" className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
          <div className="flex space-x-2">
            <Select value={fromToken.symbol} onValueChange={(value) => setFromToken(tokenList.find(t => t.symbol === value)!)}>
              <SelectTrigger id="from-token" className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokenList.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center">
                      <TokenIcon token={token.symbol} />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="amount"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-grow"
              min="0"
              step="0.000001"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button variant="outline" size="icon" onClick={switchTokens} className="rounded-full" aria-label="Switch tokens">
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <label htmlFor="to-token" className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
          <div className="flex items-center space-x-2">
            <Select value={toToken.symbol} onValueChange={(value) => setToToken(tokenList.find(t => t.symbol === value)!)}>
              <SelectTrigger id="to-token" className="w-full">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokenList.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center">
                      <TokenIcon token={token.symbol} />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedRoute && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Best route:</span>{' '}
            {selectedRoute.marketInfos.map((info: any) => info.label).join(' → ')}
            <br />
            <span className="font-medium">Estimated output:</span>{' '}
            {(selectedRoute.outAmount / LAMPORTS_PER_SOL).toFixed(6)} {toToken.symbol}
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Fetching routes...</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSwap} 
          disabled={isSwapping || !amount || parseFloat(amount) <= 0 || !wallet.publicKey || !selectedRoute}
        >
          {isSwapping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Swapping...
            </>
          ) : (
            'Swap'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}