'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/use-toast"
import { Loader2, Plus } from 'lucide-react'

export function Crowdfunding() {
  const [campaigns, setCampaigns] = useState([
    { id: 1, title: 'Community Garden Project', goal: 5000, raised: 3500 },
    { id: 2, title: 'Local School Fundraiser', goal: 10000, raised: 7500 },
    { id: 3, title: 'Animal Shelter Support', goal: 3000, raised: 1200 },
  ])
  const { toast } = useToast()

  const handleDonate = (campaignId: number) => {
    // Here you would typically integrate with your payment system
    toast({
      title: "Donation Successful",
      description: "Thank you for your contribution!",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Active Campaigns</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <CardTitle>{campaign.title}</CardTitle>
            <CardDescription>Goal: ${campaign.goal}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Raised: ${campaign.raised}</span>
                <span>{Math.round((campaign.raised / campaign.goal) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleDonate(campaign.id)}>Donate</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}