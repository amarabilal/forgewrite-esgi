import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Book {
  id: number
  user_id: number
  title: string
  description?: string
  genre?: string
  status?: string
  created_at?: string
}

export const useBookStore = defineStore('book', () => {
  const books = ref<Book[]>([])
  const selectedBook = ref<Book | null>(null)

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books')
      books.value = res.data.data
    } catch (err) {
      console.error('Erreur chargement livres :', err)
    }
  }

  const fetchBookById = async (id: number) => {
    try {
      const res = await api.get(`/books/${id}`)
      selectedBook.value = res.data.data
    } catch (err) {
      console.error('Erreur chargement livre :', err)
    }
  }

  const createBook = async (newBook: Omit<Book, 'id' | 'created_at'>) => {
    try {
      const res = await api.post('/books', newBook)
      books.value.push(res.data.data)
    } catch (err) {
      console.error('Erreur création livre :', err)
    }
  }

  const updateBook = async (book: Book) => {
    try {
      await api.put(`/books/${book.id}`, book)
      await fetchBooks()
    } catch (err) {
      console.error('Erreur mise à jour livre :', err)
    }
  }

  const deleteBook = async (id: number) => {
    try {
      await api.delete(`/books/${id}`)
      books.value = books.value.filter(b => b.id !== id)
      if (selectedBook.value?.id === id) {
        selectedBook.value = null
      }
    } catch (err) {
      console.error('Erreur suppression livre :', err)
    }
  }

  return {
    books,
    selectedBook,
    fetchBooks,
    fetchBookById,
    createBook,
    updateBook,
    deleteBook
  }
})
