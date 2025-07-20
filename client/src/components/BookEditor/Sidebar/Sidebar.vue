<template>
  <aside class="sidebar">
    <div
      v-for="item in menu"
      :key="item.label"
      :class="{ active: item.label === selected }"
      class="sidebar-item"
      @click="select(item.label)"
    >
      <span class="icon">{{ item.icon }}</span>
      <span class="text">{{ item.label }}</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['select'])
const selected = ref('Écrire')

const menu = [
  { label: 'Écrire', icon: '📝' },
  { label: 'Personnages', icon: '🧙' },
  { label: 'Objectifs', icon: '🎯' },
  { label: 'Carte mentale', icon: '🗺️' },
  { label: 'Trouver des mots', icon: '🔍' },
  { label: 'Assistant d’écriture', icon: '🤖' },
  { label: 'Commentaires', icon: '💬' },
  { label: 'Exporter en PDF', icon: '📤' }
]

function select(label: string) {
  selected.value = label
  emit('select', label)
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #faf6f0;
  padding: 1rem 0;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.sidebar-item:hover {
  background-color: #f1e7dd;
}

.sidebar-item.active {
  background-color: #e5d6c8;
  color: #5a3e2b;
  font-weight: 700;
}

.icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.text {
  font-size: 1rem;
}
</style>
