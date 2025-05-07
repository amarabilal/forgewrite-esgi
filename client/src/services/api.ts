import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.forgewrite.fr/api', // adapte selon ton backend
  headers: {
    'Content-Type': 'application/json'
  }
})
