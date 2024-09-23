'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Users, CreditCard, Repeat, LockIcon, Image as ImageIcon, ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

const actions = [
  {
    icon: Gift,
    title: 'Instant Donations',
    description: 'Enable seamless, low-fee donations on Solana. Perfect for non-profits and fundraising campaigns.',
    link: '/pages/donations/',
    category: 'Finance'
  },
  {
    icon: Users,
    title: 'Decentralized Crowdfunding',
    description: 'Launch and manage crowdfunding campaigns with transparent tracking on the Solana blockchain.',
    link: '/crowdfunding',
    category: 'Finance'
  },
  {
    icon: CreditCard,
    title: 'Micro-Payments',
    description: 'Implement fast, cost-effective micro-payment systems for content monetization and more.',
    link: '/micropayments',
    category: 'Finance'
  },
  {
    icon: Repeat,
    title: 'Token Swaps',
    description: 'Create decentralized token swap functionality with optimal routing and minimal slippage on Solana.',
    link: '/token-swaps',
    category: 'Trading'
  },
  {
    icon: LockIcon,
    title: 'Staking',
    description: 'Build efficient staking protocols leveraging Solana\'s high-speed, low-cost infrastructure.',
    link: '/pages/staking',
    category: 'Finance'
  },
  {
    icon: ImageIcon,
    title: 'Compressed NFTs',
    description: 'Create and manage compressed NFTs on Solana, enabling scalable and cost-effective NFT projects.',
    link: '/pages/compressed-nfts',
    category: 'NFT'
  }
]

const ActionCard = ({ action, index }: { action: typeof actions[0], index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-gray-800 border-none transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center space-x-3 text-gray-800 dark:text-white">
            <div className="p-2 rounded-full bg-[#CBB5A7]/10">
              <action.icon className="h-6 w-6 text-[#CBB5A7]" aria-hidden="true" />
            </div>
            <span className="font-bold text-lg">{action.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between p-6 pt-0">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{action.description}</p>
          <div>
            <span className="inline-block bg-[#CBB5A7]/10 text-[#CBB5A7] text-xs px-3 py-1 rounded-full mb-4 font-semibold">
              {action.category}
            </span>
            <Button asChild variant="default" className="w-full bg-[#CBB5A7] hover:bg-[#CBB5A7]/90 text-white transition-all duration-300">
              <Link href={action.link}>
                Learn More <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ActionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('asc')

  const categories = ['All', ...new Set(actions.map(action => action.category))]

  const filteredAndSortedActions = actions
    .filter(action =>
      (selectedCategory === 'All' || action.category === selectedCategory) &&
      (action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       action.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title)
      } else {
        return b.title.localeCompare(a.title)
      }
    })

  useEffect(() => {
    console.log('Filtered actions:', filteredAndSortedActions.length)
  }, [filteredAndSortedActions.length])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6 text-gray-800 dark:text-white">
            BARK Blink Actions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Explore the powerful actions you can perform with BARK Blink on the Solana blockchain. 
            Each action is designed to streamline your blockchain interactions and enhance your dApp development.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#CBB5A7] focus:ring focus:ring-[#CBB5A7]/50 transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-[#CBB5A7] focus:ring focus:ring-[#CBB5A7]/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full md:w-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-[#CBB5A7] hover:text-white dark:hover:bg-[#CBB5A7] dark:hover:text-white transition-all duration-300"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>
          </div>
        </motion.div>
        <AnimatePresence>
          {filteredAndSortedActions.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-600 dark:text-gray-300 mt-8"
            >
              No actions found. Try a different search term or category.
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredAndSortedActions.map((action, index) => (
                <ActionCard key={action.title} action={action} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}