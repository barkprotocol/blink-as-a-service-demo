'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/use-toast"

export function Settings() {
  const [email, setEmail] = useState('user@example.com')
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    // Here you would typically send the updated settings to your backend
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <Label htmlFor="notifications">Enable email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="twoFactor"
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
            />
            <Label htmlFor="twoFactor">Enable two-factor authentication</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">View Login History</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Wallets</CardTitle>
          <CardDescription>Manage your connected wallets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Solana Wallet</span>
            <Button variant="outline" size="sm">Disconnect</Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Connect New Wallet</Button>
        </CardFooter>
      </Card>
    </div>
  )
}