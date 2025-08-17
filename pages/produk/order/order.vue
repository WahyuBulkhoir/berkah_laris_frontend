<template>
    <section id="order" class="max-w-7xl mx-auto px-4 py-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Daftar Pemesanan Anda</h2>

        <div v-if="isLoading" class="text-center text-gray-500 py-10">
            <i class="fas fa-spinner fa-spin mr-2"></i>Memuat pesanan...
        </div>

        <div v-else-if="pesanans.length === 0" class="text-center text-gray-500 py-10">
            <i class="fas fa-box-open text-3xl mb-4"></i>
            <p>Belum ada pemesanan.</p>
            <NuxtLink to="/produk" class="mt-4 inline-block btn-default px-4 py-2 rounded-md text-white font-semibold">
                Belanja Sekarang
            </NuxtLink>
        </div>

        <div v-else class="space-y-6">
            <div class="text-right">
                <button @click="fetchPesanans" class="mb-4 btn-default px-4 py-2 rounded-md text-white font-semibold">
                    🔄 Refresh Pemesanan
                </button>
            </div>
            <div v-for="pemesanan in pesanans" :key="pemesanan.id_pemesanan"
                class="p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">
                            Pemesanan #{{ pemesanan.id_pemesanan }}
                        </h3>
                        <p class="text-sm text-gray-500">Tanggal: {{ formatTanggal(pemesanan.tgl_pemesanan) }}</p>
                        <p class="text-sm text-gray-500">Status:
                            <span :class="statusClass(pemesanan.status_pesanan)">
                                {{ pemesanan.status_pesanan }}
                            </span>
                        </p>
                        <p class="text-sm text-gray-500">Pembayaran:
                            <span :class="pembayaranClass(pemesanan.payment_status)">
                                {{ pemesanan.payment_status }}
                            </span>
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-blue-700">Rp {{ formatHarga(pemesanan.total) }}</p>

                        <NuxtLink :to="`/produk/order/${pemesanan.id_pemesanan}`"
                            class="text-sm text-blue-600 hover:underline mt-2 inline-block">
                            Lihat Detail
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const { $api } = useNuxtApp()
const auth = useAuthStore()
const isLoading = ref(true)
const pesanans = ref([])

const fetchPesanans = async () => {
    isLoading.value = true
    try {
        const res = await $api.get('/pemesanan')
        pesanans.value = res.data.data || res.data
    } catch (err) {
        console.error('Gagal mengambil data pesanan:', err)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchPesanans)

const formatHarga = (val) => Number(val).toLocaleString('id-ID')
const formatTanggal = (val) => new Date(val).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})

const statusClass = (status) => {
    const classes = {
        'Pesanan Dibuat': 'text-yellow-600',
        'Pesanan Diproses': 'text-blue-600',
        'Diserahkan Kekurir': 'text-indigo-600',
        'Pesanan Dalam Perjalanan': 'text-orange-600',
        'Pesanan Sampai': 'text-green-600',
        'Selesai': 'text-gray-600'
    }
    return classes[status] || 'text-gray-500'
}

const pembayaranClass = (status) => {
    const colors = {
        paid: 'text-green-600',
        unpaid: 'text-red-600',
        failed: 'text-red-500'
    }
    return colors[status] || 'text-gray-500'
}

definePageMeta({
    layout: 'pelanggan',
    middleware: 'auth-pelanggan'
})
</script>

<style scoped>
.btn-default {
    background-color: #0E2046;
    box-shadow: 0 4px 8px rgba(20, 71, 230, 0.3);
    transition: background 0.3s ease;
    font-weight: 600;
}

.btn-default:hover {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    box-shadow: 0 6px 14px rgba(248, 123, 16, 0.5);
}
</style>
