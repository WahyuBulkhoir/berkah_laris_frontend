<template>
    <section class="py-12 px-4 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Detail Servis</h2>
        <div v-if="isLoading" class="text-center text-gray-500 py-10 animate-pulse">
            <i class="fas fa-spinner fa-spin mr-2"></i> Memuat detail servis...
        </div>
        <div v-else-if="error" class="text-center text-red-600 py-10">
            <i class="fas fa-exclamation-triangle mr-2"></i> {{ error }}
        </div>
        <div v-else-if="servis"
            class="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">

            <div class="grid sm:grid-cols-2 gap-6">
                <div>
                    <p class="text-gray-700 mb-2">
                        <span class="font-semibold text-gray-900">Tipe Barang:</span>
                        {{ servis.tipe_barang }}
                    </p>
                    <p class="text-gray-700 mb-2">
                        <span class="font-semibold text-gray-900">Kerusakan:</span>
                        {{ servis.kerusakan }}
                    </p>
                    <p class="text-gray-700 mb-2">
                        <span class="font-semibold text-gray-900">Keterangan Tambahan:</span>
                        {{ servis.ket_tambahan || '-' }}
                    </p>
                </div>

                <div>
                    <p class="text-gray-700 mb-2">
                        <span class="font-semibold text-gray-900">Tanggal Servis:</span>
                        {{ servis.tanggal_servis }}
                    </p>
                    <p class="text-gray-700 mb-2">
                        <span class="font-semibold text-gray-900">Status Servis:</span>
                        <span :class="statusBadge(servis.status_servis)"
                            class="ml-2 px-2 py-1 rounded-full text-sm font-medium inline-block">
                            {{ servis.status_servis }}
                        </span>
                    </p>
                    <p class="text-gray-700 mb-2">
                        <span class="font-semibold text-gray-900">Status Pembayaran:</span>
                        <span :class="badgeClass(servis.payment_status)"
                            class="ml-2 px-2 py-1 rounded-full text-sm font-medium inline-block">
                            {{ servis.payment_status || '-' }}
                        </span>
                    </p>
                    <p class="text-gray-500 text-sm mt-4">Terakhir diperbarui: {{
                        formatTanggal(servis.updated_at) }}
                    </p>
                </div>
            </div>

            <!-- Total Biaya dan Bayar -->
            <div v-if="servis.status_servis === 'Selesai' && servis.payment_status === 'unpaid'"
                class="mt-8 border-t pt-6">
                <p class="text-gray-700 text-lg mb-4">
                    <span class="font-semibold text-gray-900">Total Biaya:</span>
                    Rp {{ Number(servis.total_biaya).toLocaleString('id-ID') }}
                </p>
                <button @click="payNow" :disabled="isLoadingPay"
                    class="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md shadow transition disabled:opacity-50">
                    <template v-if="isLoadingPay">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Memproses...</span>
                    </template>
                    <template v-else>
                        <i class="fas fa-credit-card"></i>
                        <span>Bayar Sekarang</span>
                    </template>
                </button>
            </div>

            <!-- Tombol WhatsApp -->
            <div class="mt-20 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <div class="text-center sm:text-left w-full sm:w-auto">
                    <NuxtLink to="/produk/servis/servis"
                        class="w-full sm:w-auto inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-center">
                        <i class="fas fa-arrow-left mr-1"></i> Kembali
                    </NuxtLink>
                </div>

                <a :href="whatsappLink" target="_blank"
                    class="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition text-center">
                    <i class="fab fa-whatsapp"></i>
                    Hubungi Teknisi
                </a>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const { $api } = useNuxtApp()
const route = useRoute()
const servis = ref(null)
const isLoading = ref(true)
const error = ref(null)
const adminWaNumber = '6282267773165'
const isLoadingPay = ref(false)

const fetchDetailServis = async () => {
    isLoading.value = true
    error.value = null
    try {
        const res = await $api.get(`/servis/${route.params.id}`)
        servis.value = res.data.data || res.data
    } catch (err) {
        console.error(err)
        error.value = 'Gagal memuat detail servis.'
    } finally {
        isLoading.value = false
    }
}

const payNow = async () => {
    try {
        isLoadingPay.value = true
        const res = await $api.get(`/servis/${route.params.id}/snap`)
        if (!window.snap) {
            alert('Gagal memuat Snap Midtrans. Silakan refresh halaman.')
            return
        }
        window.snap.pay(res.data.token, {
            onSuccess: () => fetchDetailServis(),
            onPending: () => console.log('Menunggu pembayaran...'),
            onError: () => alert('Gagal memproses pembayaran'),
            onClose: () => console.log('Popup ditutup')
        })
    } catch (err) {
        alert('Gagal mendapatkan token pembayaran')
        console.error(err)
    } finally {
        isLoadingPay.value = false
    }
}

const formatTanggal = (val) => new Date(val).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})

const statusBadge = (status) => {
    switch (status) {
        case 'Diproses': return 'bg-yellow-100 text-yellow-800'
        case 'Diterima': return 'bg-blue-100 text-blue-800'
        case 'Dalam Perbaikan': return 'bg-purple-100 text-purple-800'
        case 'Selesai': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-600'
    }
}

const badgeClass = (status) => {
    if (status === 'paid') return 'bg-green-100 text-green-800'
    if (status === 'unpaid') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-600'
}

const whatsappLink = computed(() => {
    if (!servis.value) return '#'
    const pesan = `Halo Teknisi, saya ingin menanyakan status servis berikut:\n\n` +
        `🛠️ Tipe Barang: ${servis.value.tipe_barang}\n` +
        `🚨 Kerusakan: ${servis.value.kerusakan}\n` +
        `📝 Keterangan: ${servis.value.ket_tambahan || '-'}\n` +
        `📅 Tanggal Servis: ${servis.value.tanggal_servis}`
    return `https://wa.me/${adminWaNumber}?text=${encodeURIComponent(pesan)}`
})

onMounted(() => {
    fetchDetailServis()

    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', 'Mid-client-24PEmc-anspQS7Rn')
    document.head.appendChild(script)
})

definePageMeta({ layout: 'pelanggan', middleware: 'auth-pelanggan' })
</script>
