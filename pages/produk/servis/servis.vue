<template>
    <section class="py-12 px-4 max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Riwayat Servis Anda</h2>

        <!-- Tombol Refresh (hanya jika ada servis) -->
        <div v-if="servisList.length" class="text-right mb-4">
            <button @click="fetchUserServis" :disabled="isLoading"
                class="refresh-btn px-4 py-2 rounded-md text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                🔄 Refresh Servis
            </button>
        </div>

        <div v-if="isLoading" class="text-center text-gray-500 py-10">
            <i class="fas fa-spinner fa-spin mr-2"></i> Memuat data servis...
        </div>
        <div v-else-if="error" class="text-center text-red-600 py-10">
            <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
        </div>

        <!-- Daftar Servis -->
        <div v-else-if="servisList.length" class="space-y-6">
            <div v-for="servis in servisList" :key="servis.id_servis"
                class="p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-lg font-semibold text-blue-600">{{ servis.tipe_barang }}</h3>
                    <span :class="statusBadge(servis.status_servis)" class="text-xs font-medium px-3 py-1 rounded-full">
                        {{ servis.status_servis }}
                    </span>
                </div>
                <p class="text-gray-600"><strong>Kerusakan:</strong> {{ servis.kerusakan }}</p>
                <p class="text-gray-500 mt-1"><strong>Keterangan:</strong> {{ servis.ket_tambahan || '-' }}</p>
                <p class="text-gray-400 text-sm mt-2">Tanggal Servis: {{ servis.tanggal_servis }}</p>

                <NuxtLink :to="`/produk/servis/${servis.id_servis}`"
                    class="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    Lihat Detail
                </NuxtLink>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 py-10">
            <i class="fas fa-tools text-3xl mb-4"></i>
            <p>Belum ada pengajuan servis.</p>
            <NuxtLink to="/#servis"
                class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Ajukan Sekarang
            </NuxtLink>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { $api } = useNuxtApp()
const servisList = ref([])
const isLoading = ref(true)
const error = ref(null)

const fetchUserServis = async () => {
    isLoading.value = true
    error.value = null
    try {
        const res = await $api.get('/servis/riwayat')
        servisList.value = res.data.data || []
    } catch (err) {
        console.error('Gagal mengambil riwayat servis:', err)
        error.value = 'Gagal memuat riwayat servis.'
    } finally {
        isLoading.value = false
    }
}

const statusBadge = (status) => {
    switch (status) {
        case 'Diproses':
            return 'bg-yellow-100 text-yellow-800'
        case 'Diterima':
            return 'bg-blue-100 text-blue-800'
        case 'Dalam Perbaikan':
            return 'bg-purple-100 text-purple-800'
        case 'Selesai':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-gray-100 text-gray-600'
    }
}

onMounted(fetchUserServis)

definePageMeta({ layout: 'pelanggan', middleware: 'auth-pelanggan' })
</script>

<style scoped>
.refresh-btn {
    background-color: #0E2046;
    /* biru gelap */
}

.refresh-btn:hover:not(:disabled) {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    /* gradient biru, contoh */
}

.refresh-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.refresh-btn {
    transition: background-color 0.3s ease, background 0.3s ease;
}
</style>
