<template>
    <div class="bg-white rounded-lg shadow p-6">
        <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''"
            class="mb-4" />

        <!-- Filter dan Header -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <h2 class="text-xl font-semibold">📋 Daftar Servis</h2>
            <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Cari tipe/kerusakan..."
                        class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>

                <select v-model="statusFilter"
                    class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Semua Status</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Diterima">Diterima</option>
                    <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                    <option value="Selesai">Selesai</option>
                </select>

                <button @click="fetchServices"
                    class="px-4 py-2 bg-primary-600 text-blue-600 rounded-md hover:bg-primary-700 focus:outline-none flex items-center justify-center">
                    <i class="fas fa-sync-alt mr-2"></i> Refresh
                </button>
            </div>
        </div>

        <!-- Loading dan Error State -->
        <div v-if="isLoading" class="text-center py-10 text-gray-500">
            <i class="fas fa-spinner fa-spin mr-2"></i>Memuat data servis...
        </div>

        <div v-else-if="error" class="text-red-600 text-center py-10">{{ error }}</div>

        <div v-else-if="paginatedServices.length === 0" class="text-center text-gray-500 py-10">
            <i class="fas fa-exclamation-circle text-xl mr-2"></i>Tidak ada servis ditemukan
        </div>

        <!-- Table Daftar Servis -->
        <div v-else>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-blue-600 rounded-lg p-8 text-white">
                        <tr>
                            <th class="text-center py-3 px-4">Tipe Barang</th>
                            <th class="text-center py-3 px-4">Tanggal Servis</th>
                            <th class="text-center py-3 px-4">Status Servis</th>
                            <th class="text-center py-3 px-4">Status Pembayaran</th>
                            <th class="text-center py-3 px-4">Total Biaya</th>
                            <th class="text-center py-3 px-4">WhatsApp</th>
                            <th class="text-center py-3 px-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in paginatedServices" :key="service.id_servis"
                            class="bg-white divide-y divide-gray-400 hover:bg-gray-200">
                            <td class="py-3 px-4 text-center">{{ service.tipe_barang }}</td>
                            <td class="py-3 px-4 text-center">{{ formatDate(service.tanggal_servis) }}</td>
                            <td class="py-3 px-4 text-center">{{ service.status_servis }}</td>
                            <td class="py-3 px-4 text-center">
                                <span
                                    :class="service.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                                    class="px-2 py-1 rounded-full text-xs font-medium">
                                    {{ service.payment_status || 'unpaid' }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span v-if="service.total_biaya">
                                    Rp {{ Number(service.total_biaya).toLocaleString('id-ID') }}
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <div class="flex justify-center space-x-2">
                                    <a v-if="service.user?.no_hp"
                                        :href="`https://wa.me/${formatPhone(service.user.no_hp)}?text=${encodeURIComponent(generateMessage(service))}`"
                                        target="_blank" class="text-green-600 hover:text-green-800">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </td>
                            <td class="py-3 px-4 text-center">
                                <button @click="showDetail(service)"
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
                    Halaman {{ currentPage }} dari {{ totalPages }} | Total {{ filteredServices.length }} servis
                </div>
                <div class="flex gap-1">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded-md hover:bg-gray-100">&lt;</button>
                    <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                        :class="['px-3 py-1 border rounded-md', currentPage === page ? 'bg-blue-600 text-white' : '']">
                        {{ page }}
                    </button>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-3 py-1 border rounded-md hover:bg-gray-100">&gt;</button>
                </div>
            </div>
        </div>

        <!-- Modal Detail -->
        <ServiceDetailList :isOpen="selectedDetail !== null" :detail="selectedDetail" @close="selectedDetail = null"
            @updated="fetchServices" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import AppAlert from '~/components/ui/AppAlert.vue'
import ServiceDetailList from '~/components/teknisi/pages/ServiceListDetail.vue'

const { $api } = useNuxtApp()

const services = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const alert = ref({ message: '', type: 'info' })

const currentPage = ref(1)
const perPage = 10

const selectedDetail = ref(null)

const showDetail = (service) => {
    selectedDetail.value = service
}

const fetchServices = async () => {
    isLoading.value = true
    try {
        const res = await $api.get('/servis')
        services.value = res.data.data
    } catch (err) {
        error.value = 'Gagal memuat data servis'
        alert.value = { message: 'Gagal mengambil data servis', type: 'error' }
    } finally {
        isLoading.value = false
    }
}

const filteredServices = computed(() => {
    return services.value.filter(service => {
        const matchesSearch = !searchQuery.value ||
            service.tipe_barang?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            service.kerusakan?.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesStatus = !statusFilter.value ||
            service.status_servis === statusFilter.value

        return matchesSearch && matchesStatus
    })
})

const totalPages = computed(() => Math.ceil(filteredServices.value.length / perPage))

const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filteredServices.value.slice(start, start + perPage)
})

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
}

const formatPhone = (no) => no.replace(/^0/, '62')

const generateMessage = (service) => {
    return `Halo ${service.user?.name || ''}, \nkami menerima pengajuan servis Anda:\n\nBarang: ${service.tipe_barang}\nKerusakan: ${service.kerusakan}\nStatus: ${service.status_servis}`
}

onMounted(fetchServices)
</script>
