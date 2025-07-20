<template>
  <div class="character-view">
    <aside class="character-list">
      <div
        v-for="character in characterStore.characters"
        :key="character.id"
        :class="['character-item', { selected: character.id === selectedId }]"
        @click="select(character.id)"
      >
        <img :src="defaultAvatar" alt="avatar" class="avatar" />
        <div class="name">{{ character.name || 'Sans nom' }}</div>
      </div>
      <div class="actions">
        <button @click="addCharacter">➕</button>
        <button @click="deleteCharacter" :disabled="!selectedId">🗑️</button>
      </div>
    </aside>

    <section class="character-form" v-if="selected">
      <h2>Fiche personnage</h2>
      <div class="grid">
        <label>Nom <input type="text" v-model="selected.name" /></label>
        <label>Alias <input type="text" v-model="selected.alias" /></label>
        <label>Âge <input type="number" v-model.number="selected.age" /></label>
        <label>
          Genre
          <div class="radio-group">
            <label><input type="radio" value="Homme" v-model="selected.gender" /> Homme</label>
            <label><input type="radio" value="Femme" v-model="selected.gender" /> Femme</label>
            <label><input type="radio" value="Autre" v-model="selected.gender" /> Autre</label>
          </div>
        </label>
        <label>Rôle <input type="text" v-model="selected.role" /></label>
        <label>Relations <textarea v-model="selected.relations" /></label>
        <label>Description physique <textarea v-model="selected.physical_description" /></label>
        <label>Histoire <textarea v-model="selected.backstory" /></label>
      </div>

      <div class="save-btn-wrapper">
        <button @click="saveCharacter">💾 Sauvegarder</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCharacterStore } from '@/store/useCharacterStore'
import { useRoute } from 'vue-router'
import defaultAvatar from '@/assets/icons/default-avatar.svg'

const characterStore = useCharacterStore()
const route = useRoute()
const bookId = Number(route.params.id)

const selectedId = ref<number | null>(null)

const selected = computed(() =>
  characterStore.characters.find((c) => c.id === selectedId.value) || null
)

const select = (id: number) => {
  selectedId.value = id
}

const addCharacter = async () => {
  const char = await characterStore.addCharacter(bookId)
  selectedId.value = char?.id ?? null
}

const deleteCharacter = async () => {
  if (selectedId.value) {
    await characterStore.deleteCharacter(selectedId.value)
    selectedId.value = null
  }
}

const saveCharacter = async () => {
  if (selected.value) {
    await characterStore.updateCharacter(selected.value)
  }
}

watch(
  () => route.params.id,
  async () => {
    await characterStore.fetchCharacters(bookId)
    selectedId.value = characterStore.characters[0]?.id ?? null
  },
  { immediate: true }
)
</script>

<style scoped>
.character-view {
  display: flex;
  height: 100%;
}

.character-list {
  width: 160px;
  background: #f8f8f8;
  padding: 1rem;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character-item {
  width: 100px;
  height: 100px;
  background: transparent;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  text-align: center;
  transition: 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.character-item.selected {
  background-color: #e0edff;
  border: 2px solid #3b82f6;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.4rem;
}

.name {
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
}

.character-form {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.character-form h2 {
  margin-bottom: 1rem;
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.save-btn-wrapper {
  margin-top: 1rem;
  text-align: right;
}

.save-btn-wrapper button {
  background: #3b82f6;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

input,
textarea {
  margin-top: 0.25rem;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
</style>
