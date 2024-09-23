'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/use-toast"
import { Loader2 } from 'lucide-react'

export function SolanaPay() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { toast } = useToast()
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    if (!wallet.publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const recipientPublicKey = new PublicKey(recipient)
      const mintPublicKey = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') // USDC on Solana mainnet

      const mint = await getMint(connection, mintPublicKey)
      const amountInTokens = parseFloat(amount) * (10 ** mint.decimals)

      const fromTokenAccount = await getAssociatedTokenAddress(mintPublicKey, wallet.publicKey)
      const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey)

      const transaction = new Transaction().add(
        createTransferCheckedInstruction(
          fromTokenAccount,
          mintPublicKey,
          toTokenAccount,
          wallet.publicKey,
          amountInTokens,
          mint.decimals
        )
      )

      const signature = await wallet.sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Payment Successful",
        description: `You've sent ${amount} USDC to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
      })
    } catch (error) {
      console.error('Payment failed:', error)
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during the payment.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana Pay</CardTitle>
        <CardDescription>Send USDC payments quickly and easily</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient's Solana address"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePayment} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Send Payment'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}