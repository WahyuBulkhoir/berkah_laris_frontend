<template>
    <div class="bg-white rounded-lg shadow p-6">

        <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''"
            class="mb-4" />

        <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <h2 class="text-xl font-semibold">📦 Daftar Produk</h2>
            <div class="flex flex-col md:flex-row gap-3">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Cari produk/sku..."
                        class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
                <select v-model="filterKategori"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Semua Kategori</option>
                    <option v-for="kategori in kategoris" :key="kategori.id_kategori" :value="kategori.id_kategori">
                        {{ kategori.nama_kategori }} ({{ kategori.tipe_produk }})
                    </option>
                </select>
                <button @click="fetchProducts"
                    class="px-4 py-2 bg-primary-600 text-[#0E2046] rounded-md hover:bg-primary-700 focus:outline-none flex items-center justify-center">
                    <i class="fas fa-sync-alt mr-2"></i> Refresh
                </button>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-10 text-gray-500">
            <i class="fas fa-spinner fa-spin mr-2"></i>Memuat data produk...
        </div>

        <div v-else-if="error" class="text-red-600 text-center py-10">
            {{ error }}
        </div>

        <div v-else-if="filteredProducts.length === 0" class="text-center text-gray-500 py-10">
            <i class="fas fa-exclamation-circle text-xl mr-2"></i>Tidak ada produk ditemukan untuk pencarian atau filter
            saat ini.
        </div>

        <div v-else class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-[#0E2046] rounded-lg p-8 text-white">
                    <tr>
                        <th class="text-center px-4 py-3">Produk</th>
                        <th class="text-center px-4 py-3">SKU</th>
                        <th class="text-center px-4 py-3">Kategori</th>
                        <th class="text-center px-4 py-3">Harga</th>
                        <th class="text-center px-4 py-3">Stok</th>
                        <th class="text-center px-4 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="produk in filteredProducts" :key="produk.id"
                        class="bg-white divide-y divide-gray-400 hover:bg-gray-200">
                        <td class="px-4 py-3 flex items-center gap-3">
                            <img v-if="produk.gambar_produk"
                                :src="`http://localhost:8000/storage/${produk.gambar_produk}`"
                                class="w-10 h-10 object-cover rounded-md" />
                            <span>{{ produk.nama_produk }}</span>
                        </td>
                        <td class="py-3 px-4 text-center">{{ produk.sku }}</td>
                        <td class="py-3 px-4 text-center">{{ produk.kategori?.nama_kategori }}</td>
                        <td class="py-3 px-4 text-center">Rp {{ Number(produk.harga).toLocaleString("id-ID") }}</td>
                        <td class="py-3 px-4 text-center">{{ produk.stok }}</td>
                        <td class="py-3 px-4 text-center justify-center">
                            <div class="flex space-x-2">
                                <button @click="openEditModal(produk)" class="text-[#0E2046] hover:text-blue-800">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="confirmDelete(produk.id_produk)"
                                    class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div class="text-sm text-gray-500">
                Halaman {{ currentPage }} dari {{ totalPages }} | Total {{ totalItems }} produk
            </div>
            <div class="flex gap-1">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-3 py-1 border rounded-md hover:bg-gray-100">&lt;</button>
                <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                    :class="['px-3 py-1 border rounded-md', currentPage === page ? 'bg-[#0E2046] text-white' : '']">
                    {{ page }}
                </button>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-3 py-1 border rounded-md hover:bg-gray-100">&gt;</button>
            </div>
        </div>

        <div v-if="isEditing"
            class="fixed inset-0 z-50 bg-blend-color bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
            <div class="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden relative animate-fade-in">
                <div class="flex justify-between items-center px-6 py-4"
                    style="background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);">
                    <h2 class="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <i class="fas fa-edit"></i> Edit Produk
                    </h2>
                    <button @click="isEditing = false" class="text-white hover:text-red-400 text-2xl font-bold">
                        &times;
                    </button>
                </div>

                <div class="p-6 space-y-4 text-gray-700 text-sm md:text-base">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-3">
                            <div>
                                <label class="text-sm text-gray-600">Nama Produk</label>
                                <input v-model="editForm.nama_produk" placeholder="Nama"
                                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                            </div>
                            <div>
                                <label class="text-sm text-gray-600">SKU</label>
                                <input v-model="editForm.sku" placeholder="SKU"
                                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                            </div>
                            <div>
                                <label class="text-sm text-gray-600">Kategori</label>
                                <select v-model="editForm.id_kategori"
                                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option v-for="kategori in kategoris" :key="kategori.id_kategori"
                                        :value="kategori.id_kategori">
                                        {{ kategori.nama_kategori }} ({{ kategori.tipe_produk }})
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="text-sm text-gray-600">Modal Produk</label>
                                <input v-model="editForm.modal" type="number" placeholder="Modal"
                                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <label class="text-sm text-gray-600">Harga</label>
                                <input v-model="editForm.harga" type="number" placeholder="Harga"
                                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                            </div>
                            <div>
                                <label class="text-sm text-gray-600">Stok</label>
                                <input v-model="editForm.stok" type="number" placeholder="Stok"
                                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                            </div>
                            <div>
                                <label class="text-sm text-gray-600">Gambar Produk</label>
                                <input type="file" @change="handleEditImageChange"
                                    class="w-full px-2 py-1 border rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#0E2046] file:text-white file:rounded-md file:text-sm" />
                                <img v-if="editImagePreview"
                                    :src="editImagePreview.startsWith('blob:') ? editImagePreview : `http://localhost:8000/storage/${editImagePreview}`"
                                    class="w-24 h-24 object-cover mt-3 rounded-md border" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="text-sm text-gray-600">Deskripsi Produk</label>
                        <textarea v-model="editForm.deskripsi" placeholder="Deskripsi produk" rows="4"
                            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"></textarea>
                    </div>

                    <div class="flex justify-end gap-2 pt-4 border-t mt-6">
                        <button @click="isEditing = false"
                            class="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Batal</button>
                        <button @click="submitEdit" :disabled="isSubmitting"
                            class="btn-simpan px-5 py-2 text-white text-sm rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'
import AppAlert from '~/components/ui/AppAlert.vue'

const produkList = ref([])
const kategoris = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref('')
const filterKategori = ref('')
const isEditing = ref(false)
const editForm = ref({})
const editImagePreview = ref(null)
const editImageFile = ref(null)
const alert = ref({ message: '', type: 'info' })
const isSubmitting = ref(false)

const { $api } = useNuxtApp()
let searchDebounce = null

const fetchProducts = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            search: searchQuery.value.trim(),
            kategori: filterKategori.value
        }

        const res = await $api.get('/produk', { params })

        produkList.value = res.data.data
        currentPage.value = res.data.current_page
        totalPages.value = res.data.last_page
        totalItems.value = res.data.total
    } catch (e) {
        alert.value = { message: 'Gagal fetch produk', type: 'error' }
    } finally {
        isLoading.value = false
    }
}

