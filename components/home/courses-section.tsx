
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Car, Bike, Clock, BookOpen, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const courses = [
  {
    id: 'auto-theorie',
    title: 'Auto Theorie',
    description: 'Complete auto theorie cursus voor het Nederlandse CBR examen. Leer alle verkeersregels, verkeersborden en situaties.',
    price: '€29,99',
    originalPrice: '€49,99',
    image: 'https://static.abacusaicdn.net/images/bc404062-2e20-4aab-9424-e310cf0a1a49.png',
    icon: Car,
    lessons: 5,
    freeLessons: 3,
    questions: 200,
    rating: 4.8,
    students: 5420,
    features: ['3 gratis proeflessen', '200+ CBR vragen', 'Video uitleg', 'AI begeleiding']
  },
  {
    id: 'motor-theorie',
    title: 'Motor Theorie',
    description: 'Volledige motor theorie cursus voor het Nederlandse CBR motorrijbewijs. Inclusief specifieke motorregels en veiligheidssituaties.',
    price: '€34,99',
    originalPrice: '€59,99',
    image: 'https://static.abacusaicdn.net/images/ddbee4d9-054b-4565-a844-7104c465ef1d.png',
    icon: Bike,
    lessons: 4,
    freeLessons: 3,
    questions: 150,
    rating: 4.9,
    students: 2180,
    features: ['3 gratis proeflessen', '150+ motor vragen', 'Veiligheid focus', 'Praktijk tips']
  }
]

export function CoursesSection() {
  return (
    <section id="courses" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Onze <span className="text-blue-600">theorie cursussen</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kies de cursus die bij jouw rijbewijs past. Alle cursussen bevatten gratis proeflessen en AI-begeleiding.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-video">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-green-700">
                    {course.freeLessons} gratis lessen
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                    <course.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {course.description}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <BookOpen className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">{course.lessons} lessen</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <Clock className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">{course.questions} vragen</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <Star className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">{course.students} studenten</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                    <span className="text-sm text-gray-500 line-through">{course.originalPrice}</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    40% korting
                  </Badge>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/signup">
                    Start gratis proefles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
