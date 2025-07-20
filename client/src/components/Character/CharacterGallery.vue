<template>
    <div class="gallery-container">
      <div class="toolbar">
        <h2>🎭 Personnages</h2>
        <button @click="addCharacter">➕ Ajouter</button>
      </div>
  
      <div v-if="characterStore.characters.length === 0" class="empty">
        Aucun personnage pour le moment.
      </div>
  
      <div class="grid">
        <CharacterCard
          v-for="char in characterStore.characters"
          :key="char.id"
          :character="char"
          @click="selectCharacter(char)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { onMounted } from 'vue'
  import { useCharacterStore } from '@/store/useCharacterStore'
  import CharacterCard from './CharacterCard.vue'
  
  const characterStore = useCharacterStore()
  const route = useRoute()
  const bookId = Number(route.params.id)
  
  onMounted(() => {
    characterStore.fetchCharacters(bookId)
  })
  
  const addCharacter = async () => {
    await characterStore.addCharacter(bookId)
  }
  
  const selectCharacter = (char: any) => {
    // Tu peux router vers une vue détaillée ou ouvrir une modal
    alert(`Sélectionné : ${char.name}`)
  }
  </script>
  
  <style scoped>
  .gallery-container {
    padding: 2rem;
  }
  
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
  
  .empty {
    text-align: center;
    color: #888;
  }
  </style>
  