const filteredProducts = computed(() => produkList.value)

const resetFilter = () => {
    searchQuery.value = ''
    filterKategori.value = ''
    currentPage.value = 1
    fetchProducts()
}

const fetchKategori = async () => {
    try {
        const res = await $api.get('/kategori')
        kategoris.value = Array.isArray(res.data) ? res.data : res.data.data
    } catch (e) {
        alert.value = { message: 'Gagal fetch kategori', type: 'error' }
    }
}

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchProducts()
    }
}

const openEditModal = (product) => {
    isEditing.value = true
    editForm.value = {
        ...product,
        id_kategori: product.kategori?.id_kategori,
        deskripsi: product.deskripsi || ''
    }
    editImagePreview.value = product.gambar_produk
    editImageFile.value = null
}

const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        editImageFile.value = file
        editImagePreview.value = URL.createObjectURL(file)
    }
}

const submitEdit = async () => {
    isSubmitting.value = true
    try {
        const formData = new FormData()

        for (const key in editForm.value) {
            if (key !== 'kategori' && key !== 'gambar_produk' && editForm.value[key] != null) {
                formData.append(key, editForm.value[key])
            }
        }

        if (editImageFile.value) {
            formData.append('gambar_produk', editImageFile.value)
        }

        formData.append('_method', 'PUT')

        await $api.post(`/produk/${editForm.value.id_produk}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        alert.value = { message: 'Produk berhasil diupdate!', type: 'success' }

        isEditing.value = false
        fetchProducts()
    } catch (e) {
        alert.value = { message: 'Gagal update produk', type: 'error' }
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = async (id_produk) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
        try {
            await $api.delete(`/produk/${id_produk}`)
            alert.value = { message: 'Produk berhasil dihapus!', type: 'success' }
            fetchProducts()
        } catch (e) {
            alert.value = { message: 'Gagal delete produk', type: 'error' }
        }
    }
}

// Debounce pencarian & filter
watch([searchQuery, filterKategori], () => {
    currentPage.value = 1
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
        fetchProducts()
    }, 300)
})

onMounted(() => {
    fetchKategori()
    fetchProducts()
})
</script>

<style scoped>
.btn-simpan {
    background-color: #0E2046;
    transition: background 0.3s ease;
}

.btn-simpan:hover {
    background: #082f83;
    box-shadow: 0 4px 12px rgba(248, 123, 16, 0.3);
}
</style>
