<template>
  <div class="two-fa-setup">
    <h3>
      Configuration 2FA
      <img src="@/assets/icons/secu-ico.svg" alt="Security" class="icon" />
    </h3>

    <div v-if="!qrcode" class="enable-section">
      <button @click="enable2FA" class="enable-button">Activer la double authentification</button>
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
.two-fa-setup {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.two-fa-setup h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.enable-section {
  margin: 30px 0;
}

.enable-button {
  background: white;
  color: #3C68C2;
  border: 2px solid white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.enable-button:hover {
  background: transparent;
  color: white;
}

.qr-section {
  margin-top: 1rem;
  text-align: center;
}

.qr-section p {
  color: white;
  margin-bottom: 20px;
}

.qr-section img {
  background: white;
  padding: 10px;
  border-radius: 8px;
  margin: 20px 0;
}

.secret {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.secret strong {
  color: #FCF8ED;
}

.warning {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #FCF8ED;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #FCF8ED;
}

.error {
  color: #FFB3B3;
  background: rgba(255, 179, 179, 0.1);
  border: 1px solid rgba(255, 179, 179, 0.3);
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 1rem;
}

.icon {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 8px;
  filter: brightness(0) invert(1);
}
</style>
