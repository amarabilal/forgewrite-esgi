<template>
    <div class="not-found">
      <h1>404 - Page introuvable</h1>
      <p>Oups, cette page n'existe pas 🥲</p>
      <router-link to="/">Retour à l'accueil</router-link>
    </div>
  </template>
  
  <script setup lang="ts"></script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 4rem 2rem;
  }
  .not-found h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  </style>
  