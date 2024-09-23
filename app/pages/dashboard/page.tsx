'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/lib/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart, Bell, DollarSign, Users, Plus, ArrowRight, Search, Moon, Sun, Image, CreditCard, Users as UsersIcon, RefreshCcw, Layers, Heart, LogIn, LogOut, UserPlus, AlertTriangle, Wallet, Settings as SettingsIcon, Send, HelpCircle, Globe } from 'lucide-react'
import { useTheme } from "next-themes"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '@/components/ui/wallet-button'
import { TransactionHistory } from '@/components/transaction-history'
import { CampaignManager } from '@/components/campaign-manager'
import { Swap } from '@/components/swap'
import { NFTGallery } from '@/components/nft-gallery'
import { Staking } from '@/components/staking'
import { Settings } from '@/components/settings'
import { SolanaPay } from '@/components/solana-pay'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

const LOGO_URL = "https://ucarecdn.com/0c2a1b21-f836-4343-9d35-19386c7f7f4d/barkprotocoldark.svg"

const queryClient = new QueryClient()

const Sidebar = React.memo(({ isLoggedIn, onSignIn, onSignUp, onLogout, walletAddress, activeTab, setActiveTab }) => {
  const navItems = useMemo(() => [
    { name: 'Dashboard', icon: <BarChart className="h-5 w-5" />, value: 'dashboard' },
    { name: 'NFT', icon: <Image className="h-5 w-5" />, value: 'nft' },
    { name: 'Swap', icon: <RefreshCcw className="h-5 w-5" />, value: 'swap' },
    { name: 'Staking', icon: <Layers className="h-5 w-5" />, value: 'staking' },
    { name: 'Payments', icon: <Send className="h-5 w-5" />, value: 'payments' },
    { name: 'Campaigns', icon: <Heart className="h-5 w-5" />, value: 'campaigns' },
    { name: 'Transactions', icon: <CreditCard className="h-5 w-5" />, value: 'transactions' },
    { name: 'Settings', icon: <SettingsIcon className="h-5 w-5" />, value: 'settings' },
  ], [])

  return (
    <aside className="flex flex-col h-screen p-3 bg-white shadow w-60 dark:bg-gray-800" aria-label="Sidebar">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <img src={LOGO_URL} alt="BARK Blink Logo" className="h-8 w-auto" />
        </div>
        <nav className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {navItems.map((item) => (
              <li key={item.value}>
                <button
                  onClick={() => setActiveTab(item.value)}
                  className={`flex items-center p-2 space-x-3 rounded-md w-full ${activeTab === item.value ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  aria-current={activeTab === item.value ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2">
          {!isLoggedIn ? (
            <>
              <Button onClick={onSignIn} className="w-full flex items-center justify-center">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
              <Button onClick={onSignUp} variant="outline" className="w-full flex items-center justify-center">
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onLogout} variant="outline" className="w-full flex items-center justify-center">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
              <div className="text-sm text-gray-500 dark:text-gray-400 break-all">
                <Wallet className="inline mr-1 h-4 w-4" />
                {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'No wallet connected'}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'

const QuickActions = () => {
  const actions = [
    { name: 'New Campaign', icon: <Plus className="h-4 w-4" /> },
    { name: 'Send Payment', icon: <Send className="h-4 w-4" /> },
    { name: 'Mint NFT', icon: <Image className="h-4 w-4" /> },
    { name: 'Stake Tokens', icon: <Layers className="h-4 w-4" /> },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button key={action.name} variant="outline" className="flex items-center justify-center">
              {action.icon}
              <span className="ml-2">{action.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const AnalyticsChart = () => {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-8"
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search"
      />
    </div>
  )
}

function BlinkboardPageContent() {
  const { setTheme, theme } = useTheme()
  const wallet = useWallet()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [language, setLanguage] = useState('en')
  const { toast } = useToast()

  const { data: statsData, isLoading: isStatsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
  })

  const { data: notificationsData, isLoading: isNotificationsLoading, error: notificationsError } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetch('/api/notifications').then(res => res.json()),
  })

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        walletAddress: wallet.publicKey.toString()
      })
      setIsLoggedIn(true)
      toast({
        title: "Wallet Connected",
        description: "You have successfully connected your wallet.",
        variant: "default",
      })
    } else {
      setUser(null)
      setIsLoggedIn(false)
    }
  }, [wallet.connected, wallet.publicKey, toast])

  useEffect(() => {
    const ws = new WebSocket('wss://example.com/ws')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'new_transaction') {
        toast({
          title: "New Transaction",
          description: `${data.amount} SOL ${data.transactionType} in ${data.campaign}`,
          variant: "default",
        })
        queryClient.invalidateQueries({ queryKey: ['stats'] })
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      }
    }

    return () => {
      ws.close()
    }
  }, [toast])

  const handleSignIn = useCallback(() => {
    wallet.connect()
  }, [wallet])

  const handleSignUp = useCallback(() => {
    wallet.connect()
  }, [wallet])

  const handleLogout = useCallback(() => {
    wallet.disconnect()
    setUser(null)
    setIsLoggedIn(false)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    })
  }, [wallet, toast])

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {isStatsLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <Skeleton key={index} className="h-32" />
                ))
              ) : statsData ? (
                statsData.map((stat, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {stat.title}
                          </CardTitle>
                          {stat.icon}
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view detailed {stat.title.toLowerCase()} report</p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <div>Error loading stats</div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <QuickActions />
              <AnalyticsChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <TransactionHistory />
              <CampaignManager />
            </div>
          </>
        )
      case 'nft':
        return <NFTGallery searchQuery={searchQuery} />
      case 'swap':
        return <Swap />
      case 'staking':
        return <Staking />
      case 'payments':
        return <SolanaPay />
      case 'campaigns':
        return <CampaignManager searchQuery={searchQuery} />
      case 'transactions':
        return <TransactionHistory searchQuery={searchQuery} />
      case 'settings':
        return <Settings />
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar 
          isLoggedIn={isLoggedIn} 
          onSignIn={handleSignIn} 
          onSignUp={handleSignUp} 
          onLogout={handleLogout}
          walletAddress={user?.walletAddress}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8 flex justify-between items-center">
              <h1 className="text-4xl font-bold dark:text-white">Blinkboard</h1>
              <div className="flex items-center space-x-4">
                <SearchBar onSearch={handleSearch} />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  />
                  <Label htmlFor="dark-mode" className="sr-only">
                    Dark Mode
                  </Label>
                  {theme === 'dark' ? 
                    <Moon className="h-4 w-4 text-gray-400" aria-hidden="true" /> :
                    <Sun className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  }
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Bell className="h-4 w-4" />
                      {notificationsData && notificationsData.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notifications</DialogTitle>
                      <DialogDescription>Stay updated with your latest activities</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px]">
                      {isNotificationsLoading ? (
                        <Skeleton className="h-20" />
                      ) : notificationsData && notificationsData.length > 0 ? (
                        notificationsData.map((notification, index) => (
                          <div key={index} className="mb-4 p-2 border-b">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <p>No new notifications</p>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Help & Support</DialogTitle>
                      <DialogDescription>Get assistance and answers to common questions</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">How do I connect my wallet?</h3>
                          <p>Click on the "Sign In" button and select your preferred wallet provider.</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">How can I create a new campaign?</h3>
                          <p>Navigate to the Campaigns tab and click on the "New Campaign" button.</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">What is Solana Pay?</h3>
                          <p>Solana Pay is a decentralized payment protocol that allows for fast and low-cost transactions on the Solana blockchain.</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                <WalletButton />
              </div>
            </header>
            
            {renderContent()}

            {statsError && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 rounded-md flex items-center" role="alert">
                <AlertTriangle className="h-5 w-4 mr-2" aria-hidden="true" />
                Error loading dashboard data. Please try again.
              </div>
            )}
          </div>
        </main>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}

export default function BlinkboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlinkboardPageContent />
    </QueryClientProvider>
  )
}