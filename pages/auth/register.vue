<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl w-full flex rounded-lg shadow-lg overflow-hidden">
            <div class="hidden md:block md:w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12">
                <div class="flex items-center mb-6">
                    <div
                        class="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
                        <svg class="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M13 3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 10H5V5h7v8zm8-8h-4v2h4v7h-4v2h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
                        </svg>
                    </div>
                    <span class="ml-2 text-2xl font-bold">BerkahLaris</span>
                </div>
                <h2 class="text-xl font-semibold mb-4">Solusi Elektronik Terpercaya</h2>
                <p class="mb-6 opacity-90">Menjual barang elektronik baru & bekas berkualitas serta layanan servis
                    profesional untuk semua kebutuhan elektronik Anda.</p>

                <div class="space-y-4 mb-8">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Produk Berkualitas</span>
                    </div>
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Garansi Terjamin</span>
                    </div>
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Teknisi Berpengalaman</span>
                    </div>
                </div>
            </div>

            <!-- Register Form -->
            <div class="w-full md:w-3/5 bg-white p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
                <p class="text-gray-600 mb-6">Daftar untuk menikmati layanan Berkah Laris</p>

                <register-form @success="onRegisterSuccess" />

                <p class="text-center text-gray-600 text-sm mt-6">
                    Sudah punya akun?
                    <nuxt-link to="/auth/login" class="text-blue-600 font-medium hover:text-blue-800">
                        Masuk
                    </nuxt-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import RegisterForm from '~/components/auth/RegisterForm.vue'

export default {
    layout: 'auth',
    middleware: 'guest',
    components: {
        RegisterForm
    },
    methods: {
        onRegisterSuccess() {
            this.$router.push('/auth/login')
        }
    },
    head() {
        return {
            title: 'Daftar - Berkah Laris'
        }
    }
}
</script>