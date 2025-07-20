import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

interface Chapter {
  id: number
  book_id: number
  title: string
  content: string
  order_index?: number
  updated_at?: string
}

export const useChapterStore = defineStore('chapter', () => {
  const chapters = ref<Chapter[]>([])
  const selectedChapterId = ref<number | null>(null)
  const selectedChapterTitle = ref('')
  const selectedChapterContent = ref('')

  const fetchChapters = async (bookId: number) => {
    try {
      const res = await api.get(`/books/${bookId}/chapters`)
      chapters.value = Array.isArray(res.data.data)
        ? res.data.data.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        : []

      if (chapters.value.length > 0) {
        await selectChapter(chapters.value[0].id)
      } else {
        clearSelection()
      }
    } catch (err) {
      console.error('Erreur chargement des chapitres :', err)
      clearSelection()
    }
  }

  const selectChapter = async (id: number) => {
    selectedChapterId.value = id

    const chapter = chapters.value.find((c) => c.id === id)

    if (chapter) {
      selectedChapterTitle.value = chapter.title
      selectedChapterContent.value = chapter.content || ''
    } else {
      try {
        const res = await api.get(`/chapters/${id}`)
        const data = res.data.data
        selectedChapterTitle.value = data.title
        selectedChapterContent.value = data.content || ''
      } catch (err) {
        console.error('Erreur lors du chargement du chapitre :', err)
      }
    }
  }

  const updateChapterContent = async (content: string) => {
    if (!selectedChapterId.value) return
    selectedChapterContent.value = content
    try {
      await api.put(`/chapters/${selectedChapterId.value}`, { content })
      const chapter = chapters.value.find(c => c.id === selectedChapterId.value)
      if (chapter) {
        chapter.content = content
      }
    } catch (err) {
      console.error('Erreur mise à jour contenu :', err)
    }
  }

  const createChapter = async (bookId: number, title: string) => {
    try {
      const res = await api.post('/chapters', {
        book_id: bookId,
        title,
        content: '<p>Écrivez votre chapitre ici...</p>',
        order_index: chapters.value.length
      })

      await fetchChapters(bookId)
      await selectChapter(res.data.data.id)
    } catch (err) {
      console.error('Erreur création chapitre :', err)
    }
  }

  const saveChapterOrder = async () => {
    try {
      for (let i = 0; i < chapters.value.length; i++) {
        const chapter = chapters.value[i]
        await api.put(`/chapters/${chapter.id}`, {
          order_index: i
        })
        chapter.order_index = i
      }
    } catch (err) {
      console.error('Erreur mise à jour ordre chapitres :', err)
    }
  }

  const clearSelection = () => {
    selectedChapterId.value = null
    selectedChapterTitle.value = ''
    selectedChapterContent.value = ''
  }

  return {
    chapters,
    selectedChapterId,
    selectedChapterTitle,
    selectedChapterContent,
    fetchChapters,
    selectChapter,
    updateChapterContent,
    createChapter,
    saveChapterOrder
  }
})
