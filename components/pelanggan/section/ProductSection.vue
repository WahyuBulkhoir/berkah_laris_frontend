<template>
    <section id="produk" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Judul -->
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Produk Elektronik Kami
                </h2>
                <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Pilihan produk elektronik baru dan bekas berkualitas dengan harga terbaik.
                </p>
            </div>

            <!-- Filter Tabs -->
            <div class="mt-12 flex flex-wrap justify-center gap-4 mb-8">
                <button @click="setFilter('all')" :class="tabClass('all')">Semua</button>
                <button @click="setFilter('Baru')" :class="tabClass('Baru')">Baru</button>
                <button @click="setFilter('Bekas')" :class="tabClass('Bekas')">Bekas</button>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="text-center py-10 text-gray-500">
                <i class="fas fa-spinner fa-spin mr-2"></i>Memuat produk...
            </div>

            <!-- Error -->
            <div v-else-if="error" class="text-center text-red-600 py-10">
                <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
            </div>

            <!-- Product Grid -->
            <div v-else-if="filteredProducts.length"
                class="mt-8 grid grid-cols-2 gap-y-10 gap-x-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                <div v-for="product in filteredProducts" :key="product.id_produk"
                    class="group relative bg-white rounded-lg shadow-md p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl border border-blue-400">

                    <!-- Label Stok Habis -->
                    <div v-if="product.stok === 0"
                        class="absolute -top-[-5] -left-6 transform -rotate-45 bg-red-600 text-white text-xs font-bold px-6 py-1 z-20 shadow-md rounded">
                        Stok Habis
                    </div>

                    <!-- Harga muncul saat hover -->
                    <p
                        class="absolute top-4 right-4 text-sm font-semibold bg-white text-red-600 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition duration-300 z-10 hover-bounce-random">
                        Rp {{ formatHarga(product.harga) }}
                    </p>

                    <!-- GAMBAR -->
                    <div class="bg-white rounded-md overflow-hidden shadow-2xl mx-auto w-40 h-40">
                        <img :src="product.gambar_produk ? imageUrl(product.gambar_produk) : defaultImage"
                            alt="Gambar Produk" class="w-full h-full object-cover object-center" />
                    </div>

                    <!-- INFO PRODUK -->
                    <div class="mt-4 w-full">
                        <h3 class="text-lg text-gray-700 font-semibold truncate">
                            {{ product.nama_produk }}
                        </h3>

                        <!-- Deskripsi -->
                        <div class="relative mt-4">
                            <p class="text-sm text-gray-500 mt-1 line-clamp-3 max-h-28 overflow-hidden"
                                style="mask-image: linear-gradient(180deg, #000 60%, transparent);">
                                {{ product.deskripsi }}
                            </p>
                        </div>

                        <!-- Lihat Selengkapnya -->
                        <button @click="showProductDetail(product)"
                            class="text-sm text-blue-600 mt-1 hover:underline focus:outline-none">
                            Lihat selengkapnya
                        </button>
                    </div>

                    <!-- LABEL -->
                    <div class="mt-2">
                        <span :class="badgeClass(product.kategori?.tipe_produk)">
                            {{ product.kategori?.tipe_produk || 'Tidak Diketahui' }}
                        </span>
                    </div>

                    <!-- Tombol -->
                    <button @click="showProductDetail(product)" :disabled="product.stok === 0"
                        class="mt-4 w-full text-white py-2 px-4 rounded-md transition-colors" :class="product.stok === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'">
                        {{ product.stok === 0 ? 'Stok Habis' : 'Detail Produk' }}
                    </button>
                </div>
            </div>

            <!-- Tidak Ada Produk -->
            <div v-else class="text-center text-gray-500 mt-10">
                Tidak ada produk tersedia.
            </div>

            <!-- LINK -->
            <div class="mt-12 text-center">
                <NuxtLink to="/produk"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    Lihat Semua Produk
                    <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </NuxtLink>
            </div>
        </div>

        <!-- MODAL -->
        <ProductDetailSection :is-open="isProductDetailOpen" :product="selectedProduct" @close="closeProductDetail"
            @add-to-cart="handleAddToCart" @buy-now="handleBuyNow" />
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductDetailSection from '~/components/pelanggan/section/ProductDetailSection.vue'

const { $api } = useNuxtApp()

const products = ref([])
const activeFilter = ref('all')
const isProductDetailOpen = ref(false)
const selectedProduct = ref(null)
const isLoading = ref(true)
const error = ref(null)

const defaultImage = '/img/product-default.jpg'

const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
        const res = await $api.get('/produk')
        products.value = res.data.data || res.data
    } catch (err) {
        console.error('Gagal mengambil produk:', err)
        error.value = 'Gagal memuat data produk. Anda harus login terlebih dahulu.'
    } finally {
        isLoading.value = false
    }
}

const setFilter = (filter) => {
    activeFilter.value = filter
}

const filteredProducts = computed(() => {
    if (activeFilter.value === 'all') return products.value
    return products.value.filter(p => p.kategori?.tipe_produk === activeFilter.value)
})

const showProductDetail = (product) => {
    selectedProduct.value = product
    isProductDetailOpen.value = true
}

const closeProductDetail = () => {
    isProductDetailOpen.value = false
}

const handleAddToCart = (product) => {
    console.log('Tambah ke keranjang:', product)
}

const handleBuyNow = (product) => {
    console.log('Beli sekarang:', product)
}

const imageUrl = (filename) => `http://localhost:8000/storage/${filename}`

const formatHarga = (value) => Number(value).toLocaleString('id-ID')

const tabClass = (filter) =>
    activeFilter.value === filter
        ? 'bg-blue-600 text-white px-4 py-2 rounded-md'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md'

const badgeClass = (type) =>
    type === 'Baru'
        ? 'bg-green-100 text-green-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
        : 'bg-yellow-100 text-yellow-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

onMounted(fetchProducts)
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@keyframes bounce-random {

    0%,
    100% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(3px, -2px);
    }

    50% {
        transform: translate(-3px, 2px);
    }

    75% {
        transform: translate(2px, -3px);
    }
}

.hover-bounce-random {
    animation: bounce-random 0.6s infinite;
}
</style>
