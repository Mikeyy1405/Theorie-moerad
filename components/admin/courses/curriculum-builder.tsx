'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Loader2,
  FileText,
  Video,
  HelpCircle,
} from 'lucide-react'
import { Course, Chapter, Lesson } from '@/types/course'

interface CurriculumBuilderProps {
  course: Course
}

interface ChapterFormData {
  title: string
  description: string
  is_published: boolean
}

interface GeneratedChapter {
  title: string
  description: string
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

export function CurriculumBuilder({ course }: CurriculumBuilderProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [lessonsMap, setLessonsMap] = useState<Record<string, Lesson[]>>({})
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  
  // Chapter dialog state
  const [showChapterDialog, setShowChapterDialog] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [chapterFormData, setChapterFormData] = useState<ChapterFormData>({
    title: '',
    description: '',
    is_published: false,
  })
  const [savingChapter, setSavingChapter] = useState(false)
  
  // AI dialog state
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAIPrompt] = useState('')
  const [generatingAI, setGeneratingAI] = useState(false)
  const [generatedChapters, setGeneratedChapters] = useState<GeneratedChapter[]>([])
  const [savingGeneratedChapters, setSavingGeneratedChapters] = useState(false)
  
  const [error, setError] = useState<string | null>(null)

  const fetchChapters = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/chapters?course_id=${course.id}`)
      if (response.ok) {
        const data = await response.json()
        setChapters(data)
        // Fetch lessons for each chapter
        for (const chapter of data) {
          fetchLessonsForChapter(chapter.id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error)
    } finally {
      setLoading(false)
    }
  }, [course.id])

  const fetchLessonsForChapter = async (chapterId: string) => {
    try {
      const response = await fetch(`/api/admin/lessons?chapter_id=${chapterId}`)
      if (response.ok) {
        const lessons = await response.json()
        setLessonsMap(prev => ({ ...prev, [chapterId]: lessons }))
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    }
  }

  useEffect(() => {
    fetchChapters()
  }, [fetchChapters])

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  // Chapter handlers
  const openChapterDialog = (chapter?: Chapter) => {
    if (chapter) {
      setEditingChapter(chapter)
      setChapterFormData({
        title: chapter.title,
        description: chapter.description || '',
        is_published: chapter.is_published,
      })
    } else {
      setEditingChapter(null)
      setChapterFormData({
        title: '',
        description: '',
        is_published: false,
      })
    }
    setError(null)
    setShowChapterDialog(true)
  }

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingChapter(true)
    setError(null)

    try {
      const url = editingChapter
        ? `/api/admin/chapters/${editingChapter.id}`
        : '/api/admin/chapters'

      const response = await fetch(url, {
        method: editingChapter ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...chapterFormData,
          course_id: course.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      setShowChapterDialog(false)
      fetchChapters()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSavingChapter(false)
    }
  }

  const handleDeleteChapter = async (id: string) => {
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

  // AI generation handlers
  const openAIDialog = () => {
    setAIPrompt('')
    setGeneratedChapters([])
    setError(null)
    setShowAIDialog(true)
  }

  const handleGenerateCurriculum = async () => {
    if (!aiPrompt.trim()) return

    setGeneratingAI(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/ai/generate-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          courseTitle: course.title,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      const data = await response.json()
      setGeneratedChapters(data.chapters || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleSaveGeneratedChapters = async () => {
    if (generatedChapters.length === 0) return

    setSavingGeneratedChapters(true)
    setError(null)

    try {
      // Create chapters one by one
      for (const chapter of generatedChapters) {
        const response = await fetch('/api/admin/chapters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: course.id,
            title: chapter.title,
            description: chapter.description,
            is_published: false,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Er is een fout opgetreden')
        }
      }

      setShowAIDialog(false)
      fetchChapters()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSavingGeneratedChapters(false)
    }
  }

  const updateGeneratedChapter = (index: number, field: keyof GeneratedChapter, value: string) => {
    setGeneratedChapters(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeGeneratedChapter = (index: number) => {
    setGeneratedChapters(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Curriculum</h3>
          <p className="text-sm text-gray-500">{chapters.length} hoofdstukken</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={openAIDialog}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Genereer met AI
          </Button>
          <Button
            onClick={() => openChapterDialog()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Hoofdstuk
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-500 mt-2">Hoofdstukken laden...</p>
        </div>
      ) : chapters.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">
            Nog geen hoofdstukken. Start met het bouwen van je curriculum!
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={openAIDialog}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Genereer met AI
            </Button>
            <Button
              onClick={() => openChapterDialog()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nieuw Hoofdstuk
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter, index) => {
            const isExpanded = expandedChapters.has(chapter.id)
            const chapterLessons = lessonsMap[chapter.id] || []
            
            return (
              <div
                key={chapter.id}
                className="bg-white rounded-lg shadow border"
              >
                {/* Chapter header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={index === 0}
                        onClick={() => moveChapter(index, 'up')}
                      >
                        ▲
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={index === chapters.length - 1}
                        onClick={() => moveChapter(index, 'down')}
                      >
                        ▼
                      </Button>
                    </div>
                    <button
                      onClick={() => toggleChapterExpand(chapter.id)}
                      className="flex items-center gap-2 text-left hover:text-blue-600"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div>
                        <div className="font-medium">
                          {index + 1}. {chapter.title}
                        </div>
                        {chapter.description && (
                          <p className="text-sm text-gray-500">{chapter.description}</p>
                        )}
                      </div>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {chapterLessons.length} lessen
                    </span>
                    <Badge
                      variant={chapter.is_published ? 'default' : 'secondary'}
                      className={chapter.is_published ? 'bg-green-100 text-green-800' : ''}
                    >
                      {chapter.is_published ? 'Gepubliceerd' : 'Concept'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openChapterDialog(chapter)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Lessons list (expanded) */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    {chapterLessons.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Geen lessen in dit hoofdstuk
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {chapterLessons.map((lesson, lessonIndex) => {
                          const TypeIcon = lessonTypeIcons[lesson.type]
                          return (
                            <div
                              key={lesson.id}
                              className="bg-white rounded p-3 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded bg-gray-100">
                                  <TypeIcon className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm">
                                    {lessonIndex + 1}. {lesson.title}
                                  </span>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {lessonTypeLabels[lesson.type]}
                                  </Badge>
                                </div>
                              </div>
                              <Badge
                                variant={lesson.is_published ? 'default' : 'secondary'}
                                className={`text-xs ${lesson.is_published ? 'bg-green-100 text-green-800' : ''}`}
                              >
                                {lesson.is_published ? 'Gepubliceerd' : 'Concept'}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Chapter Dialog */}
      <Dialog open={showChapterDialog} onOpenChange={setShowChapterDialog}>
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

          <form onSubmit={handleChapterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-title">Titel *</Label>
              <Input
                id="chapter-title"
                value={chapterFormData.title}
                onChange={(e) => setChapterFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="bijv. Verkeersregels"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter-description">Beschrijving</Label>
              <Textarea
                id="chapter-description"
                value={chapterFormData.description}
                onChange={(e) => setChapterFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optionele beschrijving..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="chapter-published"
                checked={chapterFormData.is_published}
                onCheckedChange={(checked) => setChapterFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="chapter-published">Gepubliceerd</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowChapterDialog(false)}>
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={savingChapter}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {savingChapter ? 'Opslaan...' : 'Opslaan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Curriculum Genereren met AI
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {generatedChapters.length === 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Beschrijf het curriculum dat je wilt genereren</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                  placeholder="bijv. Genereer een curriculum voor Auto Theorie met 5 hoofdstukken over verkeersborden, voorrang, snelheid, gevaarlijke situaties en rijden op de snelweg"
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAIDialog(false)}>
                  Annuleren
                </Button>
                <Button
                  onClick={handleGenerateCurriculum}
                  disabled={generatingAI || !aiPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {generatingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Genereren...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Genereer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Bekijk en pas de gegenereerde hoofdstukken aan voordat je ze opslaat:
              </p>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {generatedChapters.map((chapter, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Hoofdstuk {index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGeneratedChapter(index)}
                        className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={chapter.title}
                      onChange={(e) => updateGeneratedChapter(index, 'title', e.target.value)}
                      placeholder="Titel"
                    />
                    <Textarea
                      value={chapter.description}
                      onChange={(e) => updateGeneratedChapter(index, 'description', e.target.value)}
                      placeholder="Beschrijving"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGeneratedChapters([])}
                >
                  Opnieuw genereren
                </Button>
                <Button
                  onClick={handleSaveGeneratedChapters}
                  disabled={savingGeneratedChapters || generatedChapters.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {savingGeneratedChapters ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {generatedChapters.length} Hoofdstukken Toevoegen
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
