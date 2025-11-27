
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Menu, X, Car, Bike } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    >
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            TheorieExamen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Functies
          </Link>
          <Link href="#courses" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Cursussen
          </Link>
          <Link href="#stats" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Statistieken
          </Link>
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href="/login">Inloggen</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Registreren</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-white"
        >
          <div className="container max-w-6xl mx-auto px-4 py-4 space-y-4">
            <Link 
              href="#features" 
              className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Functies
            </Link>
            <Link 
              href="#courses" 
              className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cursussen
            </Link>
            <Link 
              href="#stats" 
              className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Statistieken
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="outline" asChild>
                <Link href="/login">Inloggen</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Registreren</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
