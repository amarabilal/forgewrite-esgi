<template>
  <div class="add-book-card" @click="$emit('add-book')">
    <div class="add-icon">
      <img src="@/assets/icons/add.png" alt="Ajouter" />
    </div>
    <h3 class="add-text">Écrire un nouveau livre</h3>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['add-book'])
</script>

<style scoped>
.add-book-card {
  background: #3C68C2;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(60, 104, 194, 0.2);
  width: 240px;
  height: 345px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #FCF8ED;
}

.add-book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(60, 104, 194, 0.3);
  background: #004687;
  border-color: #004687;
}

.add-icon {
  margin-bottom: 1rem;
}

.add-icon img {
  width: 60px;
  height: 60px;
  filter: brightness(0) invert(1);
}

.add-text {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.4;
  max-width: 180px;
  word-wrap: break-word;
  hyphens: auto;
}
</style>
