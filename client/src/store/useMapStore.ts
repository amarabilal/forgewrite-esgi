import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface MapItem {
  id: number
  book_id: number
  type: 'city' | 'place' | 'route'
  name: string
  x: number
  y: number
  description?: string
}

export const useMapStore = defineStore('map', () => {
  const mapItems = ref<MapItem[]>([])

  const fetchMapItems = async (bookId: number) => {
    try {
      const res = await api.get(`/books/${bookId}/map-items`)
      mapItems.value = res.data.data
    } catch (err) {
      console.error('Erreur chargement éléments de carte :', err)
    }
  }

  const createMapItem = async (item: Omit<MapItem, 'id'>) => {
    try {
      const res = await api.post('/map-items', item)
      mapItems.value.push(res.data.data)
    } catch (err) {
      console.error('Erreur création élément carte :', err)
    }
  }

  const updateMapItem = async (item: MapItem) => {
    try {
      await api.put(`/map-items/${item.id}`, item)
      const index = mapItems.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        mapItems.value[index] = { ...item }
      }
    } catch (err) {
      console.error('Erreur mise à jour élément carte :', err)
    }
  }

  const deleteMapItem = async (id: number) => {
    try {
      await api.delete(`/map-items/${id}`)
      mapItems.value = mapItems.value.filter(i => i.id !== id)
    } catch (err) {
      console.error('Erreur suppression élément carte :', err)
    }
  }

  return {
    mapItems,
    fetchMapItems,
    createMapItem,
    updateMapItem,
    deleteMapItem,
  }
})
