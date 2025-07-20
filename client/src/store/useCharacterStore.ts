import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Character {
  id: number
  book_id: number
  name: string
  alias?: string
  gender?: string
  age?: number
  physical_description?: string
  backstory?: string
  role?: string
  relations?: string
}

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>([])

  const fetchCharacters = async (bookId: number) => {
    try {
      const res = await api.get(`/books/${bookId}/characters`)
      characters.value = res.data.data
    } catch (err) {
      console.error('Erreur chargement personnages :', err)
    }
  }

  const addCharacter = async (bookId: number) => {
    try {
      const res = await api.post('/characters', {
        book_id: bookId,
        name: 'Nouveau personnage',
        alias: '',
        gender: '',
        age: null,
        physical_description: '',
        backstory: '',
        role: '',
        relations: ''
      })
      await fetchCharacters(bookId)
      return res.data.data
    } catch (err) {
      console.error('Erreur création personnage :', err)
      return null
    }
  }

  const updateCharacter = async (character: Character) => {
    try {
      await api.put(`/characters/${character.id}`, {
        name: character.name,
        alias: character.alias,
        gender: character.gender,
        age: character.age,
        physical_description: character.physical_description,
        backstory: character.backstory,
        role: character.role,
        relations: character.relations
      })
      const index = characters.value.findIndex(c => c.id === character.id)
      if (index !== -1) {
        characters.value[index] = { ...character }
      }
    } catch (err) {
      console.error('Erreur modification personnage :', err)
    }
  }

  const deleteCharacter = async (id: number) => {
    try {
      await api.delete(`/characters/${id}`)
      characters.value = characters.value.filter(c => c.id !== id)
    } catch (err) {
      console.error('Erreur suppression personnage :', err)
    }
  }

  return {
    characters,
    fetchCharacters,
    addCharacter,
    updateCharacter,
    deleteCharacter
  }
})
