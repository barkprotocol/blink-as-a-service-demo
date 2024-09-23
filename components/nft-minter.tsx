'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/lib/use-toast"
import { Loader2 } from 'lucide-react'

export function NFTMinter() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleMint = async () => {
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
      // Create mint account
      const mint = await createMint(
        connection,
        wallet.publicKey,
        wallet.publicKey,
        null,
        0
      )

      // Get the token account of the wallet address, and if it does not exist, create it
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.publicKey,
        mint,
        wallet.publicKey
      )

      // Mint 1 token to the token account
      await mintTo(
        connection,
        wallet.publicKey,
        mint,
        tokenAccount.address,
        wallet.publicKey,
        1
      )

      // Create metadata (this is a simplified version, in a real-world scenario you'd use Metaplex)
      const metadata = {
        name,
        description,
        image: imageUrl
      }

      // In a real-world scenario, you'd upload this metadata to Arweave or IPFS
      console.log('NFT Metadata:', metadata)

      toast({
        title: "NFT Minted Successfully",
        description: `Mint address: ${mint.toBase58()}`,
      })
    } catch (error) {
      console.error('NFT minting failed:', error)
      toast({
        title: "NFT Minting Failed",
        description: error.message || "An error occurred during NFT minting.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nft-name">NFT Name</Label>
        <Input
          id="nft-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter NFT name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nft-description">Description</Label>
        <Textarea
          id="nft-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter NFT description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nft-image">Image URL</Label>
        <Input
          id="nft-image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
        />
      </div>
      <Button onClick={handleMint} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting...
          </>
        ) : (
          'Mint NFT'
        )}
      </Button>
    </div>
  )
}