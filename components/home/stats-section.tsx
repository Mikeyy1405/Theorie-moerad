
'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, BookOpen, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const stats = [
  { icon: Users, label: 'Actieve Studenten', value: 12500, suffix: '+' },
  { icon: Trophy, label: 'Geslaagde Cursisten', value: 10200, suffix: '+' },
  { icon: BookOpen, label: 'Lessen Voltooid', value: 85000, suffix: '+' },
  { icon: TrendingUp, label: 'Slaagpercentage', value: 95, suffix: '%' }
]

function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return
    
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start > end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration, hasStarted])

  const handleInView = () => {
    if (!hasStarted) {
      setHasStarted(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onViewportEnter={handleInView}
      viewport={{ once: true }}
    >
      {count.toLocaleString()}{suffix}
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section id="stats" className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Onze resultaten spreken voor zich
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Duizenden cursisten zijn je al voorgegaan. Word onderdeel van onze succesvolle gemeenschap.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-blue-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Waarom zijn onze resultaten zo goed?
            </h3>
            <p className="text-blue-100 leading-relaxed">
              Onze unieke combinatie van interactieve lessen, AI-begeleiding en bewezen lesmethoden 
              zorgt ervoor dat studenten niet alleen slagen, maar ook echt begrijpen wat ze leren.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
