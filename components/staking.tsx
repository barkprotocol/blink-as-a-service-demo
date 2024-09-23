'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/use-toast"
import { Loader2 } from 'lucide-react'

export function Staking() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const { toast } = useToast()

  const handleStake = async () => {
    if (!stakeAmount || isNaN(Number(stakeAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount.",
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)
    try {
      // Simulating a staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Staking Successful",
        description: `You have successfully staked ${stakeAmount} BARK tokens.`,
      })
      setStakeAmount('')
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "An error occurred while staking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async () => {
    if (!unstakeAmount || isNaN(Number(unstakeAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid unstaking amount.",
        variant: "destructive",
      })
      return
    }

    setIsUnstaking(true)
    try {
      // Simulating an unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Unstaking Successful",
        description: `You have successfully unstaked ${unstakeAmount} BARK tokens.`,
      })
      setUnstakeAmount('')
    } catch (error) {
      toast({
        title: "Unstaking Failed",
        description: "An error occurred while unstaking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnstaking(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stake BARK Tokens</CardTitle>
          <CardDescription>Stake your BARK tokens to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="stake-amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Amount to Stake
              </label>
              <Input
                id="stake-amount"
                type="number"
                placeholder="Enter amount to stake"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance: 1000 BARK</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleStake} disabled={isStaking}>
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              'Stake'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unstake BARK Tokens</CardTitle>
          <CardDescription>Withdraw your staked BARK tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="unstake-amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Amount to Unstake
              </label>
              <Input
                id="unstake-amount"
                type="number"
                placeholder="Enter amount to unstake"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Staked Balance: 500 BARK</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleUnstake} disabled={isUnstaking}>
            {isUnstaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unstaking...
              </>
            ) : (
              'Unstake'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staking Rewards</CardTitle>
          <CardDescription>View your current staking rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">Total Staked: 500 BARK</p>
            <p className="text-sm">Current APY: 5%</p>
            <p className="text-sm">Rewards Earned: 25 BARK</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Claim Rewards</Button>
        </CardFooter>
      </Card>
    </div>
  )
}