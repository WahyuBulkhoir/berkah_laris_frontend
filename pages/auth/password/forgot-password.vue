<template>
    <div class="max-w-md mx-auto mt-10 space-y-4">
        <h2 class="text-xl font-semibold">Lupa Password</h2>
        <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <AppInput id="email" v-model="email" type="email" placeholder="Masukkan email terdaftar"
                    :error="errors.email" />
            </div>
            <AppButton type="submit" :loading="loading" full>Kirim Link Reset</AppButton>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AppAlert from '~/components/ui/AppAlert.vue'
import AppInput from '~/components/ui/AppInput.vue'
import AppButton from '~/components/ui/AppButton.vue'

const email = ref('')
const loading = ref(false)
const alert = ref({ message: '', type: '' })
const errors = ref({})

const submit = async () => {
    alert.value.message = ''
    errors.value = {}
    loading.value = true

    try {
        const { $api } = useNuxtApp()
        await $api.post('/forgot-password', { email: email.value })
        alert.value = {
            message: 'Link reset password berhasil dikirim ke email Anda.',
            type: 'success'
        }
    } catch (err) {
        if (err.response?.status === 422) {
            errors.value = err.response.data.errors || {}
        } else {
            alert.value = {
                message: err.response?.data?.message || 'Terjadi kesalahan saat mengirim email.',
                type: 'error'
            }
        }
    } finally {
        loading.value = false
    }
}
</script>