'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/lib/use-toast"
import { Loader2, Send, QrCode, Copy, RefreshCcw, DollarSign, TrendingUp, TrendingDown, ExternalLink, AlertCircle, Search, ArrowRightLeft } from 'lucide-react'
import QRCode from 'qrcode.react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from "@/components/ui/skeleton"

interface TokenData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  sparkline_in_7d: { price: number[] }
}

export default function PaymentsPage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [tokenData, setTokenData] = useState<TokenData[]>([])
  const [isTokenDataLoading, setIsTokenDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [convertAmount, setConvertAmount] = useState('')
  const [convertFrom, setConvertFrom] = useState('SOL')
  const [convertTo, setConvertTo] = useState('USD')
  const { toast } = useToast()

  const fetchTokenData = useCallback(async () => {
    setIsTokenDataLoading(true)
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: 'solana,usd-coin,bark',
          order: 'market_cap_desc',
          per_page: 3,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h'
        }
      })
      setTokenData(response.data)
    } catch (error) {
      console.error('Error fetching token data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch token data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsTokenDataLoading(false)
    }
  }, [toast])

  const fetchBalance = useCallback(async () => {
    if (publicKey && connection) {
      try {
        const balance = await connection.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error('Error fetching balance:', error)
        toast({
          title: "Error",
          description: "Failed to fetch wallet balance. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [publicKey, connection, toast])

  const fetchRecentTransactions = useCallback(async () => {
    if (publicKey && connection) {
      try {
        const transactions = await connection.getConfirmedSignaturesForAddress2(publicKey, { limit: 10 })
        setRecentTransactions(transactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast({
          title: "Error",
          description: "Failed to fetch recent transactions. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [publicKey, connection, toast])

  useEffect(() => {
    fetchTokenData()
    fetchBalance()
    fetchRecentTransactions()

    const intervalId = setInterval(fetchTokenData, 60000) // Refresh token data every minute
    return () => clearInterval(intervalId)
  }, [fetchTokenData, fetchBalance, fetchRecentTransactions])

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !connection) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const recipientPubKey = new PublicKey(recipient)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL
        })
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'processed')

      toast({
        title: "Payment Sent",
        description: `${amount} SOL sent to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
        variant: "default",
      })

      setAmount('')
      setRecipient('')
      fetchBalance()
      fetchRecentTransactions()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      toast({
        title: "Address Copied",
        description: "Your wallet address has been copied to the clipboard.",
        variant: "default",
      })
    }
  }

  const handleRefresh = () => {
    fetchBalance()
    fetchRecentTransactions()
    fetchTokenData()
  }

  const filteredTransactions = recentTransactions.filter(tx =>
    tx.signature.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleConvert = () => {
    const fromToken = tokenData.find(t => t.symbol.toUpperCase() === convertFrom)
    const toToken = tokenData.find(t => t.symbol.toUpperCase() === convertTo)
    if (fromToken && toToken) {
      const result = (parseFloat(convertAmount) * fromToken.current_price) / toToken.current_price
      toast({
        title: "Currency Conversion",
        description: `${convertAmount} ${convertFrom} = ${result.toFixed(6)} ${convertTo}`,
        variant: "default",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.h1 
        className="text-4xl font-bold mb-8 dark:text-white text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Payments Dashboard
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isTokenDataLoading ? (
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          tokenData.map((token) => (
            <Card key={token.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={token.image} alt={token.name} className="w-6 h-6 mr-2" />
                    <span>{token.name} ({token.symbol.toUpperCase()})</span>
                  </div>
                  <span className={`text-sm ${token.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.price_change_percentage_24h >= 0 ? <TrendingUp className="inline h-4 w-4 mr-1" /> : <TrendingDown className="inline h-4 w-4 mr-1" />}
                    {token.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2 dark:text-white">${token.current_price.toFixed(2)}</div>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={token.sparkline_in_7d.price.map((price, index) => ({ time: index, price }))}>
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={token.price_change_percentage_24h >= 0 ? "#10B981" : "#EF4444"} 
                      fill={token.price_change_percentage_24h >= 0 ? "#10B98133" : "#EF444433"} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  7-day price history
                </div>
              </CardContent>
              <CardFooter>
                <a
                  href={`https://www.coingecko.com/en/coins/${token.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors duration-200"
                >
                  View on CoinGecko
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </CardFooter>
            </Card>
          ))
        )}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="md:col-span-2">
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="send">Send Payment</TabsTrigger>
              <TabsTrigger value="receive">Receive Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <CardHeader>
                <CardTitle>Send Payment</CardTitle>
                <CardDescription>Send SOL to another wallet address</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendPayment}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        placeholder="Enter recipient's wallet address"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="amount">Amount (SOL)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount to send"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0"
                        step="0.000000001"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 transition-all duration-200 hover:bg-blue-600" 
                    type="submit" 
                    disabled={isLoading || !publicKey}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Payment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
            <TabsContent value="receive">
              <CardHeader>
                <CardTitle>Receive Payment</CardTitle>
                <CardDescription>Share your wallet address to receive payments</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {publicKey ? (
                  <>
                    <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                      <QRCode value={publicKey.toString()} size={200} />
                    </div>
                    <p className="text-sm text-center mb-4 break-all dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {publicKey.toString()}
                    </p>
                    <Button variant="outline" onClick={handleCopyAddress} className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Address
                    </Button>
                  </>
                ) : (
                  <div className="text-center dark:text-gray-300 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p>Please connect your wallet to receive payments.</p>
                  </div>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
        <div className="space-y-8">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold dark:text-white">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : 'N/A'}
                </div>
                <Button variant="outline" size="icon" onClick={handleRefresh} className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
              {balance !== null && tokenData.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  ≈ ${(balance * tokenData.find(t => t.symbol === 'sol')?.current_price || 0).toFixed(2)} USD
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="flex-grow"
                />
                <select
                  value={convertFrom}
                  onChange={(e) => setConvertFrom(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="SOL">SOL</option>
                  <option value="USD">USD</option>
                  <option value="BARK">BARK</option>
                </select>
                <ArrowRightLeft className="h-4 w-4" />
                <select
                  value={convertTo}
                  onChange={(e) => setConvertTo(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="USD">USD</option>
                  <option value="SOL">SOL</option>
                  <option value="BARK">BARK</option>
                </select>
              </div>
              <Button onClick={handleConvert} className="w-full">Convert</Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transaction History</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search transactions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </div>
            </CardTitle>
            <CardDescription>View your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-4 py-2 text-left">Transaction ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr 
                      key={index} 
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-4 py-2 text-sm dark:text-gray-300">
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-sm dark:text-gray-300">{new Date(tx.blockTime * 1000).toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm dark:text-gray-300">-- SOL</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Confirmed
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}