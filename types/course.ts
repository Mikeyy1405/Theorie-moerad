// Course Management System Types

export interface Course {
  id: string
  title: string
  description: string | null
  price: number | null
  category: string | null
  image_url: string | null
  is_active: boolean
  slug: string
  created_at: string
  updated_at: string
}

export interface CourseFormData {
  title: string
  description: string
  price: number | string
  category: string
  image_url: string
  is_active: boolean
  slug: string
}

export interface Chapter {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ChapterFormData {
  title: string
  description: string
  order_index: number
  is_published: boolean
}

export type LessonType = 'TEXT' | 'VIDEO' | 'QUIZ'

export interface Lesson {
  id: string
  course_id: string
  chapter_id: string
  title: string
  description: string | null
  content: string | null
  order_index: number
  is_free: boolean
  type: LessonType
  video_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface LessonFormData {
  title: string
  description: string
  content: string
  order_index: number
  is_free: boolean
  type: LessonType
  video_url: string
  is_published: boolean
}

export interface QuizQuestion {
  id: string
  lesson_id: string
  question: string
  image_url: string | null
  explanation: string | null
  order_index: number
  created_at: string
}

export interface QuizQuestionFormData {
  question: string
  image_url: string
  explanation: string
  order_index: number
}

export interface QuizAnswer {
  id: string
  question_id: string
  answer: string
  is_correct: boolean
  created_at: string
}

export interface QuizAnswerFormData {
  answer: string
  is_correct: boolean
}

// Extended types for relationships
export interface ChapterWithLessons extends Chapter {
  lessons: Lesson[]
}

export interface CourseWithChapters extends Course {
  chapters: ChapterWithLessons[]
}

export interface QuizQuestionWithAnswers extends QuizQuestion {
  answers: QuizAnswer[]
}

export interface LessonWithQuestions extends Lesson {
  quiz_questions?: QuizQuestionWithAnswers[]
}

// Course categories
export const COURSE_CATEGORIES = [
  'Auto Theorie',
  'Motor Theorie',
  'Bromfiets Theorie',
  'Algemeen',
] as const

export type CourseCategory = typeof COURSE_CATEGORIES[number]
