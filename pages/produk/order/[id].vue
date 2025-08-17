<template>
    <section class="max-w-4xl mx-auto px-4 py-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">
            Detail Pemesanan #{{ pemesanan?.id_pemesanan }}
        </h2>

        <div v-if="isLoading" class="text-center text-gray-500 py-16">
            <i class="fas fa-spinner fa-spin mr-2 text-2xl"></i> Memuat detail pesanan...
        </div>

        <div v-else-if="!pemesanan" class="text-center text-red-500 py-16">
            <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
            <p class="text-lg font-medium">Data pemesanan tidak ditemukan.</p>
        </div>

        <div v-else class="bg-white rounded-lg shadow-md p-8 space-y-8 border border-gray-200">
            <!-- Info Pemesanan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <p class="text-sm text-gray-600">Tanggal Pemesanan:</p>
                    <p class="font-semibold text-gray-800 text-lg">
                        {{ formatTanggal(pemesanan.tgl_pemesanan) }}
                    </p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Status Pesanan:</p>
                    <p :class="'font-semibold text-lg ' + statusClass(pemesanan.status_pesanan)">
                        {{ pemesanan.status_pesanan }}
                    </p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Status Pembayaran:</p>
                    <p :class="'font-semibold text-lg ' + pembayaranClass(pemesanan.payment_status)">
                        {{ pemesanan.payment_status }}
                    </p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Total Pembayaran:</p>
                    <p class="font-bold text-blue-600 text-xl">
                        Rp {{ formatHarga(pemesanan.total) }}
                    </p>
                </div>
                <div class="md:col-span-2">
                    <p class="text-sm text-gray-600">Catatan Tambahan:</p>
                    <p class="text-gray-700 max-w-prose break-words">
                        {{ pemesanan.cat_opsional || '-' }}
                    </p>
                </div>

                <div v-if="pemesanan.payment_status === 'unpaid'" class="md:col-span-2 flex justify-center mt-6">
                    <button @click="lanjutkanPembayaran" :disabled="isLoadingBayar"
                        class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md transition disabled:opacity-60 inline-flex items-center justify-center font-semibold text-lg shadow-md">
                        <template v-if="isLoadingBayar">
                            <i class="fas fa-spinner fa-spin mr-3"></i> Memproses...
                        </template>
                        <template v-else>
                            <i class="fas fa-credit-card mr-3"></i> Selesaikan Pembayaran
                        </template>
                    </button>
                </div>
            </div>

            <!-- Info Penerima -->
            <section class="border-t pt-8 space-y-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Info Penerima</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <p class="text-sm text-gray-600">Nama Penerima:</p>
                        <p class="font-medium text-gray-800 text-lg">{{ pemesanan.nama_penerima }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">No. HP:</p>
                        <p class="font-medium text-gray-800 text-lg">{{ pemesanan.no_hp }}</p>
                    </div>
                    <div class="md:col-span-2">
                        <p class="text-sm text-gray-600">Alamat Tujuan:</p>
                        <p class="text-gray-800 text-lg max-w-prose break-words">{{ pemesanan.alamat }}</p>
                    </div>
                </div>
            </section>

            <!-- Produk yang Dipesan -->
            <section class="border-t pt-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Produk Dipesan</h3>
                <div class="divide-y divide-gray-300">
                    <div v-for="detail in pemesanan.details" :key="detail.id_detail"
                        class="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                            <p class="font-medium text-gray-800 text-lg">{{ detail.produk?.nama_produk }}</p>
                            <p class="text-sm text-gray-500 mt-1">
                                Jumlah: {{ detail.quantity }} x Rp {{ formatHarga(detail.harga_satuan) }}
                            </p>
                        </div>
                        <div class="font-semibold text-blue-700 text-lg mt-3 sm:mt-0 text-right">
                            Rp {{ formatHarga(detail.quantity * detail.harga_satuan) }}
                        </div>
                    </div>
                </div>
            </section>

            <div class="text-center mt-10">
                <NuxtLink to="/produk/order/order"
                    class="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-md font-semibold shadow-sm transition">
                    <i class="fas fa-arrow-left mr-2"></i> Kembali
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { $api, $config } = useNuxtApp()

const pemesanan = ref(null)
const isLoading = ref(true)
const isLoadingBayar = ref(false)

const formatHarga = (val) => Number(val).toLocaleString('id-ID')
const formatTanggal = (val) =>
    new Date(val).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

const statusClass = (status) => {
    const colorMap = {
        'Pesanan Dibuat': 'text-yellow-600',
        'Pesanan Diproses': 'text-blue-600',
        'Diserahkan Kekurir': 'text-indigo-600',
        'Pesanan Dalam Perjalanan': 'text-orange-600',
        'Pesanan Sampai': 'text-green-600',
        Selesai: 'text-gray-600'
    }
    return colorMap[status] || 'text-gray-500'
}

const pembayaranClass = (status) => {
    const colorMap = {
        paid: 'text-green-600',
        unpaid: 'text-red-600',
        failed: 'text-red-500'
    }
    return colorMap[status] || 'text-gray-500'
}

const loadSnapIfNeeded = async () => {
    if (typeof window.snap === 'undefined') {
        await new Promise((resolve, reject) => {
            const existingScript = document.getElementById('midtrans-script')
            if (existingScript) {
                existingScript.remove()
            }
            const script = document.createElement('script')
            script.id = 'midtrans-script'
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
            script.setAttribute('data-client-key', $config.public.midtransClientKey)
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
        })
    }
}

const lanjutkanPembayaran = async () => {
    isLoadingBayar.value = true
    try {
        await loadSnapIfNeeded()

        const res = await $api.get(`/pemesanan/${route.params.id}/snap-token`)
        const snapToken = res.data.snap_token

        if (!snapToken) {
            alert('Snap token tidak tersedia')
            return
        }

        if (typeof window.snap === 'undefined') {
            alert('Snap belum dimuat. Silakan coba lagi.')
            return
        }

        window.snap.pay(snapToken, {
            onSuccess: () => location.reload(),
            onPending: () => alert('Pembayaran tertunda'),
            onError: () => alert('Terjadi kesalahan pembayaran'),
            onClose: () => {
                alert('Anda menutup pembayaran sebelum menyelesaikannya')
            }
        })
    } catch (err) {
        console.error('Gagal mengambil Snap token:', err)
        alert('Gagal memproses pembayaran ulang.')
    } finally {
        isLoadingBayar.value = false
    }
}

onMounted(async () => {
    try {
        const res = await $api.get(`/pemesanan/${route.params.id}`)
        pemesanan.value = res.data.data || res.data
    } catch (err) {
        console.error('Gagal mengambil detail pesanan:', err)
    } finally {
        isLoading.value = false
    }
})

definePageMeta({
    layout: 'pelanggan',
    middleware: 'auth-pelanggan'
})
</script>
