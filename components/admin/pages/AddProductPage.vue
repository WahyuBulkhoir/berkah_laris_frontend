<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow space-y-6 animate-fade-in">
    <h2 class="text-2xl font-bold text-gray-800 border-b pb-2">➕ Tambah Produk</h2>

    <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 ">
      <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk
        <AppInput class="border border-gray-300 rounded-md" v-model="form.nama_produk" placeholder="Nama" required />
      </label>
      <label class="block text-sm font-medium text-gray-700 mb-1">SKU Produk
        <AppInput class="border border-gray-300 rounded-md" v-model="form.sku" placeholder="Contoh: PRD-001" required />
      </label>
      <label class="block text-sm font-medium text-gray-700 mb-1">Harga Produk
        <AppInput class="border border-gray-300 rounded-md" v-model="form.harga" placeholder="Harga" type="number"
          required />
      </label>
      <label class="block text-sm font-medium text-gray-700 mb-1">Stok Produk
        <AppInput class="border border-gray-300 rounded-md" v-model="form.stok" placeholder="Stok" type="number"
          required />
      </label>
      <label class="block text-sm font-medium text-gray-700 mb-1">Modal Produk
        <AppInput class="border border-gray-300 rounded-md" v-model="form.modal" placeholder="Harga Modal" type="number"
          required />
      </label>

      <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Produk
        <select v-model="form.id_kategori" required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Pilih Kategori</option>
          <option v-for="kategori in kategoris" :key="kategori.id_kategori" :value="kategori.id_kategori">
            {{ kategori.nama_kategori }} ({{ kategori.tipe_produk }})
          </option>
        </select>
      </label>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
      <textarea v-model="form.deskripsi" placeholder="Deskripsi" rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
      <input type="file" accept="image/*" @change="handleFileUpload"
        class="w-full border px-3 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700" />

      <div v-if="previewImage" class="mt-4">
        <img :src="previewImage" alt="Preview" class="w-40 h-40 object-cover rounded border" />
      </div>
    </div>

    <div class="pt-4 text-right">
      <AppButton :loading="loading" type="submit" @click="submitForm" class="w-full md:w-auto">
        Simpan Produk
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import AppAlert from '~/components/ui/AppAlert.vue'
import AppInput from '~/components/ui/AppInput.vue'
import AppButton from '~/components/ui/AppButton.vue'

const auth = useAuthStore()

const form = ref({
  nama_produk: '',
  sku: '',
  harga: '',
  modal: '',
  stok: '',
  gambar_produk: null,
  deskripsi: '',
  id_kategori: ''
})

const previewImage = ref(null)
const kategoris = ref([])
const alert = ref({ message: '', type: 'info' })
const loading = ref(false)

const fetchKategori = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/kategori')
    kategoris.value = Array.isArray(response.data) ? response.data : response.data.data
  } catch (err) {
    alert.value = {
      message: 'Gagal memuat data kategori',
      type: 'error'
    }
  }
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (file.size > 1120000) {
      alert.value = {
        message: 'Ukuran gambar tidak boleh lebih dari 1MB!',
        type: 'error'
      }
      return
    }
    form.value.gambar_produk = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const validateForm = () => {
  if (!form.value.nama_produk) {
    alert.value = { message: 'Nama produk wajib diisi!', type: 'error' }
    return false
  }
  if (!form.value.harga || form.value.harga <= 0) {
    alert.value = { message: 'Harga produk harus diisi dan lebih dari 0!', type: 'error' }
    return false
  }
  if (!form.value.stok || form.value.stok < 0) {
    alert.value = { message: 'Stok produk harus diisi dan tidak boleh negatif!', type: 'error' }
    return false
  }
  if (!form.value.modal || form.value.modal <= 0) {
    alert.value = { message: 'Harga modal harus diisi dan lebih dari 0!', type: 'error' }
    return false
  }
  if (!form.value.id_kategori) {
    alert.value = { message: 'Kategori produk wajib dipilih!', type: 'error' }
    return false
  }
  if (!form.value.gambar_produk) {
    alert.value = { message: 'Gambar produk wajib diunggah dan ukuran max 1 MB!', type: 'error' }
    return false
  }
  return true
}

const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true
  alert.value = { message: '', type: 'info' }

  const payload = new FormData()
  Object.entries(form.value).forEach(([key, val]) => {
    if (val !== null) payload.append(key, val)
  })

  try {
    const { $api } = useNuxtApp()
    await $api.post('/produk', payload)
    alert.value = { message: 'Produk berhasil ditambahkan!', type: 'success' }
    form.value = {
      nama_produk: '',
      sku: '',
      harga: '',
      stok: '',
      gambar_produk: null,
      deskripsi: '',
      id_kategori: ''
    }
    previewImage.value = null
  } catch (error) {
    alert.value = {
      message: error?.response?.data?.message || 'Gagal menambahkan produk.',
      type: 'error'
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchKategori)
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out both;
}
</style>
