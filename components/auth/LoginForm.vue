<template>
    <div class="space-y-4">
        <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

        <form @submit.prevent="login" class="space-y-6">
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <AppInput id="username" v-model="username" type="text" placeholder="username anda"
                    :error="errors.username" />
            </div>

            <div>
                <div class="flex justify-between items-center mb-1">
                    <label for="password" class="text-sm font-medium text-gray-700">Password</label>
                    <NuxtLink to="/auth/password/forgot-password" class="text-xs text-blue-600 hover:underline">
                        Lupa password ?
                    </NuxtLink>
                </div>
                <AppInput id="password" v-model="password" type="password" placeholder="Password"
                    :error="errors.password" />
            </div>

            <AppButton type="submit" :loading="loading" full>Masuk</AppButton>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import AppInput from '~/components/ui/AppInput.vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppAlert from '~/components/ui/AppAlert.vue'

const username = ref('')
const password = ref('')
const loading = ref(false)
const errors = ref({})
const alert = ref({ message: '', type: '' })

const router = useRouter()
const auth = useAuthStore()

const validateForm = () => {
    errors.value = {}

    if (!username.value) errors.value.username = 'Username wajib diisi.'
    if (!password.value) errors.value.password = 'Password wajib diisi.'

    return Object.keys(errors.value).length === 0
}

const login = async () => {
    alert.value.message = ''
    errors.value = {}
    loading.value = true

    if (!validateForm()) {
        alert.value = {
            message: 'Mohon isi semua field dengan benar.',
            type: 'error'
        }
        loading.value = false
        return
    }

    try {
        const credentials = {
            username: username.value,
            password: password.value
        }

        console.log('📤 Login credentials:', credentials)
        await auth.loginUser(credentials)

        // Redirect sesuai role
        if (auth.role === 'admin') {
            router.push('/admin')
        } else if (auth.role === 'pelanggan') {
            router.push('/')
        } else if (auth.role === 'teknisi') {
            router.push('/teknisi')
        } else {
            router.push('/unauthorized')
        }

    } catch (err) {
        if (err.response?.status === 422) {
            errors.value = err.response.data.errors || {}
            alert.value = {
                message: 'Validasi gagal. Periksa input Anda.',
                type: 'error'
            }
        } else if (err.response?.status === 403) {
            alert.value = {
                message: err.response.data.message || 'Akun Anda belum diverifikasi. Cek email Anda.',
                type: 'error'
            }
        } else {
            alert.value = {
                message: err.response?.data?.message || 'Username atau password salah.',
                type: 'error'
            }
        }
    } finally {
        loading.value = false
    }
}
</script>