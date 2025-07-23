<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left side - Image -->
      <div class="left-side">
        <div class="content-wrapper">
          <div class="welcome-text">
            <h1>Bienvenue !</h1>
            <h1>Votre aventure littéraire commence ici</h1>
            <p>Rejoignez des milliers d'auteurs qui utilisent ForgeWrite pour donner vie à leurs histoires. Créez,
              organisez et perfectionnez vos manuscrits avec nos outils d'écriture innovants.</p>
          </div>
          <div class="illustration-container">
            <img src="@/assets/icons/il_register.png" alt="Illustration d'inscription" class="register-illustration" />
          </div>
        </div>
      </div>

      <!-- Right side - Form -->
      <div class="right-side">
        <div class="form-container">
          <!-- Google Login (disabled) -->
          <button class="google-button" disabled>
            <div class="google-icon">G</div>
            Continuer avec Google
          </button>

          <div class="divider">
            <span>ou</span>
          </div>

          <form @submit.prevent="handleRegister" class="register-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="email" type="email" required class="form-input" />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input id="password" v-model="password" type="password" required class="form-input" />
            </div>

            <button type="submit" class="submit-button">
              Créer un compte
            </button>
          </form>

          <p class="login-link">
            Vous avez déjà un compte ?
            <router-link to="/login" class="link">Se connecter</router-link>
          </p>

          <p v-if="success" class="success">{{ success }}</p>
          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const pseudo = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()

const { proxy } = getCurrentInstance()!
const matomo = proxy?.$matomo

const handleRegister = async () => {
  try {
    error.value = ''
    success.value = ''

    const res = await api.post('/auth/register', {
      email: email.value,
      password: password.value,
    })

    matomo?.trackEvent('user', 'signup')

    success.value = res.data.message
    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur inconnue.'
  }
}
</script>


<style scoped>
.register-page {
  min-height: 100vh;
  background: #FCF8ED;
  padding: 0;
  margin: 0;
}

.register-container {
  display: flex;
  min-height: 100vh;
}

/* Left side - 50% width with primary color */
.left-side {
  flex: 1;
  background: #3C68C2;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 40px;
  position: relative;
}

.welcome-text {
  color: #FCF8ED;
  z-index: 2;
}

.welcome-text h1 {
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  line-height: 1.2;
}

.welcome-text h2 {
  font-size: 2rem;
  font-weight: normal;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.welcome-text p {
  font-family: Hauora, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
}

.illustration-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}

.register-illustration {
  max-width: 80%;
  max-height: 500px;
  object-fit: contain;
}

/* Right side - 50% width with form */
.right-side {
  flex: 1;
  background: #FCF8ED;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow-y: auto;
}

.form-container {
  max-width: 400px;
  width: 100%;
}

.google-button {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 16px;
  cursor: not-allowed;
  opacity: 0.6;
  margin-bottom: 20px;
  transition: all 0.2s;
}

.google-icon {
  width: 20px;
  height: 20px;
  background: #4285F4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.divider {
  font-family: Hauora, sans-serif;
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #E5E5E5;
  z-index: 1;
}

.divider span {
  background: #FCF8ED;
  padding: 0 15px;
  color: #666;
  font-size: 14px;
  position: relative;
  z-index: 2;
}

.register-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-family: Hauora, sans-serif;
  display: block;
  margin-bottom: 8px;
  color: #3C68C2;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #E9E7E8;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3C68C2;
}

.form-input::placeholder {
  color: #888;
}

.submit-button {
  width: 100%;
  padding: 14px;
  background: #3C68C2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin: 20px 0;
}

.submit-button:hover {
  background: #2E5AB8;
}

.login-link {
  font-family: Hauora, sans-serif;
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 20px;
}

.login-link .link {
  color: #3C68C2;
  text-decoration: none;
  font-weight: 500;
}

.login-link .link:hover {
  text-decoration: underline;
}

.success {
  color: #28a745;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .left-side,
  .right-side {
    flex: none;
  }

  .left-side {
    min-height: 40vh;
  }

  .content-wrapper {
    padding: 40px 20px;
  }

  .welcome-text h1 {
    font-size: 2rem;
  }

  .welcome-text h2 {
    font-size: 1.5rem;
  }

  .right-side {
    padding: 20px;
  }
}
</style>
