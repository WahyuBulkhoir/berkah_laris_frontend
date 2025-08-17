<template>
    <section class="py-12 px-4 max-w-7xl mx-auto">
        <!-- Judul -->
        <div class="text-center mb-10">
            <h2 class="text-3xl font-bold text-gray-800">Semua Produk</h2>
            <p class="text-gray-500 text-lg">Telusuri produk elektronik terbaik sesuai kebutuhan Anda.</p>
        </div>

        <!-- Filter dan Pencarian -->
        <div class="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            <input v-model="search" type="text" placeholder="Cari nama produk..."
                class="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F87B10] focus:border-[#F87B10]" />

            <select v-model="filter"
                class="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F87B10] focus:border-[#F87B10]">
                <option value="">Semua Tipe</option>
                <option value="Baru">Baru</option>
                <option value="Bekas">Bekas</option>
            </select>
        </div>
        <div v-if="isLoading" class="text-center py-10 text-gray-500">
            <i class="fas fa-spinner fa-spin mr-2"></i>Memuat produk...
        </div>
        <div v-else-if="error" class="text-center py-10 text-red-600">
            <i class="fas fa-exclamation-triangle mr-2"></i>{{ error }}
        </div>

        <!-- Daftar Produk -->
        <div v-else-if="filteredProducts.length"
            class="grid grid-cols-2 gap-y-10 gap-x-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div v-for="product in filteredProducts" :key="product.id_produk"
                class="group relative bg-white rounded-lg shadow-md p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl border border-[#F87B10]">

                <div v-if="product.stok === 0"
                    class="absolute -top-[-5] -left-6 transform -rotate-45 bg-red-600 text-white text-xs font-bold px-6 py-1 z-20 shadow-md rounded">
                    Stok Habis
                </div>
                <p
                    class="absolute top-4 right-4 text-sm font-semibold bg-white text-red-600 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition duration-300 z-10 hover-bounce-random">
                    Rp {{ formatHarga(product.harga) }}
                </p>

                <div class="bg-white rounded-md overflow-hidden shadow-2xl mx-auto w-40 h-40">
                    <img :src="product.gambar_produk ? imageUrl(product.gambar_produk) : defaultImage"
                        alt="Gambar Produk" class="w-full h-full object-cover object-center" />
                </div>

                <!-- INFO PRODUK -->
                <div class="mt-4 w-full">
                    <h3 class="text-lg text-gray-700 font-semibold truncate">
                        {{ product.nama_produk }}
                    </h3>
                    <div class="relative mt-4">
                        <p class="text-sm text-gray-500 mt-1 line-clamp-3 max-h-28 overflow-hidden"
                            style="mask-image: linear-gradient(180deg, #000 60%, transparent)">
                            {{ product.deskripsi }}
                        </p>
                    </div>
                    <button @click="showProductDetail(product)"
                        class="text-sm text-transparent bg-gradient-to-tr from-[#0E2046] via-[#1A3B7C] to-[#2C53A9] bg-clip-text mt-1 hover:underline focus:outline-none">
                        Lihat selengkapnya
                    </button>
                </div>

                <!-- LABEL -->
                <div class="mt-2">
                    <span :class="badgeClass(product.kategori?.tipe_produk)">
                        {{ product.kategori?.tipe_produk || 'Tidak Diketahui' }}
                    </span>
                </div>

                <!-- TOMBOL DETAIL -->
                <button @click="showProductDetail(product)" :disabled="product.stok === 0"
                    class="mt-4 w-full rounded-md transition-colors text-white py-2 px-4" :class="product.stok === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'btn-default'">
                    {{ product.stok === 0 ? 'Stok Habis' : 'Detail Produk' }}
                </button>
            </div>
        </div>
        <div v-else class="text-center text-gray-500 mt-10">
            <i class="fas fa-search mr-2"></i>Produk tidak ditemukan.
        </div>

        <!-- MODAL DETAIL -->
        <ProductDetailSection :is-open="isProductDetailOpen" :product="selectedProduct" @close="closeProductDetail"
            @add-to-cart="handleAddToCart" @buy-now="handleBuyNow" />
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductDetailSection from '~/components/pelanggan/section/ProductDetailSection.vue'

const { $api } = useNuxtApp()

const products = ref([])
const search = ref('')
const filter = ref('')
const defaultImage = '/img/product-default.jpg'

const isLoading = ref(true)
const error = ref(null)

const isProductDetailOpen = ref(false)
const selectedProduct = ref(null)

const fetchProducts = async () => {
    isLoading.value = true
    error.value = null

    try {
        const res = await $api.get('/produk-all')
        products.value = res.data.data || res.data
    } catch (err) {
        console.error('Gagal mengambil produk:', err)
        error.value = 'Gagal memuat data produk.'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchProducts)

const filteredProducts = computed(() => {
    return products.value.filter(product => {
        const matchName = product.nama_produk.toLowerCase().includes(search.value.toLowerCase())
        const matchType = filter.value ? product.kategori?.tipe_produk === filter.value : true
        return matchName && matchType
    })
})

const imageUrl = (filename) => `http://localhost:8000/storage/${filename}`

const formatHarga = (val) => Number(val).toLocaleString('id-ID')

const badgeClass = (type) =>
    type === 'Baru'
        ? 'bg-green-100 text-green-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
        : 'bg-yellow-100 text-yellow-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

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

definePageMeta({ layout: 'pelanggan', middleware: 'auth-pelanggan' })
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

/* Tombol default: warna #0E2046 */
.btn-default {
    background-color: #0E2046;
    color: white;
    border-radius: 0.375rem;
    /* rounded-md */
    padding-left: 1rem;
    /* px-4 */
    padding-right: 1rem;
    padding-top: 0.5rem;
    /* py-2 */
    padding-bottom: 0.5rem;
    font-weight: 500;
    width: 100%;
    display: inline-block;
    text-align: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(14, 32, 70, 0.4);
    transition: background 0.3s ease, box-shadow 0.3s ease;
}

.btn-default:hover {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    box-shadow: 0 6px 18px rgba(248, 123, 16, 0.4);
}
</style>
