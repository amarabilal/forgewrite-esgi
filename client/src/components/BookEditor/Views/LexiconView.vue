<template>
  <div class="lexicon-view">
    <div class="lexicon-header">
      <img :src="dictIcon" alt="Dictionnaire" class="header-icon" />
      <h2>Lexique</h2>
    </div>

    <div class="search-section">
      <div class="search-container">
        <input
          v-model="query"
          @keyup.enter="search"
          placeholder="Tapez un mot..."
          class="search-input"
        />
        <button @click="search" class="search-button" :disabled="!query.trim() || loading">
          <img :src="searchIcon" alt="Rechercher" class="button-icon" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="status loading">
      <img :src="searchIcon" alt="Recherche" class="status-icon spinning" />
      Recherche en cours...
    </div>
    
    <div v-else-if="error" class="status error">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>

    <div v-else-if="definition" class="result-card">
      <div class="definition-section">
        <h3>Définition</h3>
        <p class="definition">{{ definition }}</p>
      </div>

      <div v-if="synonyms.length" class="synonyms-section">
        <h4>Synonymes</h4>
        <div class="synonyms-grid">
          <span v-for="syn in synonyms" :key="syn" class="synonym-tag">{{ syn }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

// Import SVG icons
import dictIcon from '@/assets/icons/dict-ico.svg?url'
import searchIcon from '@/assets/icons/search-ico.svg?url'

const query = ref('')
const definition = ref('')
const synonyms = ref<string[]>([])
const loading = ref(false)
const error = ref('')

const search = async () => {
  if (!query.value.trim()) return

  loading.value = true
  definition.value = ''
  synonyms.value = []
  error.value = ''

  try {
    const word = query.value.trim().toLowerCase()
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    const data = res.data[0]

    definition.value =
      data.meanings?.[0]?.definitions?.[0]?.definition || 'Définition non trouvée.'

    synonyms.value = data.meanings?.[0]?.definitions?.[0]?.synonyms || []
  } catch (err) {
    error.value = 'Mot introuvable ou erreur de connexion.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.lexicon-view {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.lexicon-header {
  background: linear-gradient(135deg, #3C68C2, #2558B8);
  color: white;
  padding: 1.5rem;
  margin: -2rem -2rem 2rem -2rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}

.lexicon-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.search-section {
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #3C68C2;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(60, 104, 194, 0.1);
}

.search-button {
  padding: 1rem;
  background: #3C68C2;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
}

.search-button:hover:not(:disabled) {
  background-color: #2558B8;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(60, 104, 194, 0.4);
}

.search-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.status {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.status.loading {
  background: #f0f8ff;
  color: #3C68C2;
  border: 2px solid #e6f2ff;
}

.status.error {
  background: #fff5f5;
  color: #e53e3e;
  border: 2px solid #fed7d7;
}

.status-icon {
  width: 20px;
  height: 20px;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 1.2rem;
}

.result-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.definition-section {
  margin-bottom: 1.5rem;
}

.definition-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
}

.definition {
  background: white;
  padding: 1.25rem;
  border-radius: 10px;
  border-left: 4px solid #3C68C2;
  font-size: 1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.synonyms-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.synonyms-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.synonym-tag {
  background: #3C68C2;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.synonym-tag:hover {
  background: #2558B8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
}
</style>
