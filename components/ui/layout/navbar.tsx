'use client'

import React, { useState, useEffect, useCallback, memo, useId } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Sun, Moon, Wallet, Menu, X } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { motion, AnimatePresence } from 'framer-motion'

const blinkTexts = ['BLINK', 'NFT', 'PAYMENTS', 'DONATIONS', 'CROWDFUNDING']

const Logo = memo(() => {
  const logoSrc = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"

  return (
    <Link href="/" className="flex items-center group">
      <Image width={34} height={34} src={logoSrc} alt="BARK Blink Logo" className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
      <span className="ml-3 text-lg font-bold text-gray-800 dark:text-white flex items-center">
        <span className="text-lg">BARK</span>
      </span>
    </Link>
  )
})
Logo.displayName = 'Logo'

const BlinkText = memo(({ text }: { text: string }) => (
  <motion.span 
    key={text}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="text-[#CBB5A7] text-lg ml-2"
  >
    {text}
  </motion.span>
))
BlinkText.displayName = 'BlinkText'

const ThemeToggle = memo(() => {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [setTheme, resolvedTheme])

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button 
        onClick={toggleTheme} 
        variant="ghost" 
        size="icon" 
        className="w-10 h-10 rounded-full"
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </motion.div>
  )
})
ThemeToggle.displayName = 'ThemeToggle'

const NavLinks = memo(({ mobile = false }: { mobile?: boolean }) => {
  const linkClass = `text-sm ${mobile ? 'block py-2' : ''} text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800`

  const links = [
    { href: "/", label: "Home" },
    { href: "/pages/actions", label: "Actions" },
    { href: "/pages/services", label: "Services" },
    { href: "/#", label: "FAQ" },
    { href: "https://gitbook.com/", label: "Docs", external: true },
  ]

  return (
    <>
      {links.map((link) => (
        <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {link.external ? (
            <a href={link.href} className={linkClass} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ) : (
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          )}
        </motion.div>
      ))}
    </>
  )
})
NavLinks.displayName = 'NavLinks'

export function Navbar() {
  const [blinkText, setBlinkText] = useState('BLINK')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { connected } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const mobileMenuId = useId()

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setBlinkText(prevText => {
        const currentIndex = blinkTexts.indexOf(prevText)
        return blinkTexts[(currentIndex + 1) % blinkTexts.length]
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen, handleKeyDown])

  if (!mounted) {
    return null
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-20 transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-2">
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
            <BlinkText text={blinkText} />
          </motion.div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
            <WalletMultiButton 
              className="!bg-black !text-white hover:!bg-gray-800 !rounded-md !px-4 !py-1.5 !text-xs !font-medium !transition-all !duration-300 !flex !items-center !justify-center !h-8 !shadow-md hover:!shadow-lg"
              aria-label={connected ? 'Wallet connected' : 'Select wallet'}
            >
              <Wallet className="mr-1.5 h-3.5 w-3.5" />
              <span>{connected ? 'Connected' : 'Select Wallet'}</span>
            </WalletMultiButton>
            <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={toggleMenu} 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 !p-2" 
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls={mobileMenuId}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id={mobileMenuId}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLinks mobile />
            </div>
            <div className="px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
              <WalletMultiButton 
                className="!bg-black !text-white hover:!bg-gray-800 !rounded-md !px-3 !py-1.5 !text-xs !font-medium !transition-all !duration-300 !flex !items-center !justify-center !h-8 !shadow-md hover:!shadow-lg"
                aria-label={connected ? 'Wallet connected' : 'Select wallet'}
              >
                <Wallet className="mr-1.5 h-3.5 w-3.5" />
                <span>{connected ? 'Connected' : 'Select Wallet'}</span>
              </WalletMultiButton>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}