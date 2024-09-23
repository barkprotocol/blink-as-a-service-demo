'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JupiterSwap } from '../../../components/jupiter-swap'

export function Swap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Exchange your tokens quickly and easily using Jupiter</CardDescription>
      </CardHeader>
      <CardContent>
        <JupiterSwap />
      </CardContent>
    </Card>
  )
}