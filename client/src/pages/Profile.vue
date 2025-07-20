<template>
  <div class="profile-page">
    <h1>👤 Mon profil</h1>

    <div class="profile-sections">
      <section class="left">
        <ProfileForm />
        <ChangePasswordForm />
      </section>

      <section class="right">
        <TwoFactorSection />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileForm from '@/components/Profile/ProfileForm.vue'
import ChangePasswordForm from '@/components/Profile/ChangePasswordForm.vue'
import TwoFactorSection from '@/components/Profile/TwoFactorSection.vue'
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
}

.profile-sections {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.left {
  flex: 1;
}

.right {
  flex: 1;
  border-left: 1px solid #ddd;
  padding-left: 2rem;
}
</style>
