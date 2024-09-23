'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/lib/use-toast"
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  description: string
  goal: number
  raised: number
}

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [newCampaign, setNewCampaign] = useState({ name: '', description: '', goal: 0 })
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const { toast } = useToast()

  const handleCreateCampaign = () => {
    const campaign: Campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      raised: 0
    }
    setCampaigns([...campaigns, campaign])
    setNewCampaign({ name: '', description: '', goal: 0 })
    toast({
      title: "Campaign Created",
      description: `${campaign.name} has been created successfully.`
    })
  }

  const handleUpdateCampaign = () => {
    if (editingCampaign) {
      setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? editingCampaign : c))
      setEditingCampaign(null)
      toast({
        title: "Campaign Updated",
        description: `${editingCampaign.name} has been updated successfully.`
      })
    }
  }

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id))
    toast({
      title: "Campaign Deleted",
      description: "The campaign has been deleted successfully.",
      variant: "destructive"
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Manager</CardTitle>
        <CardDescription>Create and manage your fundraising campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <Plus className="mr-2 h-4 w-4" /> Create New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Fill in the details for your new campaign.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="goal" className="text-right">Goal ($)</Label>
                <Input
                  id="goal"
                  type="number"
                  value={newCampaign.goal}
                  onChange={(e) => setNewCampaign({ ...newCampaign, goal: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Goal: ${campaign.goal.toLocaleString()}</p>
                <p>Raised: ${campaign.raised.toLocaleString()}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div 
                    className="bg-[#CBB5A7] h-2.5 rounded-full" 
                    style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingCampaign(campaign)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteCampaign(campaign.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      {editingCampaign && (
        <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
              <DialogDescription>Update the details of your campaign.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCampaign.description}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-goal" className="text-right">Goal ($)</Label>
                <Input
                  id="edit-goal"
                  type="number"
                  value={editingCampaign.goal}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, goal: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateCampaign}>Update Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}