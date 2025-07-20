<template>
    <div class="card" @click="$emit('click')">
      <img :src="avatarUrl" alt="avatar" class="avatar" />
      <h3>{{ character.name || 'Sans nom' }}</h3>
      <p v-if="character.alias"><em>"{{ character.alias }}"</em></p>
      <p class="meta">
        <span v-if="character.age">🎂 {{ character.age }} ans</span>
        <span v-if="character.gender">• {{ character.gender }}</span>
      </p>
      <p class="role">{{ character.role || 'Rôle inconnu' }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { Character } from '@/store/useCharacterStore'
  
  const props = defineProps<{
    character: Character
  }>()
  
  const avatarUrl = computed(() => {
    const seed = props.character.name || 'character'
    const style = props.character.gender === 'Femme' ? 'adventurer-neutral' : 'adventurer'
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`
  })
  </script>
  
  <style scoped>
  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    width: 180px;
    text-align: center;
    cursor: pointer;
    transition: box-shadow 0.2s ease;
    background: #fff;
  }
  
  .card:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-bottom: 0.5rem;
  }
  
  .meta {
    color: #555;
    font-size: 0.9rem;
    margin: 0.25rem 0;
  }
  
  .role {
    font-weight: 600;
    font-size: 0.95rem;
    color: #444;
  }
  </style>
  