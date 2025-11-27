
'use client'

import { motion } from 'framer-motion'
import { BookOpen, Brain, Trophy, Clock, Users, BarChart3, MessageCircle, Shield } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Interactieve Lessen',
    description: 'Leer met multimedia content, video\'s en interactieve oefeningen die je engagement hoog houden.'
  },
  {
    icon: Brain,
    title: 'AI-Begeleiding',
    description: '24/7 beschikbare AI-assistent die je vragen beantwoordt en gepersonaliseerde tips geeft.'
  },
  {
    icon: Trophy,
    title: 'Oefen Examens',
    description: 'Realistische examensimulaties met officiële CBR vragen om je optimaal voor te bereiden.'
  },
  {
    icon: Clock,
    title: 'Eigen Tempo',
    description: 'Leer wanneer het jou uitkomt, op elk apparaat, waar je ook bent.'
  },
  {
    icon: BarChart3,
    title: 'Voortgang Tracking',
    description: 'Gedetailleerd inzicht in je vooruitgang met visuele grafieken en statistieken.'
  },
  {
    icon: Users,
    title: 'Bewezen Methode',
    description: 'Meer dan 10.000 geslaagde cursisten bewijzen de effectiviteit van onze aanpak.'
  },
  {
    icon: MessageCircle,
    title: 'Community Support',
    description: 'Verbinding met medestudenten en ervaren instructeurs voor extra ondersteuning.'
  },
  {
    icon: Shield,
    title: 'Geld-terug Garantie',
    description: 'Niet geslaagd? Krijg je geld terug. Wij staan volledig achter onze cursussen.'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Waarom kiezen voor onze{' '}
            <span className="text-blue-600">theorie cursus</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek de functies die ons platform de beste keuze maken voor je theorie-examen voorbereiding
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
