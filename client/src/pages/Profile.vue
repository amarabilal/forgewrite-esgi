<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Left side - Profile & Password -->
      <div class="left-side">
        <div class="user-header">
          <img src="@/assets/profile/woman.png" alt="User Avatar" class="avatar" />
          <h1 class="username">{{ auth.user?.email || 'User Email' }}</h1>
        </div>
        
        <ProfileForm />
        <ChangePasswordForm />
      </div>

      <!-- Right side - 2FA Configuration -->
      <div class="right-side">
        <TwoFactorSection />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileForm from '@/components/Profile/ProfileForm.vue'
import ChangePasswordForm from '@/components/Profile/ChangePasswordForm.vue'
import TwoFactorSection from '@/components/Profile/TwoFactorSection.vue'
import { useAuthStore } from '@/store/authStore'

const auth = useAuthStore()
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #FCF8ED;
  padding: 0;
  margin: 0;
}

.profile-container {
  display: flex;
  min-height: 100vh;
}

/* Left side - 50% width with cream background */
.left-side {
  flex: 1;
  background: #FCF8ED;
  padding: 40px;
  padding-top: 100px; /* Adjusted for header */
  overflow-y: auto;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.username {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* Right side - 50% width with primary color background */
.right-side {
  flex: 1;
  background: #3C68C2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  .left-side,
  .right-side {
    flex: none;
    min-height: 50vh;
  }
  
  .left-side {
    padding: 20px;
  }
  
  .right-side {
    padding: 20px;
  }
  
  .user-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .username {
    font-size: 1.5rem;
  }
}
</style>
