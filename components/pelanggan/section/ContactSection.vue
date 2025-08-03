<template>
    <section id="kontak" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Hubungi Kami</h2>
                <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Ada pertanyaan? Jangan ragu untuk menghubungi kami.
                </p>
            </div>

            <!-- Info Kontak -->
            <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="contact in contactInfo" :key="contact.title"
                    class="bg-white p-6 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div
                        class="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                        <i :class="contact.icon" class="text-lg"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ contact.title }}</h3>
                    <p v-for="(item, index) in contact.items" :key="index" class="text-gray-600">{{ item }}</p>
                </div>
            </div>

            <!-- Form Kontak -->
            <div
                class="mt-12 bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Kirim Pesan</h3>
                <form @submit.prevent="submitContactForm" class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                        <label for="contact-name" class="block text-sm font-medium text-gray-700">Nama</label>
                        <input type="text" id="contact-name" v-model="contactForm.name"
                            class="mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label for="contact-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="contact-email" v-model="contactForm.email"
                            class="mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" />
                    </div>
                    <div class="sm:col-span-2">
                        <label for="contact-subject" class="block text-sm font-medium text-gray-700">Subjek</label>
                        <input type="text" id="contact-subject" v-model="contactForm.subject"
                            class="mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" />
                    </div>
                    <div class="sm:col-span-2">
                        <label for="contact-message" class="block text-sm font-medium text-gray-700">Pesan</label>
                        <textarea id="contact-message" v-model="contactForm.message" rows="4"
                            class="mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"></textarea>
                    </div>
                    <div class="sm:col-span-2">
                        <button type="submit" :disabled="isLoading"
                            class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60">
                            <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                            {{ isLoading ? 'Mengirim Pesan...' : 'Kirim Pesan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const { $api } = useNuxtApp()
const auth = useAuthStore()
const router = useRouter()

const isLoading = ref(false)

const contactInfo = [
    {
        title: 'Telepon',
        icon: 'fas fa-phone-alt',
        items: ['(021) 1234-5678', '0812-3456-7890']
    },
    {
        title: 'Email',
        icon: 'fas fa-envelope',
        items: ['info@berkahlaris.com', 'servis@berkahlaris.com']
    },
    {
        title: 'Alamat',
        icon: 'fas fa-map-marker-alt',
        items: ['Jl. Elektronik No. 123', 'Medan, Sumatera Utara, 10110']
    }
]

const contactForm = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

async function submitContactForm() {
    if (!auth.token) {
        const confirmLogin = confirm('Anda harus login terlebih dahulu. Ingin login sekarang?')
        if (confirmLogin) router.push('/auth/login')
        return
    }

    const { name, email, subject, message } = contactForm.value
    if (!name || !email || !subject || !message) {
        alert('Mohon lengkapi semua field pada form.')
        return
    }

    isLoading.value = true
    try {
        await $api.post('/kontak/kirim', { name, email, subject, message })

        alert('✅ Terima kasih! Pesan Anda berhasil dikirim.')
        contactForm.value = { name: '', email: '', subject: '', message: '' }
    } catch (err) {
        console.error('❌ Gagal mengirim pesan:', err)
        alert('Gagal mengirim pesan. Silakan coba lagi nanti.')
    } finally {
        isLoading.value = false
    }
}
</script>
