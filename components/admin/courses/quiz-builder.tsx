'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  GripVertical,
  Check,
  X,
  ImageIcon,
} from 'lucide-react'
import { Lesson, QuizQuestion, QuizAnswer } from '@/types/course'

interface QuizBuilderProps {
  lesson: Lesson
  onBack: () => void
}

interface QuestionWithAnswers extends QuizQuestion {
  quiz_answers: QuizAnswer[]
}

interface QuestionFormData {
  question: string
  image_url: string
  explanation: string
}

interface AnswerFormData {
  answer: string
  is_correct: boolean
}

export function QuizBuilder({ lesson, onBack }: QuizBuilderProps) {
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([])
  const [loading, setLoading] = useState(true)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithAnswers | null>(null)
  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>({
    question: '',
    image_url: '',
    explanation: '',
  })
  
  const [showAnswerDialog, setShowAnswerDialog] = useState(false)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [editingAnswer, setEditingAnswer] = useState<QuizAnswer | null>(null)
  const [answerFormData, setAnswerFormData] = useState<AnswerFormData>({
    answer: '',
    is_correct: false,
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/quiz-questions?lesson_id=${lesson.id}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }, [lesson.id])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // Question handlers
  const openQuestionDialog = (question?: QuestionWithAnswers) => {
    if (question) {
      setEditingQuestion(question)
      setQuestionFormData({
        question: question.question,
        image_url: question.image_url || '',
        explanation: question.explanation || '',
      })
    } else {
      setEditingQuestion(null)
      setQuestionFormData({
        question: '',
        image_url: '',
        explanation: '',
      })
    }
    setError(null)
    setShowQuestionDialog(true)
  }

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingQuestion
        ? `/api/admin/quiz-questions/${editingQuestion.id}`
        : '/api/admin/quiz-questions'

      const response = await fetch(url, {
        method: editingQuestion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...questionFormData,
          lesson_id: lesson.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      setShowQuestionDialog(false)
      fetchQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSaving(false)
    }
  }

  const handleQuestionDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze vraag wilt verwijderen? Alle antwoorden worden ook verwijderd.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/quiz-questions/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchQuestions()
      }
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }

  const moveQuestion = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= questions.length) return

    const question = questions[index]
    const targetQuestion = questions[newIndex]

    try {
      await Promise.all([
        fetch(`/api/admin/quiz-questions/${question.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question.question,
            image_url: question.image_url,
            explanation: question.explanation,
            order_index: targetQuestion.order_index,
          }),
        }),
        fetch(`/api/admin/quiz-questions/${targetQuestion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: targetQuestion.question,
            image_url: targetQuestion.image_url,
            explanation: targetQuestion.explanation,
            order_index: question.order_index,
          }),
        }),
      ])
      fetchQuestions()
    } catch (error) {
      console.error('Failed to reorder questions:', error)
    }
  }

  // Answer handlers
  const openAnswerDialog = (questionId: string, answer?: QuizAnswer) => {
    setActiveQuestionId(questionId)
    if (answer) {
      setEditingAnswer(answer)
      setAnswerFormData({
        answer: answer.answer,
        is_correct: answer.is_correct,
      })
    } else {
      setEditingAnswer(null)
      setAnswerFormData({
        answer: '',
        is_correct: false,
      })
    }
    setError(null)
    setShowAnswerDialog(true)
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeQuestionId) return
    
    setSaving(true)
    setError(null)

    try {
      const url = editingAnswer
        ? `/api/admin/quiz-answers/${editingAnswer.id}`
        : '/api/admin/quiz-answers'

      const response = await fetch(url, {
        method: editingAnswer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answerFormData,
          question_id: activeQuestionId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      setShowAnswerDialog(false)
      fetchQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setSaving(false)
    }
  }

  const handleAnswerDelete = async (answerId: string) => {
    if (!confirm('Weet je zeker dat je dit antwoord wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/quiz-answers/${answerId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchQuestions()
      }
    } catch (error) {
      console.error('Failed to delete answer:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <div>
          <p className="text-sm text-gray-500">Quiz</p>
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <p className="text-gray-600">Beheer vragen en antwoorden</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vragen ({questions.length})</h3>
        <Button
          onClick={() => openQuestionDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Vraag
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Vragen laden...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            Nog geen vragen. Voeg je eerste vraag toe!
          </p>
          <Button
            onClick={() => openQuestionDialog()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Vraag
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, qIndex) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      disabled={qIndex === 0}
                      onClick={() => moveQuestion(qIndex, 'up')}
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Vraag {qIndex + 1}</span>
                      {question.image_url && (
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="mt-1">{question.question}</p>
                    {question.explanation && (
                      <p className="text-sm text-gray-500 mt-2">
                        <strong>Uitleg:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openQuestionDialog(question)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuestionDelete(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="ml-8 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Antwoorden ({question.quiz_answers?.length || 0})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAnswerDialog(question.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Antwoord
                  </Button>
                </div>
                
                {question.quiz_answers && question.quiz_answers.length > 0 ? (
                  <div className="space-y-2">
                    {question.quiz_answers.map((answer, aIndex) => (
                      <div
                        key={answer.id}
                        className={`flex items-center justify-between p-2 rounded ${
                          answer.is_correct ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {answer.is_correct ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">
                            {String.fromCharCode(65 + aIndex)}. {answer.answer}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => openAnswerDialog(question.id, answer)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleAnswerDelete(answer.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Geen antwoorden. Voeg minimaal 2 antwoorden toe.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Vraag Bewerken' : 'Nieuwe Vraag'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Vraag *</Label>
              <Textarea
                id="question-text"
                value={questionFormData.question}
                onChange={(e) => setQuestionFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Stel je vraag..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-image">Afbeelding URL (optioneel)</Label>
              <Input
                id="question-image"
                type="url"
                value={questionFormData.image_url}
                onChange={(e) => setQuestionFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-explanation">Uitleg (getoond na beantwoorden)</Label>
              <Textarea
                id="question-explanation"
                value={questionFormData.explanation}
                onChange={(e) => setQuestionFormData(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Uitleg waarom dit antwoord correct is..."
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowQuestionDialog(false)}>
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

      {/* Answer Dialog */}
      <Dialog open={showAnswerDialog} onOpenChange={setShowAnswerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAnswer ? 'Antwoord Bewerken' : 'Nieuw Antwoord'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="answer-text">Antwoord *</Label>
              <Input
                id="answer-text"
                value={answerFormData.answer}
                onChange={(e) => setAnswerFormData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Voer het antwoord in..."
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="answer-correct"
                checked={answerFormData.is_correct}
                onCheckedChange={(checked) => setAnswerFormData(prev => ({ ...prev, is_correct: checked }))}
              />
              <Label htmlFor="answer-correct">Dit is het juiste antwoord</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAnswerDialog(false)}>
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
