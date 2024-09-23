'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Heart, RefreshCw, DollarSign, AlertTriangle, CheckCircle2, Wallet } from 'lucide-react'
import { useToast } from "@/lib/use-toast"
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token'

// NOTE: These are BARK public keys for development. Replace with actual keys in production.
const BARK_TOKEN_ADDRESS = new PublicKey('2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg')
const USDC_COIN_ADDRESS = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const DONATION_WALLET = new PublicKey('BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo')

const CurrencyIcon = React.memo(({ currency }: { currency: string }) => {
  const iconPath = `/icons/${currency.toLowerCase()}.png`
  return (
    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
      <Image src={iconPath} alt={`${currency} icon`} width={24} height={24} />
    </div>
  )
})

const predefinedAmounts = [5, 10, 25, 50, 100]

const campaigns = [
  {
    id: 'animal-shelter',
    name: 'Animal Shelter Support',
    description: 'Help us provide food, medical care, and shelter for rescued animals in need.',
    image: '/placeholder.svg?height=200&width=400',
    address: DONATION_WALLET,
  },
  {
    id: 'tree-planting',
    name: 'Tree Planting Initiative',
    description: 'Support our efforts to combat deforestation and climate change by planting trees worldwide.',
    image: '/placeholder.svg?height=200&width=400',
    address: DONATION_WALLET,
  },
  {
    id: 'clean-water',
    name: 'Clean Water Project',
    description: 'Help provide clean and safe drinking water to communities in developing countries.',
    image: '/placeholder.svg?height=200&width=400',
    address: DONATION_WALLET,
  },
  {
    id: 'education',
    name: 'Education for All',
    description: 'Support programs that provide quality education and learning resources to underprivileged children.',
    image: '/placeholder.svg?height=200&width=400',
    address: DONATION_WALLET,
  },
]

const CampaignCard = React.memo(({ campaign, isSelected, onClick }: { campaign: typeof campaigns[0], isSelected: boolean, onClick: () => void }) => (
  <Card 
    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-[#CBB5A7]' : ''}`}
    onClick={onClick}
  >
    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
      <Image
        src={campaign.image}
        alt={campaign.name}
        layout="fill"
        objectFit="cover"
      />
      {isSelected && (
        <div className="absolute top-2 right-2 bg-[#CBB5A7] rounded-full p-1">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-bold truncate">{campaign.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{campaign.description}</p>
    </CardContent>
  </Card>
))

export default function DonationsPage() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('SOL')
  const [isLoading, setIsLoading] = useState(false)
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [usdEquivalent, setUsdEquivalent] = useState('0.00')
  const [error, setError] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0])
  const { toast } = useToast()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Refresh prices every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    calculateUsdEquivalent()
  }, [amount, currency, prices])

  const fetchPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd')
      const data = await response.json()
      setPrices({
        SOL: data.solana.usd,
        USDC: data['usd-coin'].usd,
        BARK: 0.0008 // Mocked price for BARK token
      })
    } catch (error) {
      console.error('Error fetching prices:', error)
      toast({
        title: "Failed to fetch prices",
        description: "Please try again later or proceed with caution.",
        variant: "destructive",
      })
    }
  }

  const calculateUsdEquivalent = () => {
    const numericAmount = parseFloat(amount) || 0
    const price = prices[currency] || 0
    setUsdEquivalent((numericAmount * price).toFixed(2))
  }

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Solana wallet to make a donation.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const parsedAmount = parseFloat(amount)
      let transaction = new Transaction()

      if (currency === 'SOL') {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: selectedCampaign.address,
            lamports: parsedAmount * LAMPORTS_PER_SOL,
          })
        )
      } else {
        const tokenMintAddress = currency === 'BARK' ? BARK_TOKEN_ADDRESS : USDC_COIN_ADDRESS
        const tokenAccountInfo = await connection.getTokenAccountsByOwner(publicKey, { mint: tokenMintAddress })
        const sourceTokenAccount = tokenAccountInfo.value[0].pubkey

        transaction.add(
          createTransferInstruction(
            sourceTokenAccount,
            selectedCampaign.address,
            publicKey,
            parsedAmount * (10 ** (currency === 'USDC' ? 6 : 9)), // USDC has 6 decimals, BARK has 9
            [],
            TOKEN_PROGRAM_ID
          )
        )
      }

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Thank you for your donation!",
        description: `You have donated ${amount} ${currency} (≈$${usdEquivalent} USD) to ${selectedCampaign.name}.`,
      })
      setAmount('')
      setIsCustomAmount(false)
    } catch (error) {
      console.error("Error processing donation:", error)
      setError('There was an error processing your donation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString())
    setIsCustomAmount(false)
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    setIsCustomAmount(true)
  }

  const memoizedCampaignCards = useMemo(() => (
    campaigns.map((campaign) => (
      <CampaignCard
        key={campaign.id}
        campaign={campaign}
        isSelected={selectedCampaign.id === campaign.id}
        onClick={() => setSelectedCampaign(campaign)}
      />
    ))
  ), [selectedCampaign])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Donations</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {memoizedCampaignCards}
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#CBB5A7] to-[#E6D5CA] text-white p-6">
            <CardTitle className="text-3xl font-bold text-center">Make a Donation</CardTitle>
            <CardDescription className="text-center text-gray-100">Your support helps us make a difference</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Selected Campaign: {selectedCampaign.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{selectedCampaign.description}</p>
            </div>
            <form onSubmit={handleDonation} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Select Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {['SOL', 'BARK', 'USDC'].map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        <div className="flex items-center justify-between w-full mr-1">
                          <div className="flex items-center space-x-2">
                            <CurrencyIcon currency={curr} />
                            <span className="font-medium">{curr}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            ${prices[curr]?.toFixed(2) || '-.--'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Select Amount</Label>
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map((presetAmount) => (
                    <Button
                      key={presetAmount}
                      type="button"
                      variant={amount === presetAmount.toString() && !isCustomAmount ? "default" : "outline"}
                      onClick={() => handleAmountSelect(presetAmount)}
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {presetAmount} {currency}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={isCustomAmount ? "default" : "outline"}
                    onClick={() => setIsCustomAmount(true)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Custom
                  </Button>
                </div>
              </div>
              {isCustomAmount && (
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Custom Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter custom amount"
                    value={amount}
                    onChange={handleCustomAmountChange}
                    required
                    min="0.000001"
                    step="0.000001"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600">
                <span className="text-lg font-semibold flex items-center text-gray-800 dark:text-gray-200">
                  <DollarSign className="h-5 w-5 mr-1 text-gray-600 dark:text-gray-400" />
                  {usdEquivalent} USD
                </span>
                <Button type="button" variant="outline" size="sm" onClick={fetchPrices} className="bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Rates
                </Button>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-900/90 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#CBB5A7] focus:ring-opacity-50 shadow-lg"
                disabled={isLoading || !publicKey || !amount}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600 dark:text-gray-400">
            Your donation is securely processed on the Solana blockchain and greatly appreciated.
          </CardFooter>
        </Card>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg flex items-center justify-center"
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}