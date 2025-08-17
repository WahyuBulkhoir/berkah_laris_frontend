<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20">
                <div class="flex items-center mb-0">
                    <img src="/img/logo-bl-h.png" alt="Logo BerkahLaris" class="h-13 w-auto" />
                </div>

                <div class="hidden md:flex md:items-center mx-auto space-x-6">
                    <button @click="handleMenuClick('beranda')" @mouseenter="hoverSection = 'beranda'"
                        @mouseleave="hoverSection = null"
                        :class="['px-3 py-2 text-sm font-medium transition-colors duration-300', menuClass('beranda')]">
                        Beranda
                    </button>

                    <button @click="handleMenuClick('produk')" @mouseenter="hoverSection = 'produk'"
                        @mouseleave="hoverSection = null"
                        :class="['px-3 py-2 text-sm font-medium transition-colors duration-300', menuClass('produk')]">
                        Produk
                    </button>

                    <button @click="handleMenuClick('servis')" @mouseenter="hoverSection = 'servis'"
                        @mouseleave="hoverSection = null"
                        :class="['px-3 py-2 text-sm font-medium transition-colors duration-300', menuClass('servis')]">
                        Servis
                    </button>

                    <button @click="handleMenuClick('tentang')" @mouseenter="hoverSection = 'tentang'"
                        @mouseleave="hoverSection = null"
                        :class="['px-3 py-2 text-sm font-medium transition-colors duration-300', menuClass('tentang')]">
                        Tentang Kami
                    </button>

                    <button @click="handleMenuClick('kontak')" @mouseenter="hoverSection = 'kontak'"
                        @mouseleave="hoverSection = null"
                        :class="['px-3 py-2 text-sm font-medium transition-colors duration-300', menuClass('kontak')]">
                        Kontak
                    </button>

                    <template v-if="auth.token">
                        <div class="relative group">
                            <button @mouseenter="hoverSection = 'riwayat'" @mouseleave="hoverSection = null"
                                @click="toggleDropdown()"
                                :class="['px-3 py-2 text-sm font-medium inline-flex items-center transition-colors duration-300', menuClass('riwayat')]"
                                type="button" aria-haspopup="true" :aria-expanded="isDropdownOpen">
                                Riwayat
                                <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div v-show="isDropdownOpen"
                                class="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-2 transition z-50"
                                @mouseenter="hoverSection = 'riwayat'" @mouseleave="hoverSection = null">
                                <NuxtLink to="/produk/order/order"
                                    class="block px-4 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 hover:text-white rounded-md"
                                    @click="handleMenuClick('riwayat')">
                                    Riwayat Pemesanan
                                </NuxtLink>
                                <NuxtLink to="/produk/servis/servis"
                                    class="block px-4 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 hover:text-white rounded-md"
                                    @click="handleMenuClick('riwayat')">
                                    Riwayat Servis
                                </NuxtLink>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="hidden md:flex md:items-center space-x-4">
                    <template v-if="auth.token">
                        <button @click="toggleCart"
                            class="relative block px-4 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 hover:text-white rounded-md">
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
                        <button @click="handleLogout" :disabled="auth.isLoggingOut" class="logout-btn px-3 py-2 rounded-md text-sm font-medium
           text-white">
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

                <div class="flex md:hidden items-center">
                    <template v-if="auth.token">
                        <button @click="toggleCart"
                            class="relative block text-gray-800 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 hover:text-white rounded-md px-3 py-2 mr-2">
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

        <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button @click="handleMenuClick('beranda')"
                    class="block w-full px-3 py-2 text-left text-sm font-medium transition-colors duration-200"
                    :class="menuClass('beranda')">
                    Beranda
                </button>

                <button @click="handleMenuClick('produk')"
                    class="block w-full px-3 py-2 text-left text-sm font-medium transition-colors duration-200"
                    :class="menuClass('produk')">
                    Produk
                </button>

                <button @click="handleMenuClick('servis')"
                    class="block w-full px-3 py-2 text-left text-sm font-medium transition-colors duration-200"
                    :class="menuClass('servis')">
                    Servis
                </button>

                <button @click="handleMenuClick('tentang')"
                    class="block w-full px-3 py-2 text-left text-sm font-medium transition-colors duration-200"
                    :class="menuClass('tentang')">
                    Tentang Kami
                </button>

                <button @click="handleMenuClick('kontak')"
                    class="block w-full px-3 py-2 text-left text-sm font-medium transition-colors duration-200"
                    :class="menuClass('kontak')">
                    Kontak
                </button>

                <template v-if="auth.token">
                    <div class="border-t border-gray-100 pt-2">
                        <button @click="toggleMobileRiwayat"
                            class="w-full text-left px-3 py-2 text-sm font-medium inline-flex justify-between items-center transition-colors duration-200"
                            :class="menuClass('riwayat')">
                            <span>Riwayat</span>
                            <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div v-show="isMobileRiwayatOpen" class="pl-4 border-l-2 border-yellow-400">
                            <NuxtLink to="/produk/order/order" @click="handleMenuClick('riwayat')"
                                class="block w-full px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 hover:text-white rounded-md">
                                Riwayat Pemesanan
                            </NuxtLink>
                            <NuxtLink to="/produk/servis/servis" @click="handleMenuClick('riwayat')"
                                class="block w-full px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 hover:text-white rounded-md">
                                Riwayat Servis
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
                    <button @click="goToCart" class="w-full py-2 px-4 rounded-md text-white
        bg-[#0E2046]
        hover:bg-gradient-to-tr hover:from-[#F87B10] hover:via-[#FEB10B] hover:to-[#F87B10]
        shadow-md
        transition-all duration-300">
                        Lihat Keranjang
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
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

const activeSection = ref('beranda')
const hoverSection = ref(null)
const clickedSection = ref('beranda')
const isDropdownOpen = ref(false)
const isMobileRiwayatOpen = ref(false)

onMounted(() => {
    if (auth.token) fetchCart()
    window.addEventListener('scroll', onScroll)
    onScroll()
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
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

function handleMenuClick(section) {
    clickedSection.value = section
    isMobileRiwayatOpen.value = false
    isDropdownOpen.value = false
    scrollToSection(section)
}

function menuClass(section) {
    if (hoverSection.value === section || clickedSection.value === section) {
        return 'text-white gradient-bg'
    }
    return 'text-gray-700 hover:text-blue-600'
}

function dropdownItemClass(section) {
    if (hoverSection.value === section || clickedSection.value === section) {
        return 'text-white bg-transparent'
    }
    return 'text-gray-700 hover:bg-gray-100'
}

function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value
}

function toggleMobileRiwayat() {
    isMobileRiwayatOpen.value = !isMobileRiwayatOpen.value
}

function onScroll() {
    console.log('Scroll detected:', window.scrollY);
    const sections = ['beranda', 'produk', 'servis', 'tentang', 'kontak']
    const scrollPos = window.scrollY + window.innerHeight / 2
    let found = 'beranda'

    for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) {
            found = id
        }
    }
    console.log('Active section found:', found);
    activeSection.value = found

    if (!clickedSection.value || clickedSection.value === activeSection.value) {
        clickedSection.value = found
    }
}

</script>

<style scoped>
.gradient-bg {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    border-radius: 0.375rem;
    box-shadow: 0 6px 18px rgba(248, 123, 16, 0.18);
}

.gradient-bg,
.gradient-bg * {
    color: #ffffff !important;
}

button,
a {
    transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.logout-btn {
    background-color: #d80d0d;
    transition: background 0.3s ease;
}

.logout-btn:hover {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    box-shadow: 0 4px 12px rgba(248, 123, 16, 0.3);
}
</style>
