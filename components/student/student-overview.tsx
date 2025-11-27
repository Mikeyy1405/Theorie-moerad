
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Play, Trophy, Clock } from 'lucide-react'

export function StudentOverview() {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welkom terug!</h1>
        <p className="text-gray-600">Zet je studie voort en behaal je rijbewijs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mijn Voortgang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Theorie</span>
                <span className="text-sm font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Laatste Resultaat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-medium">85% behaald</p>
                <p className="text-sm text-gray-600">Oefen examen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Studietijd</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">24 uur</p>
                <p className="text-sm text-gray-600">Deze maand</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Beschikbare Cursussen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Auto Theorie</h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  Gratis
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Complete cursus voor het Nederlandse CBR auto theorie-examen
              </p>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Verder leren
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Motor Theorie</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  €34,99
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Volledige motor theorie cursus met veiligheidssituaties
              </p>
              <Button size="sm" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Bekijk cursus
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Oefen examen voltooid</p>
                  <p className="text-xs text-gray-500">Score: 85% - 2 uur geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Les voltooid: Kruispunten</p>
                  <p className="text-xs text-gray-500">1 dag geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Play className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Les gestart: Verkeersborden</p>
                  <p className="text-xs text-gray-500">2 dagen geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
