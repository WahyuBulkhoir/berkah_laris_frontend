import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    role: null,
    isLoggingOut: false
  }),

  actions: {
    async loginUser(credentials) {
      const { $api } = useNuxtApp()
      try {
        const res = await $api.post('/login', credentials)
        const { user, role, token } = res.data

        if (user.role_id === 2 && !user.email_verified_at) {
          throw {
            response: {
              status: 403,
              data: {
                message: 'Email Anda belum diverifikasi. Silakan cek inbox Anda dan klik link verifikasi.'
              }
            }
          }
        }

        this.user = user
        this.role = role
        this.token = token

        if (process.client) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('role', role)
          console.log('✅ Login berhasil, token disimpan di localStorage.')
        }
      } catch (error) {
        console.error('🔴 Gagal login:', error.response?.data)
        throw error
      }
    },

    async registerUser(formData) {
      const { $api } = useNuxtApp()
      try {
        await $api.post('/register', { ...formData })
        console.log('📩 Registrasi berhasil, link verifikasi dikirim ke email.')
      } catch (error) {
        console.error('🔴 Gagal register:', error.response?.data)
        throw error
      }
    },

    async logoutUser() {
      const { $api } = useNuxtApp()
      this.isLoggingOut = true

      try {
        await $api.post('/logout')
        console.log('✅ Logout berhasil di backend.')
      } catch (error) {
        console.warn('⚠️ Logout gagal atau token sudah tidak valid:', error.response?.data || error.message)
      }

      this.user = null
      this.token = null
      this.role = null

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        console.log('🧹 Data login dibersihkan dari localStorage.')
      }

      this.isLoggingOut = false
    },

    initFromLocalStorage() {
      if (!process.client) return

      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      const role = localStorage.getItem('role')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.role = role
        console.log('🔄 State auth dimuat dari localStorage.')
      }
    }
  }
})
