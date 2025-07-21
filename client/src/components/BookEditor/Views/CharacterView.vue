<template>
  <div class="character-view">
    <!-- Toast notification -->
    <div :class="['toast', { 'toast-visible': showToast }]">
      <div class="toast-content">
        <img :src="saveIcon" alt="Sauvegardé" class="toast-icon" />
        <span>Personnage sauvegardé avec succès!</span>
      </div>
    </div>
    
    <aside class="character-list">
      <div class="characters-container">
        <div class="character-grid">
          <div
            v-for="character in characterStore.characters"
            :key="character.id"
            :class="['character-item', { selected: character.id === selectedId }]"
            @click="select(character.id)"
          >
            <img :src="getAvatarForCharacter(character)" alt="avatar" class="avatar" />
            <div class="name">{{ character.name || 'Sans nom' }}</div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="addCharacter" title="Ajouter un personnage">
          <img :src="addIcon" alt="Ajouter" class="action-icon" />
        </button>
        <button @click="deleteCharacter" :disabled="!selectedId" title="Supprimer le personnage">
          <img :src="trashIcon" alt="Supprimer" class="action-icon" />
        </button>
      </div>
    </aside>

    <section class="character-form" v-if="selected">
      <div class="form-header">
        <h2>{{ selected.name || 'Sans nom' }}</h2>
        <div class="role-indicator">
          <span class="role-label">Role</span>
          <div class="role-dots">
            <div class="dot active"></div>
            <div class="dot active"></div>
            <div class="dot active"></div>
            <div class="dot active"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
      
      <div class="form-grid">
        <div class="form-group">
          <label>Nom</label>
          <input type="text" v-model="selected.name" placeholder="Entrez le nom" />
          <button class="clear-btn" @click="selected.name = ''">×</button>
        </div>
        
        <div class="form-group">
          <label>Alias</label>
          <input type="text" v-model="selected.alias" placeholder="Entrez l'alias" />
          <button class="clear-btn" @click="selected.alias = ''">×</button>
        </div>
        
        <div class="form-group">
          <label>Âge</label>
          <input type="number" v-model.number="selected.age" placeholder="Entrez l'âge" />
          <button class="clear-btn" @click="selected.age = undefined">×</button>
        </div>
        
        <div class="gender-group">
          <div class="radio-option">
            <input type="radio" id="homme" value="Homme" v-model="selected.gender" />
            <label for="homme">Homme</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="femme" value="Femme" v-model="selected.gender" />
            <label for="femme">Femme</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="autre" value="Autre" v-model="selected.gender" />
            <label for="autre">Autre</label>
          </div>
        </div>
        
        <div class="form-group">
          <label>Rôle</label>
          <input type="text" v-model="selected.role" placeholder="Entrez le rôle" />
          <button class="clear-btn" @click="selected.role = ''">×</button>
        </div>
        
        <div class="form-group">
          <label>Relations</label>
          <textarea v-model="selected.relations" placeholder="Relations du personnage"></textarea>
          <button class="clear-btn" @click="selected.relations = ''">×</button>
        </div>
        
        <div class="form-group">
          <label>Description physique</label>
          <textarea v-model="selected.physical_description" placeholder="Description physique"></textarea>
          <button class="clear-btn" @click="selected.physical_description = ''">×</button>
        </div>
        
        <div class="form-group">
          <label>Histoire</label>
          <textarea v-model="selected.backstory" placeholder="Histoire du personnage"></textarea>
          <button class="clear-btn" @click="selected.backstory = ''">×</button>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="saveCharacter" class="save-button">
          <img :src="saveIcon" alt="Sauvegarder" class="save-icon" />
          Sauvegarder
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCharacterStore } from '@/store/useCharacterStore'
import { useRoute } from 'vue-router'
import defaultAvatar from '@/assets/icons/default-avatar.svg'
import menAvatar from '@/assets/icons/men-ava.png'
import womenAvatar from '@/assets/icons/women-ava.png'
import addIcon from '@/assets/icons/add-ico.svg?url'
import trashIcon from '@/assets/icons/trash-ico.svg?url'
import saveIcon from '@/assets/icons/save-ico.svg?url'

const characterStore = useCharacterStore()
const route = useRoute()
const bookId = Number(route.params.id)

const selectedId = ref<number | null>(null)
const showToast = ref(false)

const selected = computed(() =>
  characterStore.characters.find((c) => c.id === selectedId.value) || null
)

const getAvatarForCharacter = (character: any) => {
  if (character.gender === 'Homme') return menAvatar
  if (character.gender === 'Femme') return womenAvatar
  return defaultAvatar
}

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
    // Show toast notification
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
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
  position: relative;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: #28a745;
  color: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
  z-index: 1000;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
}

.toast-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.character-list {
  width: 320px;
  background: #f8f8f8;
  padding: 1rem;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.characters-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.character-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.character-item {
  width: 100%;
  height: 140px;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  padding: 0;
  text-align: center;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  overflow: hidden;
  position: relative;
}

.character-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(60, 104, 194, 0.1);
}

.character-item.selected {
  border: 2px solid #3C68C2;
  box-shadow: 0 4px 12px rgba(60, 104, 194, 0.2);
}

.character-item:nth-child(odd) {
  background: linear-gradient(135deg, #87CEEB, #6BB6D6);
}

.character-item:nth-child(even) {
  background: linear-gradient(135deg, #90EE90, #7FD67F);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin: 0 0.5rem;
}

.actions {
  margin-top: 1rem;
  padding-bottom: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.actions button {
  background: #3C68C2;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
}

.actions button:hover:not(:disabled) {
  background-color: #2558B8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(60, 104, 194, 0.4);
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #ccc;
  box-shadow: none;
}

.action-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.actions button:disabled .action-icon {
  filter: brightness(0) invert(0.7);
}

.character-form {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #f0f0f0;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h2 {
  background: #3C68C2;
  color: white;
  padding: 1rem;
  margin: 0 0 1rem 0;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
}

.role-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 0.5rem;
}

.role-label {
  font-weight: 600;
  color: #666;
}

.role-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ddd;
  transition: background-color 0.2s;
}

.dot.active {
  background-color: #3C68C2;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fafafa;
  transition: all 0.2s;
  padding-right: 2.5rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3C68C2;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(60, 104, 194, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  top: 2rem;
  background: none;
  border: none;
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.clear-btn:hover {
  background-color: #f0f0f0;
  color: #666;
}

.gender-group {
  grid-column: 1 / -1;
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #3C68C2;
}

.radio-option label {
  font-weight: 500;
  color: #555;
  margin: 0;
  cursor: pointer;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.save-button {
  background: #3C68C2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
}

.save-button:hover {
  background-color: #2558B8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(60, 104, 194, 0.4);
}

.save-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}
</style>
