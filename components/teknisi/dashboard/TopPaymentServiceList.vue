<template>
    <div class="space-y-4">
        <div v-if="loading" v-for="i in 3" :key="'skeleton-' + i" class="animate-pulse h-10 bg-gray-200 rounded-lg">
        </div>

        <div v-else-if="paymentMethods.length === 0" class="text-sm text-gray-500">
            Tidak ada data metode pembayaran.
        </div>

        <div v-else v-for="(item, index) in paymentMethods" :key="index" class="flex items-center">
            <div
                :class="`bg-${colors[index % colors.length]}-100 rounded-lg h-10 w-10 flex items-center justify-center mr-3`">
                <i :class="`${icons[index % icons.length]} text-${colors[index % colors.length]}-600`"></i>
            </div>
            <div class="flex-1">
                <div class="flex justify-between">
                    <span class="font-medium">{{ item.name }}</span>
                    <span class="text-gray-500">{{ item.count }} servis</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div :class="`bg-${colors[index % colors.length]}-600 h-1.5 rounded-full`"
                        :style="{ width: getPercentage(item.count) + '%' }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $api } = useNuxtApp()
const paymentMethods = ref([])
const loading = ref(true)

const colors = ['blue', 'green', 'red']
const icons = [
    'fas fa-credit-card',
    'fas fa-wallet',
    'fas fa-money-bill',
    'fas fa-university',
    'fas fa-qrcode'
]

const getPercentage = (value) => {
    const max = Math.max(...paymentMethods.value.map(p => p.count))
    return max ? (value / max) * 100 : 0
}

const fetchTopPaymentMethods = async () => {
    loading.value = true
    try {
        const res = await $api.get('/dashboard/teknisi/top-payment-methods')
        paymentMethods.value = res.data
    } catch (err) {
        console.error('Gagal memuat data metode pembayaran:', err)
    } finally {
        loading.value = false
    }
}

onMounted(fetchTopPaymentMethods)
</script>
