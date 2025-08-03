import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if (process.client) {
        auth.initFromLocalStorage()
        console.log('Token:', auth.token)
        if (!auth.token) {
            return
        }
        if (auth.role !== 'pelanggan') {
            return navigateTo('/auth/unauthorized')
        }
    }
})
