'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  FileText,
  Video,
  HelpCircle,
  GripVertical,
} from 'lucide-react'
import { Course, Chapter, Lesson, LessonType } from '@/types/course'
import { QuizBuilder } from './quiz-builder'

interface LessonManagerProps {
  course: Course
  chapter: Chapter
  onBack: () => void
}

interface LessonFormData {
  title: string
  description: string
  content: string
  type: LessonType
  video_url: string
  is_free: boolean
  is_published: boolean
}

const lessonTypeIcons = {
  TEXT: FileText,
  VIDEO: Video,
  QUIZ: HelpCircle,
}

const lessonTypeLabels = {
  TEXT: 'Tekst',
  VIDEO: 'Video',
  QUIZ: 'Quiz',
}

export function LessonManager({ course, chapter, onBack }: LessonManagerProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [selectedQuizLesson, setSelectedQuizLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    description: '',
    content: '',
    type: 'TEXT',
    video_url: '',
    is_free: false,
    is_published: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/lessons?chapter_id=${chapter.id}`)
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    } finally {
      setLoading(false)
    }
  }, [chapter.id])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  const openDialog = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson)
      setFormData({
        title: lesson.title,
        description: lesson.description || '',
        content: lesson.content || '',
        type: lesson.type,
        video_url: lesson.video_url || '',
        is_free: lesson.is_free,
        is_published: lesson.is_published,
      })
    } else {
      setEditingLesson(null)
      setFormData({
        title: '',
        description: '',
        content: '',
        type: 'TEXT',
        video_url: '',
        is_free: false,
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
      const url = editingLesson
        ? `/api/admin/lessons/${editingLesson.id}`
        : '/api/admin/lessons'

      const response = await fetch(url, {
        method: editingLesson ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: course.id,
          chapter_id: chapter.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      setShowDialog(false)
      fetchLessons()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze les wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/lessons/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchLessons()
      }
    } catch (error) {
      console.error('Failed to delete lesson:', error)
    }
  }

  const moveLesson = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= lessons.length) return

    const lesson = lessons[index]
    const targetLesson = lessons[newIndex]

    try {
      await Promise.all([
        fetch(`/api/admin/lessons/${lesson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            type: lesson.type,
            video_url: lesson.video_url,
            is_free: lesson.is_free,
            is_published: lesson.is_published,
            order_index: targetLesson.order_index,
          }),
        }),
        fetch(`/api/admin/lessons/${targetLesson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: targetLesson.title,
            description: targetLesson.description,
            content: targetLesson.content,
            type: targetLesson.type,
            video_url: targetLesson.video_url,
            is_free: targetLesson.is_free,
            is_published: targetLesson.is_published,
            order_index: lesson.order_index,
          }),
        }),
      ])
      fetchLessons()
    } catch (error) {
      console.error('Failed to reorder lessons:', error)
    }
  }

  if (selectedQuizLesson) {
    return (
      <QuizBuilder
        lesson={selectedQuizLesson}
        onBack={() => setSelectedQuizLesson(null)}
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
          <p className="text-sm text-gray-500">{course.title}</p>
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <p className="text-gray-600">Beheer lessen in dit hoofdstuk</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lessen ({lessons.length})</h3>
        <Button
          onClick={() => openDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Les
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Lessen laden...</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            Nog geen lessen. Voeg je eerste les toe!
          </p>
          <Button
            onClick={() => openDialog()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Les
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const TypeIcon = lessonTypeIcons[lesson.type]
            return (
              <div
                key={lesson.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      disabled={index === 0}
                      onClick={() => moveLesson(index, 'up')}
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-100">
                    <TypeIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {index + 1}. {lesson.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {lessonTypeLabels[lesson.type]}
                      </Badge>
                    </div>
                    {lesson.description && (
                      <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {lesson.is_free && (
                    <Badge className="bg-purple-100 text-purple-800">Gratis</Badge>
                  )}
                  <Badge
                    variant={lesson.is_published ? 'default' : 'secondary'}
                    className={lesson.is_published ? 'bg-green-100 text-green-800' : ''}
                  >
                    {lesson.is_published ? 'Gepubliceerd' : 'Concept'}
                  </Badge>
                  {lesson.type === 'QUIZ' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuizLesson(lesson)}
                    >
                      Quiz Builder
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialog(lesson)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(lesson.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Les Bewerken' : 'Nieuwe Les'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lesson-title">Titel *</Label>
                <Input
                  id="lesson-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="bijv. Voorrangsregels"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesson-type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: LessonType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Tekst</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-description">Beschrijving</Label>
              <Textarea
                id="lesson-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Korte beschrijving van de les..."
                rows={2}
              />
            </div>

            {formData.type === 'TEXT' && (
              <div className="space-y-2">
                <Label htmlFor="lesson-content">Inhoud</Label>
                <Textarea
                  id="lesson-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="De theorie tekst..."
                  rows={6}
                />
              </div>
            )}

            {formData.type === 'VIDEO' && (
              <div className="space-y-2">
                <Label htmlFor="lesson-video">Video URL</Label>
                <Input
                  id="lesson-video"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-xs text-gray-500">
                  Gebruik een embed URL van YouTube of Vimeo
                </p>
              </div>
            )}

            {formData.type === 'QUIZ' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                <p className="text-sm">
                  Na het opslaan kun je de Quiz Builder gebruiken om vragen en antwoorden toe te voegen.
                </p>
              </div>
            )}

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="lesson-free"
                  checked={formData.is_free}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_free: checked }))}
                />
                <Label htmlFor="lesson-free">Gratis les</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="lesson-published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="lesson-published">Gepubliceerd</Label>
              </div>
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
