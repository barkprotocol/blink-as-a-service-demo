'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownUp, Loader2, AlertCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { useToast } from "@/lib/use-toast"
import Image from 'next/image'

const tokenIcons = {
  SOL: '/icons/sol.png',
  USDC: '/icons/usdc.png',
  BARK: '/icons/bark.png',
}

const TokenIcon = ({ token }: { token: keyof typeof tokenIcons }) => (
  <div className="w-6 h-6 mr-2">
    <Image src={tokenIcons[token]} alt={`${token} icon`} width={24} height={24} />
  </div>
)

const MarketData = () => {
  const [marketData, setMarketData] = useState({
    SOL: { price: 0, change: 0, history: [] },
    USDC: { price: 1, change: 0, history: [] },
    BARK: { price: 0, change: 0, history: [] },
  })

  const fetchMarketData = async () => {
    // Simulating API call to fetch market data
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMarketData(prevData => {
      const newData = { ...prevData }
      Object.keys(newData).forEach(token => {
        if (token === 'USDC') {
          newData[token] = { price: 1, change: 0, history: [...(prevData[token].history || []), 1] }
        } else {
          const newPrice = token === 'SOL' ? Math.random() * 100 + 50 : Math.random() * 10
          const newChange = (Math.random() - 0.5) * (token === 'SOL' ? 10 : 5)
          newData[token] = {
            price: newPrice,
            change: newChange,
            history: [...(prevData[token].history || []), newPrice].slice(-10)
          }
        }
      })
      return newData
    })
  }

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const renderOscillator = (history: number[]) => {
    const min = Math.min(...history)
    const max = Math.max(...history)
    const range = max - min
    const normalized = history.map(price => (price - min) / range * 100)
    
    return (
      <div className="flex items-end h-8 mt-2">
        {normalized.map((value, index) => (
          <div
            key={index}
            className="w-1 bg-blue-500 mr-1"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Market Data</CardTitle>
        <CardDescription>Latest prices and 24h changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(marketData).map(([token, data]) => (
            <div key={token} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TokenIcon token={token as keyof typeof tokenIcons} />
                  <span className="font-medium">{token}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">${data.price.toFixed(2)}</div>
                  <div className={`text-sm flex items-center ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {data.change.toFixed(2)}%
                  </div>
                </div>
              </div>
              {renderOscillator(data.history)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function Swap() {
  const [fromToken, setFromToken] = useState('SOL')
  const [toToken, setToToken] = useState('USDC')
  const [amount, setAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchExchangeRate = async () => {
    setIsRefreshing(true)
    // Simulating API call to fetch exchange rate
    await new Promise(resolve => setTimeout(resolve, 1000))
    setExchangeRate(Math.random() * 10 + 1)
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchExchangeRate()
  }, [fromToken, toToken])

  const handleSwap = async () => {
    setIsLoading(true)
    // Simulating a swap process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Swap Successful",
      description: `Swapped ${amount} ${fromToken} to ${(parseFloat(amount) * exchangeRate).toFixed(2)} ${toToken}`,
      variant: "default",
    })
    setAmount('')
  }

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  const estimatedAmount = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount))) return '0'
    return (parseFloat(amount) * exchangeRate).toFixed(4)
  }, [amount, exchangeRate])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Swap Tokens</CardTitle>
        <CardDescription>Exchange your tokens quickly and easily</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="from-token" className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
          <div className="flex space-x-2">
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger id="from-token" className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(tokenIcons).map((token) => (
                  <SelectItem key={token} value={token}>
                    <div className="flex items-center">
                      <TokenIcon token={token as keyof typeof tokenIcons} />
                      {token}
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
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger id="to-token" className="w-full">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(tokenIcons).map((token) => (
                  <SelectItem key={token} value={token}>
                    <div className="flex items-center">
                      <TokenIcon token={token as keyof typeof tokenIcons} />
                      {token}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
          <div className="flex items-center">
            <span className="font-medium mr-2">
              1 {fromToken} = {exchangeRate.toFixed(4)} {toToken}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchExchangeRate}
              disabled={isRefreshing}
              aria-label="Refresh exchange rate"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        {amount && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {parseFloat(amount) > 0 ? (
              <>
                <span className="font-medium">Estimated to receive:</span>{' '}
                {estimatedAmount} {toToken}
              </>
            ) : (
              <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                Please enter a valid amount
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSwap} 
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
        >
          {isLoading ? (
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

export default function TokenSwapApp() {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-start p-4">
      <MarketData />
      <Swap />
    </div>
  )
}