'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/lib/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NFTMinter } from './nft-minter'

interface NFT {
  id: string
  name: string
  image: string
  description: string
}

export function NFTGallery() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchNFTs()
  }, [])

  const fetchNFTs = async () => {
    setLoading(true)
    try {
      // In a real application, this would fetch NFTs from an API
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockNFTs: NFT[] = [
        { id: '1', name: 'Cool Cat #1', image: '/placeholder.svg?height=200&width=200', description: 'A cool cat NFT' },
        { id: '2', name: 'Bored Ape #42', image: '/placeholder.svg?height=200&width=200', description: 'A bored ape NFT' },
        { id: '3', name: 'Crypto Punk #007', image: '/placeholder.svg?height=200&width=200', description: 'A crypto punk NFT' },
      ]
      setNfts(mockNFTs)
    } catch (error) {
      console.error('Error fetching NFTs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch NFTs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Gallery</CardTitle>
        <CardDescription>View and manage your NFT collection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Mint New NFT</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mint a New NFT</DialogTitle>
                <DialogDescription>
                  Create your own unique NFT on the Solana blockchain.
                </DialogDescription>
              </DialogHeader>
              <NFTMinter />
            </DialogContent>
          </Dialog>
        </div>
        {loading ? (
          <p>Loading NFTs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <Card key={nft.id}>
                <CardHeader>
                  <CardTitle>{nft.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={nft.image} alt={nft.name} className="w-full h-auto rounded-lg" />
                  <p className="mt-2 text-sm text-gray-600">{nft.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchNFTs} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh NFTs'}
        </Button>
      </CardFooter>
    </Card>
  )
}