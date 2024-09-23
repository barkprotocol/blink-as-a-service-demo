'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/use-toast"
import { Loader2, Upload, ArrowLeft, Link as LinkIcon, Wallet, Info, AlertCircle, Image as ImageIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface CreateBlinkProps {
  onBack: () => void
}

const actionTypes = [
  { value: 'transfer', label: 'Token Transfer' },
  { value: 'mint', label: 'NFT Minting' },
  { value: 'swap', label: 'Token Swap' },
  { value: 'stake', label: 'Staking' },
]

export function CreateBlink({ onBack }: CreateBlinkProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', action: '' })
  const [errors, setErrors] = useState({ name: '', description: '', action: '' })
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { toast } = useToast()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { name: '', description: '', action: '' }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
      isValid = false
    }
    if (!formData.action) {
      newErrors.action = 'Action is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleCreateBlink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Solana wallet to create a Blink.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const transactionFee = 0.01 * LAMPORTS_PER_SOL

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: PublicKey.default,
          lamports: transactionFee,
        })
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'processed')

      // Simulating API call to create Blink
      await new Promise(resolve => setTimeout(resolve, 2000))

      setFormData({ name: '', description: '', action: '' })
      toast({
        title: "Blink Created",
        description: "Your new Blink has been successfully created and deployed.",
      })
    } catch (error) {
      console.error("Error creating Blink:", error)
      toast({
        title: "Error",
        description: "There was an error creating your Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>Create a New Blink</CardTitle>
        </div>
        <CardDescription>Deploy a new Blink action on the Solana blockchain.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateBlink}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your Blink name" 
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <p id="name-error" className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your Blink" 
                aria-invalid={errors.description ? 'true' : 'false'}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && <p id="description-error" className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="action">Action</Label>
              <Select 
                value={formData.action} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.action && <p id="action-error" className="text-red-500 text-sm">{errors.action}</p>}
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Creating a Blink requires a small transaction fee.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Blink
                  <Upload className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}