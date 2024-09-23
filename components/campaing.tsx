'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/use-toast"
import { Loader2 } from 'lucide-react'

export function Campaign() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !goal || !endDate) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // Here you would typically send the campaign data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
      toast({
        title: "Campaign Created",
        description: "Your crowdfunding campaign has been successfully created.",
      })
      // Reset form
      setTitle('')
      setDescription('')
      setGoal('')
      setEndDate('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Campaign</CardTitle>
        <CardDescription>Start your crowdfunding campaign on the Solana blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter campaign title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your campaign"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Funding Goal (SOL)</Label>
            <Input
              id="goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter funding goal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Campaign...
              </>
            ) : (
              'Create Campaign'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}