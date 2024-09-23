'use client'

import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Transaction {
  signature: string
  slot: number
  err: any
  memo: string | null
  blockTime: number | null
  type: string
  amount: number
}

export function TransactionHistory() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    if (publicKey) {
      fetchTransactions()
    }
  }, [publicKey, connection, filter, page])

  const fetchTransactions = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 50 })
      const txs = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getTransaction(sig.signature)
          return {
            signature: sig.signature,
            slot: sig.slot,
            err: sig.err,
            memo: sig.memo,
            blockTime: sig.blockTime,
            type: getTransactionType(tx),
            amount: getTransactionAmount(tx),
          }
        })
      )

      let filteredTxs = txs
      if (filter !== 'all') {
        filteredTxs = txs.filter(tx => tx.type === filter)
      }

      if (searchQuery) {
        filteredTxs = filteredTxs.filter(tx => 
          tx.signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tx.memo && tx.memo.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }

      setTotalPages(Math.ceil(filteredTxs.length / ITEMS_PER_PAGE))
      setTransactions(filteredTxs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getTransactionType = (tx: any) => {
    // This is a simplified version. In a real application, you'd need to analyze the transaction instructions
    if (tx.meta?.innerInstructions?.some((ix: any) => ix.instructions.some((innerIx: any) => innerIx.program === 'spl-token'))) {
      return 'token'
    }
    return 'sol'
  }

  const getTransactionAmount = (tx: any) => {
    // This is a simplified version. In a real application, you'd need to analyze the transaction instructions
    return tx.meta?.postBalances[0] - tx.meta?.preBalances[0]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Recent transactions for your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="sol">SOL Transfers</SelectItem>
              <SelectItem value="token">Token Transfers</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search transactions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <ScrollArea className="h-[300px]">
            {transactions.map((tx) => (
              <div key={tx.signature} className="mb-4 p-2 border-b">
                <p className="text-sm font-medium">Signature: {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}</p>
                <p className="text-xs text-gray-500">Date: {formatDate(tx.blockTime)}</p>
                <p className="text-xs text-gray-500">Type: {tx.type}</p>
                <p className="text-xs text-gray-500">Amount: {tx.amount / 1e9} SOL</p>
                <p className="text-xs text-gray-500">Status: {tx.err ? 'Failed' : 'Success'}</p>
                {tx.memo && <p className="text-xs text-gray-500">Memo: {tx.memo}</p>}
              </div>
            ))}
          </ScrollArea>
        )}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}