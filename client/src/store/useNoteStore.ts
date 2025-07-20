import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Note {
  id: number
  chapter_id: number
  content: string
  line_position?: number
  created_at?: string
}

export const useNoteStore = defineStore('note', () => {
  const notes = ref<Note[]>([])

  const fetchNotes = async (chapterId: number) => {
    try {
      const res = await api.get(`/chapters/${chapterId}/notes`)
      notes.value = res.data.data
    } catch (err) {
      console.error('Erreur chargement notes :', err)
    }
  }

  const createNote = async (
    note: Omit<Note, 'id' | 'created_at'>
  ): Promise<Note | null> => {
    try {
      const res = await api.post('/notes', note)
      const newNote: Note = res.data.data
      notes.value.push(newNote)
      return newNote
    } catch (err) {
      console.error('Erreur création note :', err)
      return null
    }
  }

  const updateNote = async (note: Note) => {
    try {
      await api.put(`/notes/${note.id}`, note)
      const index = notes.value.findIndex((n) => n.id === note.id)
      if (index !== -1) {
        notes.value[index] = { ...note }
      }
    } catch (err) {
      console.error('Erreur mise à jour note :', err)
    }
  }

  const deleteNote = async (id: number) => {
    try {
      await api.delete(`/notes/${id}`)
      notes.value = notes.value.filter((n) => n.id !== id)
    } catch (err) {
      console.error('Erreur suppression note :', err)
    }
  }

  return {
    notes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
})
