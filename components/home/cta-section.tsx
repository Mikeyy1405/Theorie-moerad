
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  'Drie gratis proeflessen',
  'Onbeperkte toegang tot AI-begeleiding',
  'Geld-terug garantie bij niet slagen',
  'Mobiele app voor onderweg leren'
]

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-12 flex items-center"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Klaar om te beginnen met je{' '}
                  <span className="text-blue-600">theorie-examen</span>?
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Start vandaag nog met je gratis proeflessen en ontdek waarom duizenden cursisten 
                  kiezen voor onze platform. Geen verplichtingen, gewoon meteen beginnen!
                </p>

                <div className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8 py-6" asChild>
                    <Link href="/signup">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Start gratis proeflessen
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                    <Link href="/login">
                      Al een account? Inloggen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-green-600 p-12 flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <BookOpen className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Meer dan 95% slaagt!</h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Onze bewezen methode heeft al duizenden mensen geholpen hun rijbewijs te behalen. 
                  Jij bent de volgende!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
