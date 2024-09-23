'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Home, 
  PlusCircle, 
  Image, 
  RefreshCcw, 
  Heart, 
  Users, 
  CreditCard, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navItems = [
  { name: 'Overview', icon: Home },
  { name: 'Create Blink', icon: PlusCircle },
  { name: 'NFT', icon: Image },
  { name: 'Swap', icon: RefreshCcw },
  { name: 'Donations', icon: Heart },
  { name: 'Crowdfunding', icon: Users },
  { name: 'Payments', icon: CreditCard },
  { name: 'Settings', icon: Settings },
]

export function Blinkboard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={`fixed left-0 top-0 h-full bg-gray-100 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <CardContent className="p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <div className="space-y-4">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-start ${isExpanded ? '' : 'px-2'}`}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {isExpanded && <span>{item.name}</span>}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}