<template>
    <div class="max-w-md mx-auto mt-20 text-center">
        <p v-if="status === 'loading'" class="text-blue-500">Memverifikasi...</p>
        <app-alert v-else :type="status === 'success' ? 'success' : 'error'" :message="message" />
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
const route = useRoute()
const router = useRouter()
const status = ref('loading')
const message = ref('')

onMounted(async () => {
    try {
        const { $api } = useNuxtApp()
        const { id, hash } = route.query
        const res = await $api.get(`/email/verify/${id}/${hash}`)
        status.value = 'success'
        message.value = res.data.message

        setTimeout(() => {
            router.push('/auth/verify-success')
        }, 2000)
    } catch (err) {
        status.value = 'error'
        message.value = err.response?.data?.message || 'Verifikasi gagal'
    }
})
</script>
