<template>
  <div class="two-fa-setup">
    <h3>📱 Configuration 2FA</h3>

    <div v-if="!qrcode">
      <button @click="enable2FA">Activer la double authentification</button>
    </div>

    <div v-else class="qr-section">
      <p>📸 Scannez ce QR code dans votre application d’authentification (Google Authenticator, etc.).</p>
      <img :src="qrcode" alt="QR Code" />

      <p class="secret">🔐 Clé secrète : <strong>{{ secret }}</strong></p>

      <p class="warning">
        ⚠️ Sauvegardez cette clé dans un endroit sûr. Elle vous permettra de retrouver l’accès à votre compte en cas de changement d’appareil.
      </p>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'
import QRCode from 'qrcode'

const qrcode = ref('')
const secret = ref('')
const error = ref('')

const enable2FA = async () => {
  try {
    error.value = ''
    const res = await api.post('/auth/enable-2fa')
    secret.value = res.data.secret

    // Génère un QR Code base64 à partir de l'otpauth_url
    qrcode.value = await QRCode.toDataURL(res.data.otpauth_url)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors de l’activation du 2FA.'
  }
}
</script>

<style scoped>
.qr-section {
  margin-top: 1rem;
  text-align: center;
}
.secret {
  margin-top: 1rem;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
}
.warning {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #a03c3c;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
