<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Form Tambah Kategori -->
    <div class="md:col-span-1 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-6">➕ Tambah Kategori</h2>

      <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''"
        class="mb-4" />

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
          <input v-model="category.nama_kategori" type="text" placeholder="Contoh: Laptop"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Produk</label>
          <select v-model="category.tipe_produk"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required>
            <option disabled value="">Pilih Tipe</option>
            <option value="Baru">Baru</option>
            <option value="Bekas">Bekas</option>
          </select>
        </div>
        <AppButton type="submit" class="w-full">Simpan Kategori</AppButton>
      </form>
    </div>
    <!-- Tabel Kategori -->
    <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">🗂️ Daftar Kategori</h2>
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Cari berdasarkan nama..."
            class="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-10 text-gray-500">
        <i class="fas fa-spinner fa-spin mr-2"></i>Memuat data kategori...
      </div>

      <div v-else-if="error" class="text-red-600 text-center py-10">
        {{ error }}
      </div>

      <div v-else-if="filteredCategories.length === 0" class="text-center text-gray-500 py-10">
        <i class="fas fa-exclamation-circle text-xl mr-2"></i>Tidak ada kategori ditemukan untuk pencarian atau filter
        saat ini.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-blue-600 rounded-lg p-8 text-white">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipe Produk</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in filteredCategories" :key="cat.id_kategori"
              class="bg-white divide-y divide-gray-400 hover:bg-gray-200">
              <td class="px-4 py-3">{{ cat.nama_kategori }}</td>
              <td class="px-4 py-3">{{ cat.tipe_produk }}</td>
              <td class="px-4 py-3">
                <div class="flex space-x-2">
                  <button @click="openEditModal(cat)" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="confirmDelete(cat.id_kategori)" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Edit -->
    <div v-if="isEditing"
      class="fixed inset-0 z-50 bg-blend-color bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
      <div class="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative animate-fade-in">
        <!-- Header -->
        <div class="flex justify-between items-center bg-blue-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fas fa-edit text-white"></i> Edit Kategori
          </h3>
          <button @click="isEditing = false" class="text-white hover:text-red-400 text-2xl font-bold">
            &times;
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''"
            class="mb-4" />

          <form @submit.prevent="submitEdit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
              <input v-model="editForm.nama_kategori"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Produk</label>
              <select v-model="editForm.tipe_produk"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Baru">Baru</option>
                <option value="Bekas">Bekas</option>
              </select>
            </div>

            <!-- Tombol Aksi -->
            <div class="flex justify-end gap-2 pt-4 border-t mt-6">
              <AppButton type="button" variant="secondary" @click="isEditing = false">Batal</AppButton>
              <button type="submit" :disabled="isSubmitting"
                class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import AppButton from '~/components/ui/AppButton.vue'
import AppAlert from '~/components/ui/AppAlert.vue'

const auth = useAuthStore()
const { $api } = useNuxtApp()

const category = ref({ nama_kategori: '', tipe_produk: '' })
const searchQuery = ref('')
const isLoading = ref(false)
const error = ref(null)
const categories = ref([])
const isEditing = ref(false)
const editForm = ref({ id_kategori: null, nama_kategori: '', tipe_produk: '' })
const alert = ref({ message: '', type: 'info' })
const isAdding = ref(false)
const isUpdating = ref(false)

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const res = await $api.get('/kategori')
    categories.value = Array.isArray(res.data) ? res.data : res.data.data
  } catch (e) {
    alert.value = { message: 'Gagal memuat kategori', type: 'error' }
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCategories)

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  return categories.value.filter(cat =>
    cat.nama_kategori.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const submitForm = async () => {
  isAdding.value = true
  try {
    await $api.post('/kategori', category.value)
    alert.value = { message: 'Kategori berhasil ditambahkan!', type: 'success' }
    category.value = { nama_kategori: '', tipe_produk: '' }
    fetchCategories()
  } catch (e) {
    alert.value = { message: 'Gagal menambahkan kategori', type: 'error' }
  } finally {
    isAdding.value = false
  }
}

const openEditModal = (cat) => {
  isEditing.value = true
  editForm.value = { ...cat }
}

const submitEdit = async () => {
  isUpdating.value = true
  try {
    await $api.put(`/kategori/${editForm.value.id_kategori}`, editForm.value)
    alert.value = { message: 'Kategori berhasil diperbarui!', type: 'success' }
    isEditing.value = false
    fetchCategories()
  } catch (e) {
    alert.value = { message: 'Gagal memperbarui kategori', type: 'error' }
  } finally {
    isUpdating.value = false
  }
}

const confirmDelete = async (id) => {
  if (confirm('Yakin ingin menghapus kategori ini?')) {
    try {
      await $api.delete(`/kategori/${id}`)
      alert.value = { message: 'Kategori berhasil dihapus!', type: 'success' }
      fetchCategories()
    } catch (e) {
      alert.value = { message: 'Gagal menghapus kategori', type: 'error' }
    }
  }
}
</script>
