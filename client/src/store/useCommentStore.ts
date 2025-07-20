import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Comment {
  id: number
  book_id: number
  content: string
  created_at?: string
}

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([])

  const fetchComments = async (bookId: number) => {
    try {
      const res = await api.get(`/books/${bookId}/comments`)
      comments.value = res.data.data
    } catch (err) {
      console.error('Erreur chargement commentaires :', err)
    }
  }

  const createComment = async (comment: Omit<Comment, 'id' | 'created_at'>) => {
    try {
      const res = await api.post('/comments', comment)
      comments.value.push(res.data.data)
    } catch (err) {
      console.error('Erreur création commentaire :', err)
    }
  }

  const updateComment = async (comment: Comment) => {
    try {
      await api.put(`/comments/${comment.id}`, comment)
      const index = comments.value.findIndex(c => c.id === comment.id)
      if (index !== -1) {
        comments.value[index] = { ...comment }
      }
    } catch (err) {
      console.error('Erreur mise à jour commentaire :', err)
    }
  }

  const deleteComment = async (id: number) => {
    try {
      await api.delete(`/comments/${id}`)
      comments.value = comments.value.filter(c => c.id !== id)
    } catch (err) {
      console.error('Erreur suppression commentaire :', err)
    }
  }

  return {
    comments,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
  }
})
