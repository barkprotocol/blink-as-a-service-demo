'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/lib/use-toast"
import { Loader2 } from 'lucide-react'

export function Payments() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('sol')
  const [isProcessing, setIsProcessing] = useState(false)

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { toast } = useToast()

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment.",
        variant: "destructive",
      })
      return
    }

    if (!amount || !recipient) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const recipientPubKey = new PublicKey(recipient)
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL

      let transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Payment Successful",
        description: `You have sent ${amount} ${paymentMethod.toUpperCase()} to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
      })

      setAmount('')
      setRecipient('')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Make a Payment</CardTitle>
        <CardDescription>Send funds securely on the Solana blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="Solana address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sol">SOL</SelectItem>
                <SelectItem value="usdc">USDC</SelectItem>
                <SelectItem value="bark">BARK</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Send Payment'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Transaction fees may apply. Always double-check the recipient address.
      </CardFooter>
    </Card>
  )
}