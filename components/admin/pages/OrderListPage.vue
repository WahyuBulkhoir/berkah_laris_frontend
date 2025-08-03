<template>
    <div class="bg-white rounded-lg shadow p-6">
        <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''"
            class="mb-4" />

        <!-- Search & Filter -->
        <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <h2 class="text-xl font-semibold">🧾 Daftar Pemesanan</h2>
            <div class="flex flex-col md:flex-row gap-3">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Cari nama pelanggan..."
                        class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
                <select v-model="statusFilter"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Semua Status</option>
                    <option value="Pesanan Dibuat">Pesanan Dibuat</option>
                    <option value="Pesanan Diproses">Pesanan Diproses</option>
                    <option value="Diserahkan Kekurir">Diserahkan Kekurir</option>
                    <option value="Pesanan Dalam Perjalanan">Pesanan Dalam Perjalanan</option>
                    <option value="Pesanan Sampai">Pesanan Sampai</option>
                    <option value="Selesai">Selesai</option>
                </select>

                <button @click="fetchPemesanan"
                    class="px-4 py-2 bg-primary-600 text-blue-600 rounded-md hover:bg-primary-700 focus:outline-none flex items-center justify-center">
                    <i class="fas fa-sync-alt mr-2"></i> Refresh
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-10 text-gray-500">
            <i class="fas fa-spinner fa-spin mr-2"></i>Memuat data pemesanan...
        </div>

        <!-- Tidak Ada Data -->
        <div v-else-if="filteredPemesanan.length === 0" class="text-center text-gray-500 py-10">
            <i class="fas fa-exclamation-circle text-xl mr-2"></i>Tidak ada pemesanan ditemukan.
        </div>

        <!-- Tabel -->
        <div v-else class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-blue-600 text-white">
                    <tr>
                        <th class="text-center px-4 py-3">Nama Pelanggan</th>
                        <th class="text-center px-4 py-3">Tanggal</th>
                        <th class="text-center px-4 py-3">Total</th>
                        <th class="text-center px-4 py-3">Status</th>
                        <th class="text-center px-4 py-3">Pembayaran</th>
                        <th class="text-center px-4 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pesan in paginatedPemesanan" :key="pesan.id_pemesanan"
                        class="bg-white divide-y divide-gray-200 hover:bg-gray-100">
                        <td class="py-3 px-4 text-center">{{ pesan.nama_penerima }}</td>
                        <td class="py-3 px-4 text-center">{{ formatDate(pesan.tgl_pemesanan) }}</td>
                        <td class="py-3 px-4 text-center">Rp {{ pesan.total.toLocaleString('id-ID') }}</td>
                        <td class="py-3 px-4 text-center">
                            <div v-if="pesan.status_pesanan === 'Selesai' && pesan.payment_status === 'paid'"
                                class="text-sm font-medium text-gray-700">
                                {{ pesan.status_pesanan }}
                            </div>
                            <select v-else v-model="pesan.status_pesanan" @change="updateStatus(pesan)"
                                class="px-2 py-1 border rounded-md focus:ring-blue-500 focus:outline-none text-sm">
                                <option value="Pesanan Dibuat">Pesanan Dibuat</option>
                                <option value="Pesanan Diproses">Pesanan Diproses</option>
                                <option value="Diserahkan Kekurir">Diserahkan Kekurir</option>
                                <option value="Pesanan Dalam Perjalanan">Pesanan Dalam Perjalanan</option>
                                <option value="Pesanan Sampai">Pesanan Sampai</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </td>
                        <td class="py-3 px-4 text-center">
                            <span :class="badgeClass(pesan.payment_status)">
                                {{ pesan.payment_status }}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-center">
                            <button @click="openDetailModal(pesan)"
                                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                                <i class="fas fa-eye mr-1"></i> Lihat Detail
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div class="text-sm text-gray-500">
                Halaman {{ currentPage }} dari {{ totalPages }} | Total {{ filteredPemesanan.length }} pemesanan
            </div>
            <div class="flex gap-1">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-3 py-1 border rounded-md hover:bg-gray-100">
                    &lt;
                </button>
                <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                    :class="['px-3 py-1 border rounded-md', currentPage === page ? 'bg-blue-600 text-white' : '']">
                    {{ page }}
                </button>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-3 py-1 border rounded-md hover:bg-gray-100">
                    &gt;
                </button>
            </div>
        </div>

        <!-- Modal Detail -->
        <OrderListDetail :isOpen="showDetailModal" :detail="selectedPemesanan" @close="showDetailModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppAlert from '~/components/ui/AppAlert.vue'
import OrderListDetail from '~/components/admin/pages/OrderListDetailPage.vue'
const { $api } = useNuxtApp()

const pemesanan = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const loading = ref(true)
const alert = ref({ message: '', type: 'info' })

const currentPage = ref(1)
const perPage = 10

const selectedPemesanan = ref(null)
const showDetailModal = ref(false)

const fetchPemesanan = async () => {
    loading.value = true
    try {
        const res = await $api.get('/pemesanan', {
            params: {
                search: searchQuery.value
            }
        })
        pemesanan.value = res.data.data
    } catch (err) {
        alert.value = { message: 'Gagal mengambil data pemesanan', type: 'error' }
    } finally {
        loading.value = false
    }
}

const filteredPemesanan = computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase()
    return pemesanan.value.filter((p) => {
        const namaPenerima = (p.nama_penerima || '').toLowerCase()
        const namaUser = (p.user?.name || '').toLowerCase()
        const matchNama = namaPenerima.includes(keyword) || namaUser.includes(keyword)
        const matchStatus = statusFilter.value ? p.status_pesanan === statusFilter.value : true
        return matchNama && matchStatus
    })
})

watch([searchQuery, statusFilter], () => {
    currentPage.value = 1
    fetchPemesanan()
})

const totalPages = computed(() => Math.ceil(filteredPemesanan.value.length / perPage))
const paginatedPemesanan = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredPemesanan.value.slice(start, start + perPage)
})

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const updateStatus = async (pesan) => {
    try {
        await $api.put(`/pemesanan/${pesan.id_pemesanan}`, { status_pesanan: pesan.status_pesanan })
        alert.value = { message: 'Status pemesanan berhasil diperbarui.', type: 'success' }
    } catch (error) {
        alert.value = { message: 'Gagal memperbarui status.', type: 'error' }
    }
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})

const badgeClass = (status) => {
    switch (status) {
        case 'paid':
            return 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs'
        case 'unpaid':
            return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs'
        default:
            return 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs'
    }
}

const openDetailModal = (pesan) => {
    selectedPemesanan.value = pesan
    showDetailModal.value = true
}

onMounted(fetchPemesanan)
</script>
