'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/lib/use-toast"
import { WalletConnect } from '@/components/wallet-connect'
import { Loader2, Zap, ArrowRight, Trash2, Edit2, Eye, EyeOff, AlertCircle, Info, Upload, Download } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Blink {
  id: string
  name: string
  description: string
  action: string
  isActive: boolean
  createdAt: string
  lastUsed: string
  image?: string
}

const actionTypes = [
  { value: 'transfer', label: 'Token Transfer' },
  { value: 'mint', label: 'NFT Minting' },
  { value: 'swap', label: 'Token Swap' },
  { value: 'stake', label: 'Staking' },
]

export default function BlinkPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [formData, setFormData] = useState({ name: '', description: '', action: '' })
  const [errors, setErrors] = useState({ name: '', description: '', action: '' })
  const [editingBlink, setEditingBlink] = useState<Blink | null>(null)
  const [showInactiveBlinks, setShowInactiveBlinks] = useState(false)
  const [filterAction, setFilterAction] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { toast } = useToast()

  const fetchBlinks = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockBlinks: Blink[] = [
        { id: '1', name: 'Token Transfer', description: 'Transfer tokens between wallets', action: 'transfer', isActive: true, createdAt: '2023-06-01', lastUsed: '2023-06-15', image: '/placeholder.svg?height=100&width=100' },
        { id: '2', name: 'NFT Minting', description: 'Mint new NFTs', action: 'mint', isActive: false, createdAt: '2023-05-20', lastUsed: '2023-06-10', image: '/placeholder.svg?height=100&width=100' },
        { id: '3', name: 'Token Swap', description: 'Swap tokens on DEX', action: 'swap', isActive: true, createdAt: '2023-06-05', lastUsed: '2023-06-18', image: '/placeholder.svg?height=100&width=100' },
      ]
      setBlinks(mockBlinks)
    } catch (error) {
      console.error('Error fetching blinks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch blinks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBlinks()
  }, [fetchBlinks])

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

      const newBlink: Blink = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        image: image ? URL.createObjectURL(image) : undefined,
      }
      setBlinks(prev => [...prev, newBlink])

      setFormData({ name: '', description: '', action: '' })
      setImage(null)
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

  const handleDeleteBlink = async (id: string) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBlinks(prev => prev.filter(blink => blink.id !== id))
      toast({
        title: "Blink Deleted",
        description: "The Blink has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting Blink:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the Blink. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditBlink = (blink: Blink) => {
    setEditingBlink(blink)
    setFormData({
      name: blink.name,
      description: blink.description,
      action: blink.action,
    })
    setImage(null)
  }

  const handleUpdateBlink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm() || !editingBlink) return

    setIsLoading(true)

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedBlink: Blink = {
        ...editingBlink,
        ...formData,
        image: image ? URL.createObjectURL(image) : editingBlink.image,
      }

      setBlinks(prev => prev.map(blink => blink.id === updatedBlink.id ? updatedBlink : blink))

      setFormData({ name: '', description: '', action: '' })
      setEditingBlink(null)
      setImage(null)
      toast({
        title: "Blink Updated",
        description: "Your Blink has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating Blink:", error)
      toast({
        title: "Error",
        description: "There was an error updating your Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleBlinkStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBlinks(prev => prev.map(blink => 
        blink.id === id ? { ...blink, isActive: !currentStatus } : blink
      ))
      toast({
        title: "Blink Status Updated",
        description: `Blink has been ${currentStatus ? 'deactivated' : 'activated'}.`,
      })
    } catch (error) {
      console.error("Error toggling Blink status:", error)
      toast({
        title: "Error",
        description: "There was an error updating the Blink status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleDownloadBlink = (blink: Blink) => {
    const blinkData = JSON.stringify(blink, null, 2)
    const blob = new Blob([blinkData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blink_${blink.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredBlinks = blinks
    .filter(blink => showInactiveBlinks || blink.isActive)
    .filter(blink => !filterAction || blink.action === filterAction)
    .filter(blink => 
      blink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blink.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Zap className="h-8 w-8 text-primary mr-2" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Blink Dashboard</h1>
      </div>
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Blink</TabsTrigger>
          <TabsTrigger value="manage">Manage Blinks</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>{editingBlink ? 'Edit Blink' : 'Create a New Blink'}</CardTitle>
              <CardDescription>
                {editingBlink ? 'Modify your existing Blink' : 'Deploy a new Blink action on the Solana blockchain.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingBlink ? handleUpdateBlink : handleCreateBlink}>
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
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="image">Image</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                        Upload Image
                      </Button>
                      {image && <span className="text-sm text-gray-500">{image.name}</span>}
                    </div>
                  </div>
                </div>
                <CardFooter className="flex justify-between mt-4">
                  <WalletConnect />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                              {editingBlink ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              {editingBlink ? 'Update' : 'Create'} Blink
                              <Zap className="ml-2 h-4 w-4" aria-hidden="true" />
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This action requires a small transaction fee.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Blinks</CardTitle>
              <CardDescription>View and manage your existing Blink actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-inactive"
                    checked={showInactiveBlinks}
                    onCheckedChange={setShowInactiveBlinks}
                  />
                  <Label htmlFor="show-inactive">Show inactive Blinks</Label>
                </div>
                <Select
                  value={filterAction}
                  onValueChange={setFilterAction}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    {actionTypes.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search Blinks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-auto"
                />
              </div>
              <AnimatePresence>
                {filteredBlinks.length > 0 ? (
                  <motion.div className="space-y-4">
                    {filteredBlinks.map((blink) => (
                      <motion.div
                        key={blink.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center mb-4 md:mb-0">
                          {blink.image && (
                            <img
                              src={blink.image}
                              alt={`${blink.name} icon`}
                              className="w-12 h-12 rounded-full mr-4"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">{blink.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{blink.description}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Created: {new Date(blink.createdAt).toLocaleDateString()}
                              {' | '}
                              Last used: {new Date(blink.lastUsed).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleBlinkStatus(blink.id, blink.isActive)}>
                            {blink.isActive ? <Eye className="h-4 w-4 mr-1" aria-hidden="true" /> : <EyeOff className="h-4 w-4 mr-1" aria-hidden="true" />}
                            {blink.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditBlink(blink)}>
                            <Edit2 className="h-4 w-4 mr-1" aria-hidden="true" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadBlink(blink)}>
                            <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                            Download
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Are you sure you want to delete this Blink?</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will permanently delete the Blink.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDeleteBlink(blink.id)}>Delete</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertTitle>No Blinks Found</AlertTitle>
                    <AlertDescription>
                      {showInactiveBlinks
                        ? "You haven't created any Blinks yet."
                        : "You don't have any active Blinks. Try showing inactive Blinks or create a new one."}
                    </AlertDescription>
                  </Alert>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/pages/blinkboard">
                  Go to Blinkboard
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}