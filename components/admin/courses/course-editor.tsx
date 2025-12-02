'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, FileText, BookOpen, Settings } from 'lucide-react'
import { Course, CourseFormData, COURSE_CATEGORIES } from '@/types/course'
import { CurriculumBuilder } from './curriculum-builder'

interface CourseEditorProps {
  course?: Course | null
  onSuccess: () => void
  onCancel: () => void
}

export function CourseEditor({ course, onSuccess, onCancel }: CourseEditorProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')
  const [formData, setFormData] = useState<CourseFormData>({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price?.toString() || '',
    category: course?.category || '',
    image_url: course?.image_url || '',
    is_active: course?.is_active ?? false,
    slug: course?.slug || '',
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = course
        ? `/api/admin/courses/${course.id}`
        : '/api/admin/courses'
      
      // Validate and parse price
      let parsedPrice: number | null = null
      if (formData.price) {
        parsedPrice = parseFloat(formData.price as string)
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          setError('Voer een geldige prijs in')
          setLoading(false)
          return
        }
      }
      
      const response = await fetch(url, {
        method: course ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parsedPrice,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  // For new courses, only show the details form
  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug
          </Button>
          <h2 className="text-2xl font-bold">Nieuwe Cursus</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="bijv. Auto Theorie Basis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="bijv. auto-theorie-basis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer categorie" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prijs (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Laat leeg voor gratis"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image_url">Afbeelding URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschrijf de cursus..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Gepubliceerd (zichtbaar voor studenten)</Label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Opslaan...' : 'Opslaan'}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  // For existing courses, show tabbed interface
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Cursus Bewerken</h2>
          <p className="text-gray-600">{course.title}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Curriculum
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Instellingen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="bijv. Auto Theorie Basis"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="bijv. auto-theorie-basis"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prijs (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Laat leeg voor gratis"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image_url">Afbeelding URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Beschrijf de cursus..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Opslaan...' : 'Opslaan'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="curriculum">
          <div className="bg-white rounded-lg shadow p-6">
            <CurriculumBuilder course={course} />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h3 className="text-lg font-semibold">Publicatie Instellingen</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="is_active_settings" className="text-base font-medium">
                    Cursus Gepubliceerd
                  </Label>
                  <p className="text-sm text-gray-500">
                    Wanneer gepubliceerd is de cursus zichtbaar voor studenten
                  </p>
                </div>
                <Switch
                  id="is_active_settings"
                  checked={formData.is_active}
                  onCheckedChange={async (checked) => {
                    const previousValue = formData.is_active
                    setFormData(prev => ({ ...prev, is_active: checked }))
                    // Auto-save the setting
                    try {
                      const response = await fetch(`/api/admin/courses/${course.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...formData, is_active: checked }),
                      })
                      if (!response.ok) {
                        // Revert on failure
                        setFormData(prev => ({ ...prev, is_active: previousValue }))
                        setError('Kon publicatie status niet opslaan')
                      }
                    } catch {
                      // Revert on failure
                      setFormData(prev => ({ ...prev, is_active: previousValue }))
                      setError('Kon publicatie status niet opslaan')
                    }
                  }}
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h4 className="text-md font-semibold text-red-600 mb-4">Danger Zone</h4>
              <div className="p-4 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cursus Verwijderen</p>
                    <p className="text-sm text-gray-500">
                      Verwijder deze cursus permanent inclusief alle hoofdstukken en lessen
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (!confirm('Weet je zeker dat je deze cursus wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
                        return
                      }
                      try {
                        const response = await fetch(`/api/admin/courses/${course.id}`, {
                          method: 'DELETE',
                        })
                        if (response.ok) {
                          onSuccess()
                        }
                      } catch (error) {
                        console.error('Failed to delete course:', error)
                      }
                    }}
                  >
                    Verwijderen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
