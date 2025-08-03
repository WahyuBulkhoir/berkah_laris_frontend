<template>
    <div class="max-w-md mx-auto mt-10 space-y-4">
        <h2 class="text-xl font-semibold">Reset Password</h2>
        <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <AppInput id="email" v-model="email" type="email" placeholder="Email terdaftar" :error="errors.email" />
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <AppInput id="password" v-model="password" type="password" placeholder="Minimal 6 karakter"
                    :error="errors.password" />
            </div>
            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi
                    Password</label>
                <AppInput id="password_confirmation" v-model="password_confirmation" type="password"
                    placeholder="Ulangi password" :error="errors.password_confirmation" />
            </div>
            <AppButton type="submit" :loading="loading" full>Reset Password</AppButton>
        </form>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import AppAlert from '~/components/ui/AppAlert.vue'
import AppInput from '~/components/ui/AppInput.vue'
import AppButton from '~/components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const loading = ref(false)
const errors = ref({})
const alert = ref({ message: '', type: '' })

const submit = async () => {
    loading.value = true
    alert.value.message = ''
    errors.value = {}

    const payload = {
        token: route.query.token,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value
    }

    try {
        const { $api } = useNuxtApp()
        await $api.post('/reset-password', payload)
        alert.value = {
            message: 'Password berhasil direset. Silakan login dengan password baru.',
            type: 'success'
        }
        setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err) {
        if (err.response?.status === 422) {
            errors.value = err.response.data.errors || {}
        } else {
            alert.value = {
                message: err.response?.data?.message || 'Terjadi kesalahan saat reset password.',
                type: 'error'
            }
        }
    } finally {
        loading.value = false
    }
}
</script>
