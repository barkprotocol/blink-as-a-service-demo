'use client'

import React, { useState, useCallback, memo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Zap, Shield, Coins, Code, Layers, Cpu, Repeat, Users, CreditCard, BarChart, LockIcon, Sparkles, ArrowRight, BookOpen, Heart, Globe, Handshake, ShoppingBag, PlusSquare } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Footer } from '@/components/ui/layout/footer'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'

const featureList = [
  { icon: Zap, title: "Instant Blink Execution", description: "Execute Solana Blinks with sub-second finality, leveraging Solana's high-speed consensus." },
  { icon: Shield, title: "Secure Action Composition", description: "Compose multiple Solana actions securely within a single atomic transaction." },
  { icon: Coins, title: "Token-Agnostic Blinks", description: "Create and execute Blinks that work seamlessly with any SPL token on Solana." },
  { icon: Code, title: "Blink SDK Integration", description: "Easily integrate pre-built Blinks or create custom ones using our comprehensive SDK." },
  { icon: Layers, title: "Cross-Program Invocations", description: "Leverage Solana's unique ability to compose multiple program calls in a single Blink." },
  { icon: Cpu, title: "Parallel Transaction Processing", description: "Utilize Solana's parallel transaction processing for high-throughput Blink execution." },
]

const solanaActions = [
  { icon: Repeat, name: 'Atomic Swaps', description: 'Execute complex token swaps across multiple Solana DEXes in a single atomic Blink.' },
  { icon: Users, name: 'Streaming Payments', description: 'Implement continuous, real-time payment streams using Solana\'s high-frequency block production.' },
  { icon: Heart, name: 'Donations', description: 'Enable instant, low-fee donations with automatic splitting and transparent on-chain tracking.' },
  { icon: BarChart, name: 'Crowdfunding', description: 'Launch decentralized crowdfunding campaigns with built-in milestones and automatic fund distribution.' },
  { icon: LockIcon, name: 'Liquid Staking', description: 'Create liquid staking derivatives with instant unstaking capabilities via Blink actions.' },
  { icon: Globe, name: 'Social Finance', description: 'Implement social tokens, decentralized reputation systems, and community-driven fund allocation.' },
  { icon: PlusSquare, name: 'Create NFT', description: 'Easily mint NFTs directly on Solana with automated metadata creation, storage, and transfer management.' },
  { icon: ShoppingBag, name: 'Commerce', description: 'Facilitate on-chain purchases, subscriptions, and e-commerce with automatic payment settlement and invoicing.' },
  { icon: Sparkles, name: 'Custom Blinks', description: 'Compose complex, multi-step DeFi strategies into single-transaction Blinks.' },
]

const faqItems = [
  { question: "What are BARK Blinks?", answer: "BARK Blinks are advanced implementations of Solana Blinks, which are pre-composed, optimized smart contract interactions that leverage Solana's unique architecture. They allow developers to create efficient, multi-step transactions that execute instantly and atomically." },
  { question: "How do Blinks enhance DeFi and Social Finance on Solana?", answer: "Blinks significantly reduce latency and improve capital efficiency in DeFi and Social Finance applications. By combining multiple actions into a single atomic transaction, Blinks eliminate intermediary states, reduce failure points, and enable more complex financial and social operations, such as instant multi-party settlements or community-driven fund allocations." },
  { question: "Can I create custom Blinks for my specific use case?", answer: "Yes, our SDK allows you to compose custom Blinks by chaining multiple Solana program interactions. This enables you to create complex, application-specific logic that executes atomically, leveraging Solana's fast finality and parallel processing capabilities. Whether you're building a new DeFi protocol, a social finance application, or a novel crowdfunding platform, custom Blinks can help you optimize your operations." },
  { question: "How does BARK Protocol's crowdfunding functionality work?", answer: "Our crowdfunding Blink utilizes Solana's programmable accounts and fast finality to create a seamless experience. It allows campaign creators to set up milestones, automatically tracks contributions, and can instantly distribute funds when milestones are met. All of this happens on-chain, ensuring transparency and reducing counterparty risk." },
  { question: "What makes Solana ideal for Social Finance applications?", answer: "Solana's high throughput, low fees, and sub-second finality make it perfect for Social Finance applications. These features enable real-time social interactions tied to financial actions, such as instant tipping, social token trading, or community voting on fund allocations. BARK Blinks further enhance these capabilities by allowing complex social and financial logic to be executed atomically." },
  { question: "How can I optimize my Solana program to work well with Blinks?", answer: "To optimize for Blinks, design your Solana programs with composability in mind. Use clear, modular instruction interfaces, leverage Solana's account model for efficient state management, and consider parallelization opportunities in your program logic. Also, think about how your program can be combined with other protocols in a single transaction to create powerful, atomic operations." },
]

