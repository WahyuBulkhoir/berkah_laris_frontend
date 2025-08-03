<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Logo -->
                <div class="flex items-center mb-0">
                    <div
                        class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M13 3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 10H5V5h7v8zm8-8h-4v2h4v7h-4v2h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
                        </svg>
                    </div>
                    <span class="ml-2 text-xl font-bold text-gray-800">BerkahLaris</span>
                </div>

                <!-- Menu Tengah -->
                <div class="hidden md:flex md:items-center mx-auto space-x-6">
                    <button @click="scrollToSection('beranda')"
                        class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Beranda</button>
                    <button @click="scrollToSection('produk')"
                        class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Produk</button>
                    <button @click="scrollToSection('servis')"
                        class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Servis</button>
                    <button @click="scrollToSection('tentang')"
                        class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Tentang Kami</button>
                    <button @click="scrollToSection('kontak')"
                        class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Kontak</button>

                    <!-- Dropdown Riwayat -->
                    <template v-if="auth.token">
                        <div class="relative group">
                            <button
                                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium inline-flex items-center">
                                Riwayat
                                <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div
                                class="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-150 z-50">
                                <NuxtLink to="/produk/order/order"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Riwayat Pemesanan
                                </NuxtLink>
                                <NuxtLink to="/produk/servis/servis"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Riwayat Servis
                                </NuxtLink>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Auth & Cart -->
                <div class="hidden md:flex md:items-center space-x-4">
                    <!-- Cart Icon (Desktop) -->
                    <template v-if="auth.token">
                        <button @click="toggleCart" class="relative text-gray-700 hover:text-blue-600 px-3 py-2">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span v-if="cartCount > 0"
                                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {{ cartCount }}
                            </span>
                        </button>
                    </template>

                    <template v-if="auth.token">
                        <button @click="handleLogout" :disabled="auth.isLoggingOut"
                            class="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                            <span v-if="auth.isLoggingOut">
                                <i class="fas fa-spinner fa-spin mr-1"></i> Logout...
                            </span>
                            <span v-else>
                                <i class="fas fa-sign-out-alt mr-1"></i> Logout
                            </span>
                        </button>
                    </template>
                    <template v-else>
                        <NuxtLink to="/auth/login"
                            class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Login</NuxtLink>
                        <NuxtLink to="/auth/register"
                            class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Daftar</NuxtLink>
                    </template>
                </div>

                <!-- Mobile Cart Icon -->
                <div class="flex md:hidden items-center">
                    <template v-if="auth.token">
                        <button @click="toggleCart" class="relative text-gray-700 hover:text-blue-600 px-3 py-2 mr-2">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span v-if="cartCount > 0"
                                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {{ cartCount }}
                            </span>
                        </button>
                    </template>

                    <!-- Tombol hamburger tetap -->
                    <button @click="toggleMobileMenu"
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Nav -->
        <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button @click="scrollToSection('beranda')"
                    class="block w-full px-3 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-100">Beranda</button>
                <button @click="scrollToSection('produk')"
                    class="block w-full px-3 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-100">Produk</button>
                <button @click="scrollToSection('servis')"
                    class="block w-full px-3 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-100">Servis</button>
                <button @click="scrollToSection('tentang')"
                    class="block w-full px-3 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-100">Tentang
                    Kami</button>
                <button @click="scrollToSection('kontak')"
                    class="block w-full px-3 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-100">Kontak</button>
                <!-- Dropdown Riwayat -->
                <template v-if="auth.token">
                    <div class="relative group">
                        <button
                            class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium inline-flex items-center">
                            Riwayat
                            <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            class="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-150 z-50">
                            <NuxtLink to="/produk/order/order"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Riwayat Pemesanan
                            </NuxtLink>
                            <NuxtLink to="/produk/servis/servis"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Riwayat Servis
                            </NuxtLink>
                        </div>
                    </div>
                </template>
            </div>
            <hr class="my-2 border-gray-300" />
            <div class="px-2 pb-4 space-y-1">
                <template v-if="auth.token">
                    <button @click="handleLogout"
                        class="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-100">
                        <i class="fas fa-sign-out-alt mr-1"></i> Logout
                    </button>
                </template>
                <template v-else>
                    <NuxtLink to="/auth/login" @click="closeMobileMenu"
                        class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100">Login</NuxtLink>
                    <NuxtLink to="/auth/register" @click="closeMobileMenu"
                        class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100">Daftar</NuxtLink>
                </template>
            </div>
        </div>

        <!-- Cart Dropdown -->
        <div v-if="isCartOpen" class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50"
            style="right: 1rem; top: 3.5rem;">
            <div class="px-4 py-3 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-900">Keranjang Belanja ({{ cartCount }})</h3>
            </div>

            <div v-if="cartItems.length === 0" class="px-4 py-6 text-center text-gray-500">
                Keranjang belanja Anda kosong.
            </div>

            <div v-else class="max-h-96 overflow-y-auto">
                <div v-for="item in cartItems" :key="item.id_keranjang"
                    class="px-4 py-3 border-b border-gray-200 flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-200">
                        <img :src="item.produk?.gambar_produk ? imageUrl(item.produk.gambar_produk) : '/img/product-default.jpg'"
                            class="object-cover w-full h-full" />
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ item.produk?.nama_produk }}</p>
                        <p class="text-sm text-gray-500">Rp {{ formatPrice(item.produk?.harga) }} x {{ item.quantity }}
                        </p>
                    </div>
                    <button @click="removeFromCart(item.id_keranjang)" class="text-gray-400 hover:text-red-500">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="px-4 py-3 border-t border-gray-200">
                <div class="flex justify-between text-sm font-medium text-gray-900">
                    <p>Total</p>
                    <p>Rp {{ formatPrice(cartTotal) }}</p>
                </div>
                <div class="mt-3">
                    <button @click="goToCart"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Lihat Keranjang
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCart } from '~/composables/useCart'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const isMobileMenuOpen = ref(false)
const isCartOpen = ref(false)

const {
    cartItems,
    cartCount,
    cartTotal,
    fetchCart,
    removeFromCart
} = useCart()

onMounted(() => {
    if (auth.token) fetchCart()
})

watch(
    () => auth.user?.id,
    (newId) => {
        if (newId) fetchCart()
    }
)

function scrollToSection(id) {
    const sectionId = id.replace('#', '')

    const goScroll = () => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    if (route.path !== '/') {
        router.push('/').then(() => setTimeout(goScroll, 300))
    } else {
        goScroll()
    }

    closeMobileMenu()
}

function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
    isMobileMenuOpen.value = false
}

function toggleCart() {
    isCartOpen.value = !isCartOpen.value
}

function goToCart() {
    isCartOpen.value = false
    router.push('/produk/cart')
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price)
}

function imageUrl(filename) {
    return `http://localhost:8000/storage/${filename}`
}

async function handleLogout() {
    await auth.logoutUser()
    router.push('/')
}


</script>