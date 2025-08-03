import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (process.client) {
    auth.initFromLocalStorage()
    console.log('Token:', auth.token)
    if (!auth.token) {
      return navigateTo('/auth/login')
    }
    if (auth.role !== 'admin') {
      return navigateTo('/auth/unauthorized')
    }
  }
})