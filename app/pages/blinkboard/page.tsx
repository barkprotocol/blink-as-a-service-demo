'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { BarChart, Bell, DollarSign, Users, Plus, ArrowRight, Search, Moon, Sun, Image, CreditCard, Users as UsersIcon, RefreshCcw, Layers, Heart } from 'lucide-react'
import { useTheme } from "next-themes"
import { addDays, format } from "date-fns"

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <BarChart className="h-5 w-5" />, href: '/blinkboard' },
    { name: 'NFT', icon: <Image className="h-5 w-5" />, href: '/nft' },
    { name: 'Payments', icon: <CreditCard className="h-5 w-5" />, href: '/payments' },
    { name: 'Crowdfunding', icon: <UsersIcon className="h-5 w-5" />, href: '/crowdfunding' },
    { name: 'Swap', icon: <RefreshCcw className="h-5 w-5" />, href: '/swap' },
    { name: 'Staking', icon: <Layers className="h-5 w-5" />, href: '/staking' },
    { name: 'Donation', icon: <Heart className="h-5 w-5" />, href: '/donation' },
  ]

  return (
    <div className="flex flex-col h-screen p-3 bg-white shadow w-60">
      <div className="space-y-3">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">BARK Blink</h2>
        </div>
        <div className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {navItems.map((item, index) => (
              <li key={index} className="rounded-sm">
                <a
                  href={item.href}
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-100"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function BlinkboardPage() {
  const { setTheme, theme } = useTheme()
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = [
    { title: "Total Donations", value: "$12,345", icon: <DollarSign className="h-4 w-4" /> },
    { title: "Active Campaigns", value: "8", icon: <BarChart className="h-4 w-4" /> },
    { title: "Total Supporters", value: "1,234", icon: <Users className="h-4 w-4" /> },
  ]

  const recentActivity = [
    { user: "Alice", action: "donated $50 to Animal Shelter", time: "2 hours ago" },
    { user: "Bob", action: "created a new campaign", time: "5 hours ago" },
    { user: "Charlie", action: "reached 80% of campaign goal", time: "1 day ago" },
  ]

  const campaigns = [
    { name: "Animal Shelter", progress: 75, goal: 10000, raised: 7500 },
    { name: "Tree Planting", progress: 50, goal: 5000, raised: 2500 },
    { name: "Clean Water", progress: 30, goal: 20000, raised: 6000 },
  ]

  const supporters = [
    { name: 'Alice', campaignsSupported: 5, totalDonation: 1000 },
    { name: 'Bob', campaignsSupported: 4, totalDonation: 800 },
    { name: 'Charlie', campaignsSupported: 3, totalDonation: 600 },
    { name: 'David', campaignsSupported: 2, totalDonation: 400 },
    { name: 'Eve', campaignsSupported: 1, totalDonation: 200 },
  ]

  const filteredSupporters = supporters.filter(supporter =>
    supporter.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // If the API call is successful, you would update the state here
      setIsLoading(false)
    } catch (err) {
      setError("Failed to refresh data. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Blinkboard</h1>
            <div className="flex items-center space-x-4">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <Label htmlFor="dark-mode" className="sr-only">
                  Dark Mode
                </Label>
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
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
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Progress</CardTitle>
                <CardDescription>Track your active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{campaign.name}</span>
                        <span className="text-sm font-medium">{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>${campaign.raised.toLocaleString()} raised</span>
                        <span>Goal: ${campaign.goal.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={activity.user} />
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your campaigns and donations</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Create New Campaign
                </Button>
                <Button variant="outline" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" /> View Donations
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" /> Manage Supporters
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="donations">Donations</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4">
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="text-sm">New donation received for Animal Shelter</span>
                    </div>
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="text-sm">Tree Planting campaign reached 50% of goal</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="donations" className="space-y-4">
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="text-sm">New donation received for Animal Shelter</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="campaigns" className="space-y-4">
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="text-sm">Tree Planting campaign reached 50% of goal</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Supporters</CardTitle>
                  <CardDescription>Recognize your most active donors</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search supporters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSupporters.map((supporter, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>{supporter.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{supporter.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {`${supporter.campaignsSupported} campaigns supported`}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{`$${supporter.totalDonation.toFixed(2)}`}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between items-center">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button>
              View All Analytics <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}