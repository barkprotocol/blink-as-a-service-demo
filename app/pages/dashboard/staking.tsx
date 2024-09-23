'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/lib/use-toast"
import { Loader2, RefreshCw } from 'lucide-react'

interface StakingPool {
  id: string;
  name: string;
  apr: number;
  totalStaked: number;
}

interface UserStake {
  poolId: string;
  amount: number;
  rewards: number;
}

const mockPools: StakingPool[] = [
  { id: 'sol', name: 'Solana', apr: 5.2, totalStaked: 1000000 },
  { id: 'bark', name: 'BARK', apr: 4.5, totalStaked: 500000 },
  { id: 'sparky', name: 'SPARKY', apr: 8.1, totalStaked: 250000 },
]

const Staking = () => {
  const [selectedPool, setSelectedPool] = useState<string>('sol')
  const [stakeAmount, setStakeAmount] = useState<string>('')
  const [isStaking, setIsStaking] = useState<boolean>(false)
  const [userStakes, setUserStakes] = useState<UserStake[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulating API call to fetch user's stakes
    const fetchUserStakes = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUserStakes([
        { poolId: 'sol', amount: 100, rewards: 0.52 },
        { poolId: 'bark', amount: 50, rewards: 0.225 },
      ])
      setIsLoading(false)
    }
    fetchUserStakes()
  }, [])

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid stake amount.",
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)
    // Simulating staking process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsStaking(false)

    const newStake: UserStake = {
      poolId: selectedPool,
      amount: parseFloat(stakeAmount),
      rewards: 0,
    }

    setUserStakes(prevStakes => {
      const existingStakeIndex = prevStakes.findIndex(stake => stake.poolId === selectedPool)
      if (existingStakeIndex !== -1) {
        const updatedStakes = [...prevStakes]
        updatedStakes[existingStakeIndex].amount += parseFloat(stakeAmount)
        return updatedStakes
      } else {
        return [...prevStakes, newStake]
      }
    })

    setStakeAmount('')
    toast({
      title: "Staking Successful",
      description: `You have staked ${stakeAmount} tokens in the ${mockPools.find(pool => pool.id === selectedPool)?.name} pool.`,
      variant: "default",
    })
  }

  const handleRefreshRewards = async () => {
    setIsLoading(true)
    // Simulating API call to refresh rewards
    await new Promise(resolve => setTimeout(resolve, 1500))
    setUserStakes(prevStakes =>
      prevStakes.map(stake => ({
        ...stake,
        rewards: stake.rewards + (stake.amount * mockPools.find(pool => pool.id === stake.poolId)!.apr / 100 / 365),
      }))
    )
    setIsLoading(false)
    toast({
      title: "Rewards Updated",
      description: "Your staking rewards have been updated.",
      variant: "default",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Stake Your Tokens</CardTitle>
          <CardDescription>Choose a pool and stake your tokens to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="pool-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Staking Pool
            </label>
            <Select value={selectedPool} onValueChange={setSelectedPool}>
              <SelectTrigger id="pool-select">
                <SelectValue placeholder="Select a pool" />
              </SelectTrigger>
              <SelectContent>
                {mockPools.map((pool) => (
                  <SelectItem key={pool.id} value={pool.id}>
                    {pool.name} - {pool.apr}% APR
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="stake-amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Stake Amount
            </label>
            <Input
              id="stake-amount"
              type="number"
              placeholder="Enter amount to stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStake} disabled={isStaking} className="w-full">
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              'Stake Tokens'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Staking Overview</CardTitle>
          <CardDescription>View your current stakes and rewards</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool</TableHead>
                  <TableHead>Staked Amount</TableHead>
                  <TableHead>Rewards</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStakes.map((stake) => (
                  <TableRow key={stake.poolId}>
                    <TableCell>{mockPools.find(pool => pool.id === stake.poolId)?.name}</TableCell>
                    <TableCell>{stake.amount.toFixed(2)}</TableCell>
                    <TableCell>{stake.rewards.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleRefreshRewards} variant="outline" disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Rewards
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Staking