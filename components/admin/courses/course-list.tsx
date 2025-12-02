'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Course } from '@/types/course'
import { CourseEditor } from './course-editor'

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze cursus wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error('Failed to delete course:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCourse(null)
    fetchCourses()
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (showForm || editingCourse) {
    return (
      <CourseEditor
        course={editingCourse}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false)
          setEditingCourse(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cursus Beheer</h2>
          <p className="text-gray-600">Beheer al je cursussen</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Cursus
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Zoek cursussen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cursussen laden...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm ? 'Geen cursussen gevonden' : 'Nog geen cursussen. Maak je eerste cursus aan!'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Prijs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category || '-'}</TableCell>
                  <TableCell>
                    {course.price ? `€${course.price.toFixed(2)}` : 'Gratis'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={course.is_active ? 'default' : 'secondary'}
                      className={course.is_active ? 'bg-green-100 text-green-800' : ''}
                    >
                      {course.is_active ? 'Gepubliceerd' : 'Concept'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCourse(course)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
