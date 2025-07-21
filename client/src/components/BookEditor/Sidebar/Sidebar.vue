<template>
  <aside class="sidebar">
    <div
      v-for="item in menu"
      :key="item.label"
      :class="{ active: item.label === selected }"
      class="sidebar-item"
      @click="select(item.label)"
    >
      <img :src="item.icon" :alt="item.label" class="icon" />
      <span class="text">{{ item.label }}</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'

// Import icons
import editIcon from '@/assets/icons/edit-ico.svg?url'
import persoIcon from '@/assets/icons/perso-ico.svg?url'
import goalIcon from '@/assets/icons/goal-ico.svg?url'
import carteIcon from '@/assets/icons/carte-ico.svg?url'
import langIcon from '@/assets/icons/lang-ico.svg?url'
import aiIcon from '@/assets/icons/ai-ico.svg?url'
import commentIcon from '@/assets/icons/comment-ico.svg?url'
import exportIcon from '@/assets/icons/export-ico.svg?url'

const emit = defineEmits(['select'])
const selected = ref('Écrire')

const menu = [
  { label: 'Écrire', icon: editIcon },
  { label: 'Personnages', icon: persoIcon },
  { label: 'Objectifs', icon: goalIcon },
  { label: 'Carte mentale', icon: carteIcon },
  { label: 'Trouver des mots', icon: langIcon },
  { label: 'Assistant d\'écriture', icon: aiIcon },
  { label: 'Commentaires', icon: commentIcon },
  { label: 'Exporter en PDF', icon: exportIcon }
]

function select(label: string) {
  selected.value = label
  emit('select', label)
}
</script>

<style scoped>
.sidebar {
  padding-top: 70px !important; /* Adjusted padding for better alignment */
  width: 220px;
  background-color: #3C68C2;
  padding: 1rem 0;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  padding: 0.75rem 1.5rem;
  margin: 0.25rem 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  position: relative;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-item.active {
  background-color: white;
  color: #3C68C2;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateX(2px);
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 0.75rem;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

.sidebar-item.active .icon {
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
  transform: scale(1.05);
}

.text {
  font-size: 0.95rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}
</style>
