<template>
    <div class="min-h-screen flex bg-cover bg-center" :style="{ backgroundImage: `url('/img/lp-login.png')` }">
        <div class="hidden md:flex flex-col w-4/8 px-30 text-black relative">
            <div class="sticky top-10 z-50 bg-transparent pt-0">
                <img src="/img/logo-bl-h.png" alt="BerkahLaris Logo" class="w-50 mb-45" />

                <div class="sticky top-40">
                    <h2 class="text-4xl font-bold mb-4">Solusi Elektronik Terpercaya</h2>
                    <p class="opacity-90 leading-relaxed font-medium text-xl">
                        Menjual barang elektronik baru & bekas berkualitas serta layanan servis
                        profesional untuk semua kebutuhan elektronik Anda.
                    </p>

                    <div class="space-y-4 mt-10 font-medium text-xl">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Produk Berkualitas</span>
                        </div>
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Garansi Terjamin</span>
                        </div>
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Teknisi Berpengalaman</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col justify-center w-full md:w-3/5 max-w-md mx-auto bg-white bg-opacity-90 rounded-xl p-10 my-16 md:my-35 shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            style="min-height: 450px">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
            <p class="text-gray-600 mb-6">Daftar untuk menikmati layanan Berkah Laris</p>

            <register-form @success="onRegisterSuccess" />

            <p class="text-center text-gray-600 text-sm mt-6">
                Sudah punya akun?
                <nuxt-link to="/auth/login" class="text-blue-600 font-medium hover:text-blue-800">
                    Masuk sekarang
                </nuxt-link>
            </p>
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
            this.$router.push('/auth/verify-notice')
        }
    },
    head() {
        return {
            title: 'Daftar - Berkah Laris'
        }
    }
}
</script>