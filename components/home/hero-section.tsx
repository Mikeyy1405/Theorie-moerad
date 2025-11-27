
'use client'

import { Button } from '@/components/ui/button'
import { BookOpen, Star, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">Meer dan 10.000 geslaagde cursisten</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Slaag voor je{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                theorie-examen
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Complete online theorie cursussen voor auto en motor rijbewijs. 
              Met interactieve lessen, praktijkvragen en AI-begeleiding behaal je gegarandeerd je rijbewijs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start gratis proefles
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#courses">
                  Bekijk cursussen
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>10,000+ studenten</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>95% slaagkans</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-green-600/10 rounded-3xl"></div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">Interactief Leren</h3>
                    <p className="text-gray-600">Met AI-ondersteuning en realtime feedback</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">500+</div>
                      <div className="text-xs text-gray-500">Vragen</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">24/7</div>
                      <div className="text-xs text-gray-500">Toegang</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">AI</div>
                      <div className="text-xs text-gray-500">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
