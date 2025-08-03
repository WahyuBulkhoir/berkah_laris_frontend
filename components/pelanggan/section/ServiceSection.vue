<template>
    <section id="servis" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Layanan Servis Elektronik
                </h2>
                <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Perbaikan profesional untuk berbagai perangkat elektronik Anda.
                </p>
            </div>

            <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Daftar Layanan -->
                <div
                    class="bg-white p-6 rounded-lg shadow-md hover:-translate-y-1 hover:shadow-lg transition-transform duration-300">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Jenis Layanan Servis</h3>
                    <ul class="space-y-4">
                        <li v-for="service in services" :key="service.id" class="flex items-start">
                            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <h4 class="font-medium text-gray-900">{{ service.title }}</h4>
                                <p class="text-gray-600">{{ service.description }}</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Formulir Pengajuan -->
                <div class="bg-white p-6 rounded-lg shadow-md hover:-translate-y-1 transition-transform duration-300">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Form Pengajuan Servis</h3>

                    <!-- Alert Notifikasi -->
                    <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message"
                        @close="alert.message = ''" />

                    <form @submit.prevent="submitServiceForm" class="space-y-4">
                        <!-- Tipe Barang -->
                        <div>
                            <label for="tipe_barang" class="block text-sm font-medium text-gray-700">Tipe Barang</label>
                            <input type="text" id="tipe_barang" v-model="serviceForm.tipe_barang" :class="[
                                'mt-1 block w-full border rounded-md p-2 shadow-sm sm:text-sm',
                                errors.tipe_barang ? 'border-red-500' : 'border-gray-300'
                            ]" />
                            <p v-if="errors.tipe_barang" class="text-sm text-red-500 mt-1">{{ errors.tipe_barang }}</p>
                        </div>

                        <!-- Kerusakan -->
                        <div>
                            <label for="kerusakan" class="block text-sm font-medium text-gray-700">Kerusakan</label>
                            <input type="text" id="kerusakan" v-model="serviceForm.kerusakan" :class="[
                                'mt-1 block w-full border rounded-md p-2 shadow-sm sm:text-sm',
                                errors.kerusakan ? 'border-red-500' : 'border-gray-300'
                            ]" />
                            <p v-if="errors.kerusakan" class="text-sm text-red-500 mt-1">{{ errors.kerusakan }}</p>
                        </div>

                        <!-- Keterangan Tambahan -->
                        <div>
                            <label for="ket_tambahan" class="block text-sm font-medium text-gray-700">Keterangan
                                Tambahan</label>
                            <textarea id="ket_tambahan" v-model="serviceForm.ket_tambahan" rows="3"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"></textarea>
                        </div>

                        <!-- Tanggal Servis -->
                        <div>
                            <label for="tanggal_servis" class="block text-sm font-medium text-gray-700">Tanggal
                                Servis</label>
                            <input type="date" id="tanggal_servis" v-model="serviceForm.tanggal_servis" :class="[
                                'mt-1 block w-full border rounded-md p-2 shadow-sm sm:text-sm',
                                errors.tanggal_servis ? 'border-red-500' : 'border-gray-300'
                            ]" />
                            <p v-if="errors.tanggal_servis" class="text-sm text-red-500 mt-1">{{ errors.tanggal_servis
                            }}</p>
                        </div>

                        <!-- Tombol Submit -->
                        <div class="pt-2">
                            <button type="submit" :disabled="isSubmitting"
                                class="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="isSubmitting">
                                    <svg class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4" />
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                </span>
                                {{ isSubmitting ? 'Mengirim...' : 'Ajukan Servis' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import AppAlert from '~/components/ui/AppAlert.vue'

const router = useRouter()
const auth = useAuthStore()
const { $api } = useNuxtApp()

const alert = ref({ type: '', message: '' })
const isSubmitting = ref(false)
const errors = ref({})

const services = ref([
    { id: 1, title: 'Servis Laptop & Komputer', description: 'Perbaikan hardware, software, upgrade komponen' },
    { id: 2, title: 'Servis Smartphone & Tablet', description: 'Perbaikan layar, baterai, software' },
    { id: 3, title: 'Servis TV & Audio', description: 'Perbaikan panel, sistem audio, kalibrasi' },
    { id: 4, title: 'Servis Elektronik Rumah Tangga', description: 'AC, kulkas, mesin cuci, dan perangkat lainnya' }
])

const serviceForm = ref({
    tipe_barang: '',
    kerusakan: '',
    ket_tambahan: '',
    tanggal_servis: ''
})

const validateForm = () => {
    errors.value = {}
    if (!serviceForm.value.tipe_barang) errors.value.tipe_barang = 'Tipe barang harus diisi.'
    if (!serviceForm.value.kerusakan) errors.value.kerusakan = 'Kerusakan harus diisi.'
    if (!serviceForm.value.tanggal_servis) errors.value.tanggal_servis = 'Tanggal servis harus diisi.'
    return Object.keys(errors.value).length === 0
}

const resetForm = () => {
    serviceForm.value = {
        tipe_barang: '',
        kerusakan: '',
        ket_tambahan: '',
        tanggal_servis: ''
    }
}

const submitServiceForm = async () => {
    if (!auth.token) {
        const proceed = window.confirm('⚠️ Anda harus login terlebih dahulu.\nKlik OK untuk menuju halaman login.')
        if (proceed) {
            router.push('/auth/login')
        }
        return
    }

    if (!validateForm()) {
        alert.value = { type: 'error', message: 'Mohon isi semua field yang diperlukan.' }
        return
    }

    isSubmitting.value = true
    try {
        await $api.post('/servis', { ...serviceForm.value })
        alert.value = {
            type: 'success',
            message: 'Servis berhasil diajukan! Anda akan diarahkan ke riwayat servis.'
        }
        setTimeout(() => {
            router.push('/produk/servis/servis')
            resetForm()
        }, 1500)
    } catch (err) {
        const msg = err.response?.data?.message || 'Gagal mengirim data servis.'
        alert.value = { type: 'error', message: msg }
        console.error(err)
    } finally {
        isSubmitting.value = false
    }
}

</script>
