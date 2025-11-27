
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Trophy, TrendingUp } from 'lucide-react'

const stats = [
  {
    title: 'Totaal Studenten',
    value: '2,543',
    change: '+12%',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Actieve Cursussen',
    value: '2',
    change: '+0%',
    icon: BookOpen,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    title: 'Geslaagde Studenten',
    value: '2,341',
    change: '+8%',
    icon: Trophy,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    title: 'Maandelijkse Inkomsten',
    value: '€45,230',
    change: '+23%',
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  }
]

export function AdminStats() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overzicht van je theorie-examen platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 ${stat.bg} rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-green-600">
                {stat.change} van vorige maand
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nieuwe student geregistreerd</p>
                  <p className="text-xs text-gray-500">2 minuten geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Student geslaagd voor Auto Theorie</p>
                  <p className="text-xs text-gray-500">5 minuten geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Les voltooid: Verkeersregels</p>
                  <p className="text-xs text-gray-500">10 minuten geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Populaire Cursussen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    🚗
                  </div>
                  <span className="font-medium">Auto Theorie</span>
                </div>
                <span className="text-sm text-gray-600">1,823 studenten</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    🏍️
                  </div>
                  <span className="font-medium">Motor Theorie</span>
                </div>
                <span className="text-sm text-gray-600">720 studenten</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