const FeatureCard = memo(({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
          <feature.icon className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">{feature.description}</p>
      </CardContent>
    </Card>
  </motion.div>
))

FeatureCard.displayName = 'FeatureCard'

const SolanaActionCard = memo(({ action, index, onActionClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    onClick={() => onActionClick(action.name)}
  >
    <div className="flex items-center mb-4">
      <action.icon className="h-6 w-6 text-primary mr-2" aria-hidden="true" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{action.name}</h3>
    </div>
    <p className="text-base text-gray-500 dark:text-gray-400">{action.description}</p>
  </motion.div>
))

SolanaActionCard.displayName = 'SolanaActionCard'

export default function BARKProtocolLanding() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const wallet = useWallet()
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    const conn = new Connection('https://api.mainnet-beta.solana.com')
    setConnection(conn)
  }, [])

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email) {
      toast.error('Please enter a valid email address.')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_MAILCHIMP_URL}`, {
        email_address: email,
        status: 'subscribed',
      }, {
        headers: {
          'Authorization': `apikey ${process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        toast.success('Thank you for subscribing!')
        setEmail('')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Subscription failed. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }, [email])

  const handleSolanaAction = useCallback(async (actionName: string) => {
    if (!wallet.connected) {
      toast.error('Please connect your Solana wallet first.')
      return
    }

    if (!connection || !wallet.publicKey) {
      toast.error('Solana connection not established.')
      return
    }

    try {
      switch (actionName) {
        case 'Atomic Swaps':
          await simulateAtomicSwap(connection, wallet.publicKey)
          break
        case 'Streaming Payments':
          await simulateStreamingPayment(connection, wallet.publicKey)
          break
        case 'Donations':
          await simulateDonation(connection, wallet.publicKey)
          break
        case 'Crowdfunding':
          await simulateCrowdfunding(connection, wallet.publicKey)
          break
        case 'Liquid Staking':
          await simulateLiquidStaking(connection, wallet.publicKey)
          break
        case 'Social Finance':
          await simulateSocialFinance(connection, wallet.publicKey)
          break
        case 'Create NFT':
          await simulateCreateNFT(connection, wallet.publicKey)
          break
        case 'Commerce':
          await simulateCommerce(connection, wallet.publicKey)
          break
        case 'Custom Blinks':
          await simulateCustomBlink(connection, wallet.publicKey)
          break
        default:
          toast.error('Unknown action')
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [wallet, connection])

  const simulateAtomicSwap = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Simulating Atomic Swap Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Atomic Swap Blink executed successfully! Swapped tokens across multiple DEXes in a single transaction, ensuring optimal pricing.')
  }

  const simulateStreamingPayment = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Initiating Streaming Payment Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Streaming Payment Blink activated! Payment stream will continue at 1 token per second until stopped or funds are depleted.')
  }

  const simulateDonation = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Processing Donation Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Donation Blink completed! Funds instantly split among multiple recipients with on-chain tracking.')
  }

  const simulateCrowdfunding = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Launching Crowdfunding Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Crowdfunding Blink initiated! Campaign created with 3 milestones, automatic fund distribution, and real-time progress tracking.')
  }

  const simulateLiquidStaking = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Initiating Liquid Staking Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Liquid Staking Blink completed! Received liquid staking derivatives with instant unstaking capability.')
  }

  const simulateSocialFinance = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Activating Social Finance Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Social Finance Blink executed! Created a social token with built-in reputation system and community governance features.')
  }

  const simulateCreateNFT = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Creating NFT Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('NFT Blink executed! Created a new NFT with metadata stored on-chain and automatic royalty distribution.')
  }

  const simulateCommerce = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Processing Commerce Blink...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Commerce Blink completed! Purchase processed with instant settlement and automatic invoice generation.')
  }

  const simulateCustomBlink = async (connection: Connection, publicKey: PublicKey) => {
    toast.info('Executing Custom Multi-step Blink...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    toast.success('Custom Blink executed successfully! Completed a complex DeFi strategy involving swaps, staking, and yield farming in a single atomic transaction.')
  }

  return (
    <div className="min-h-screen bg-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      <main id="main-content">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative pt-20 pb-32 text-center"
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-block bg-primary text-primary-foreground text-sm font-semibold rounded-full px-4 py-1.5 shadow-lg">
                Revolutionizing DeFi, Social Finance, and Web3 Commerce with Solana Blinks
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
            >
              Unleash the Power of Solana
              <span className="block text-primary mt-2">With BARK BLINKS</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
            >
              BARK Blinks enable developers to create lightning-fast, atomic actions on Solana. Leverage the full potential of Solana's architecture for DeFi, Social Finance, NFTs, and Web3 Commerce with our innovative Blink-As-A-Service platform.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Button className="w-full sm:w-auto text-lg px-8 py-5 rounded-md shadow-lg transition-transform hover:scale-105">
                <Link href="/pages/dashboard" className="flex items-center">
                  Launch Blinkboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-5 rounded-md shadow-lg transition-transform hover:scale-105">
                <Link href="/components/create-blink" className="flex items-center">
                  Create Custom Blink
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-16 flex flex-col items-center"
            >
              <Image 
                src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
                alt="BARK Protocol Logo"
                width={80}
                height={70}
                className="h-16 w-16 mb-4"
              />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Powered by BARK Protocol</span>
            </motion.div>
          </div>
        </motion.section>

        <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureList.map((feature, index) => (
                <FeatureCard feature={feature} key={index} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Explore Solana Blinks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {solanaActions.map((action, index) => (
                <SolanaActionCard action={action} key={index} index={index} onActionClick={handleSolanaAction} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">FAQ</h2>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">Subscribe to Newsletter</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 text-center mb-8">
              Stay updated with the latest Solana Blinks, DeFi innovations, and Web3 updates from BARK Protocol.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col items-center">
              <div className="flex w-full max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow rounded-r-none"
                  required
                />
                <Button type="submit" className="rounded-l-none" disabled={loading}>
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}