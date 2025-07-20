<template>
  <div class="lexicon-card">
    <h2>📚 Lexique</h2>

    <input
      v-model="query"
      @keyup.enter="search"
      placeholder="Tapez un mot..."
      class="search-input"
    />

    <div v-if="loading" class="status">🔍 Recherche...</div>
    <div v-else-if="error" class="status error">❌ {{ error }}</div>

    <div v-else-if="definition" class="result">
      <h3>Définition</h3>
      <p class="definition">{{ definition }}</p>

      <div v-if="synonyms.length" class="synonyms">
        <h4>Synonymes</h4>
        <ul>
          <li v-for="syn in synonyms" :key="syn">{{ syn }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

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
.lexicon-card {
  width: 480px;
  margin: 4rem auto;
  padding: 2rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  text-align: center;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  border: 1px solid #bbb;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.status {
  font-size: 0.95rem;
  color: #555;
  margin-top: 1rem;
  text-align: center;
}

.status.error {
  color: red;
}

.result {
  margin-top: 1.2rem;
}

.definition {
  background: #f6f6f6;
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #eee;
}

.synonyms h4 {
  margin-top: 1rem;
}

.synonyms ul {
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.synonyms li {
  font-size: 0.95rem;
  color: #333;
}
</style>
