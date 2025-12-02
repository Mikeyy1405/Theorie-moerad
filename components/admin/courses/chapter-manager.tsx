'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  GripVertical,
} from 'lucide-react'
import { Course, Chapter } from '@/types/course'
import { LessonManager } from './lesson-manager'

interface ChapterManagerProps {
  course: Course
  onBack: () => void
}

interface ChapterFormData {
  title: string
  description: string
  is_published: boolean
}

export function ChapterManager({ course, onBack }: ChapterManagerProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    description: '',
    is_published: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChapters = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/chapters?course_id=${course.id}`)
      if (response.ok) {
        const data = await response.json()
        setChapters(data)
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error)
    } finally {
      setLoading(false)
    }
  }, [course.id])

  useEffect(() => {
    fetchChapters()
  }, [fetchChapters])

  const openDialog = (chapter?: Chapter) => {
    if (chapter) {
      setEditingChapter(chapter)
      setFormData({
        title: chapter.title,
        description: chapter.description || '',
        is_published: chapter.is_published,
      })
    } else {
      setEditingChapter(null)
      setFormData({
        title: '',
        description: '',
        is_published: false,
      })
    }
    setError(null)
    setShowDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingChapter
        ? `/api/admin/chapters/${editingChapter.id}`
        : '/api/admin/chapters'

      const response = await fetch(url, {
        method: editingChapter ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: course.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      setShowDialog(false)
      fetchChapters()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit hoofdstuk wilt verwijderen? Alle lessen worden ook verwijderd.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/chapters/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchChapters()
      }
    } catch (error) {
      console.error('Failed to delete chapter:', error)
    }
  }

  const moveChapter = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= chapters.length) return

    const chapter = chapters[index]
    const targetChapter = chapters[newIndex]

    try {
      // Update both chapters with swapped order_index values
      await Promise.all([
        fetch(`/api/admin/chapters/${chapter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: chapter.title,
            description: chapter.description,
            order_index: targetChapter.order_index,
            is_published: chapter.is_published,
          }),
        }),
        fetch(`/api/admin/chapters/${targetChapter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: targetChapter.title,
            description: targetChapter.description,
            order_index: chapter.order_index,
            is_published: targetChapter.is_published,
          }),
        }),
      ])
      fetchChapters()
    } catch (error) {
      console.error('Failed to reorder chapters:', error)
    }
  }

  if (selectedChapter) {
    return (
      <LessonManager
        course={course}
        chapter={selectedChapter}
        onBack={() => setSelectedChapter(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{course.title}</h2>
          <p className="text-gray-600">Beheer hoofdstukken en lessen</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hoofdstukken ({chapters.length})</h3>
        <Button
          onClick={() => openDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nieuw Hoofdstuk
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Hoofdstukken laden...</p>
        </div>
      ) : chapters.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            Nog geen hoofdstukken. Maak je eerste hoofdstuk aan!
          </p>
          <Button
            onClick={() => openDialog()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Hoofdstuk
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    disabled={index === 0}
                    onClick={() => moveChapter(index, 'up')}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <button
                    onClick={() => setSelectedChapter(chapter)}
                    className="text-left hover:text-blue-600 font-medium flex items-center"
                  >
                    {index + 1}. {chapter.title}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                  {chapter.description && (
                    <p className="text-sm text-gray-500 mt-1">{chapter.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={chapter.is_published ? 'default' : 'secondary'}
                  className={chapter.is_published ? 'bg-green-100 text-green-800' : ''}
                >
                  {chapter.is_published ? 'Gepubliceerd' : 'Concept'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDialog(chapter)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(chapter.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingChapter ? 'Hoofdstuk Bewerken' : 'Nieuw Hoofdstuk'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-title">Titel *</Label>
              <Input
                id="chapter-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="bijv. Verkeersregels"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter-description">Beschrijving</Label>
              <Textarea
                id="chapter-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optionele beschrijving..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="chapter-published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="chapter-published">Gepubliceerd</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? 'Opslaan...' : 'Opslaan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
