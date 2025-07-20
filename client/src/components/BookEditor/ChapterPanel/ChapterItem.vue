<template>
  <li :class="{ selected }" @click="$emit('select')">
    {{ title }}
    <button @click.stop="$emit('delete')">🗑️</button>
  </li>
</template>

<script setup lang="ts">
defineProps<{ title: string; selected: boolean }>()
defineEmits(['select', 'delete'])
</script>

<style scoped>
li {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.selected {
  font-weight: bold;
  background: #f0f0f0;
}
</style>
