<template>
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow-md text-center">
            <h2 class="text-2xl font-bold text-gray-800">Verifikasi Email Anda</h2>
            <p class="text-gray-600">Kami telah mengirimkan email verifikasi ke alamat Anda. Silakan cek Gmail Anda.</p>

            <button @click="resendVerification"
                class="w-full py-2 px-4 bg-[#0E2046] text-white rounded-lg hover:bg-gradient-to-t from-[#F87B10] to-[#FEB10B] transition-all"
                :disabled="loading">
                {{ loading ? 'Mengirim ulang...' : 'Kirim Ulang Verifikasi' }}
            </button>

            <p v-if="success" class="text-green-600 text-sm mt-2">{{ success }}</p>
            <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const loading = ref(false)
const success = ref('')
const error = ref('')
const auth = useAuthStore()

const resendVerification = async () => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
        await auth.api.post('/email/resend', null, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
        success.value = 'Link verifikasi berhasil dikirim ulang ke email Anda.'
    } catch (err) {
        error.value = err.response?.data?.message || 'Gagal mengirim ulang verifikasi email.'
    } finally {
        loading.value = false
    }
}
</script>
