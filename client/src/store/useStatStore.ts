import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Stat {
  id: number
  book_id: number
  word_count: number
  letter_count: number
  total_goal?: number
  weekly_goal?: number
  deadline?: string | null
}

export const useStatStore = defineStore('stat', () => {
  const stat = ref<Stat | null>(null)

  const fetchStat = async (bookId: number) => {
    try {
      const res = await api.get(`/stats/${bookId}`)
      stat.value = res.data.data
    } catch (err) {
      console.error('Erreur chargement stat :', err)
    }
  }

  const updateStat = async () => {
    if (!stat.value) return
    try {
      await api.put(`/stats/${stat.value.book_id}`, stat.value)
    } catch (err) {
      console.error('Erreur mise à jour stat :', err)
    }
  }

  return {
    stat,
    fetchStat,
    updateStat
  }
})
