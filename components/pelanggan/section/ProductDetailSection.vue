<template>
    <div v-show="isOpen"
        class="fixed inset-0 z-50 bg-blend-color bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="flex items-center justify-center min-h-screen px-4 py-10 text-center">
            <div
                class="inline-block bg-white text-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-4xl w-full">
                <div class="bg-white px-6 pt-5 pb-6">

                    <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message"
                        @close="alert.message = ''" class="mb-4" />

                    <div class="flex justify-between items-center border-b pb-4">
                        <h3 class="text-2xl font-bold text-gray-900">Detail Produk</h3>
                        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-gray-100 p-6 rounded-xl flex items-center justify-center">
                            <img :src="product?.gambar_produk ? imageUrl(product.gambar_produk) : '/img/product-default.jpg'"
                                alt="Gambar Produk" class="h-64 w-64 object-cover rounded-xl shadow-2xl" />
                        </div>

                        <div>
                            <h2 class="text-3xl font-bold text-gray-800">
                                {{ product?.nama_produk || 'Nama produk tidak tersedia' }}
                            </h2>

                            <p class="mt-3 text-2xl font-semibold text-[#F87B10]">
                                Rp {{ formatHarga(product?.harga || 0) }}
                            </p>

                            <p class="mt-1 text-sm text-gray-600">
                                Stok tersedia:
                                <span class="font-semibold text-gray-800">{{ product?.stok || 0 }}</span>
                            </p>

                            <div class="mt-3" v-if="product?.kategori?.tipe_produk">
                                <span :class="[
                                    product.kategori.tipe_produk === 'Baru'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800',
                                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold'
                                ]">
                                    {{ product.kategori.tipe_produk }}
                                </span>
                            </div>

                            <div class="mt-6">
                                <h3 class="text-lg font-medium text-gray-900">Jumlah</h3>
                                <div class="mt-2 flex items-center gap-4">
                                    <button @click="decrementQty"
                                        class="w-9 h-9 flex items-center justify-center bg-gray-200 text-xl text-gray-700 rounded-md hover:bg-gray-300">-</button>
                                    <span class="text-xl font-semibold">{{ quantity }}</span>
                                    <button @click="incrementQty"
                                        class="w-9 h-9 flex items-center justify-center bg-gray-200 text-xl text-gray-700 rounded-md hover:bg-gray-300">+</button>
                                </div>
                            </div>

                            <div class="mt-6">
                                <h3 class="text-lg font-medium text-gray-900">Deskripsi</h3>
                                <p class="mt-2 text-gray-600 whitespace-pre-line">
                                    {{ product?.deskripsi || 'Tidak ada deskripsi.' }}
                                </p>
                            </div>

                            <div class="mt-6" v-if="product?.spesifikasi?.length">
                                <h3 class="text-lg font-medium text-gray-900">Spesifikasi</h3>
                                <ul class="mt-2 space-y-2">
                                    <li v-for="(spec, index) in product.spesifikasi" :key="index"
                                        class="flex items-start">
                                        <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span class="text-gray-600">{{ spec }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex flex-col sm:flex-row gap-4">
                        <button @click="addToCartHandler" :disabled="isAddingToCart || product?.stok <= 0" class="w-full inline-flex justify-center items-center px-5 py-3 text-sm font-medium text-white rounded-md transition
                            btn-default
                            disabled:opacity-50 disabled:cursor-not-allowed">
                            <template v-if="isAddingToCart">
                                <i class="fas fa-spinner fa-spin mr-2"></i> Menambahkan...
                            </template>
                            <template v-else-if="product?.stok <= 0">
                                <i class="fas fa-box-open mr-2"></i> Stok Habis
                            </template>
                            <template v-else>
                                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Masukkan ke Keranjang
                            </template>
                        </button>
                    </div>
                    <p v-if="product?.stok <= 3 && product?.stok > 0" class="mt-2 text-sm text-red-600">
                        ⚠️ Stok hampir habis (tersisa {{ product.stok }})
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppAlert from '~/components/ui/AppAlert.vue'
import { useCart } from '~/composables/useCart'
import { useAuthStore } from '~/stores/auth'
import { useNuxtApp } from '#app'

const { addToCart } = useCart()
const auth = useAuthStore()
const { $api } = useNuxtApp()
const props = defineProps({ isOpen: Boolean, product: Object })
const emit = defineEmits(['close'])
const quantity = ref(1)
const alert = ref({ message: '', type: 'success' })
const isAddingToCart = ref(false)
const imageUrl = (filename) => `http://localhost:8000/storage/${filename}`
const formatHarga = (val) => Number(val).toLocaleString('id-ID')

function incrementQty() {
    if (quantity.value < props.product?.stok) quantity.value++
}

function decrementQty() {
    if (quantity.value > 1) quantity.value--
}

function closeModal() {
    emit('close')
}

async function addToCartHandler() {
    if (!auth.user?.id_user) {
        alert.value = {
            message: 'Silakan login terlebih dahulu untuk menambahkan ke keranjang.',
            type: 'warning'
        }
        return
    }

    isAddingToCart.value = true
    try {
        const res = await $api.get('/keranjang')
        const existingItem = res.data.find(item => item.produk_id === props.product.id_produk)
        const totalInCart = existingItem ? existingItem.quantity : 0
        const totalQty = totalInCart + quantity.value

        if (totalQty > props.product.stok) {
            alert.value = {
                message: `Stok tersedia hanya ${props.product.stok}. Di keranjang sudah ada ${totalInCart}, tidak bisa menambahkan ${quantity.value} lagi.`,
                type: 'warning'
            }
            return
        }

        await addToCart(props.product.id_produk, quantity.value)

        alert.value = {
            message: `Produk "${props.product.nama_produk}" (${quantity.value}x) berhasil ditambahkan ke keranjang.`,
            type: 'success'
        }
    } catch (err) {
        alert.value = {
            message: err.message || 'Gagal menambahkan ke keranjang. Silakan coba lagi.',
            type: 'error'
        }
    } finally {
        isAddingToCart.value = false
        setTimeout(() => {
            alert.value.message = ''
        }, 3000)
    }
}

watch(() => props.isOpen, (val) => {
    if (val) {
        quantity.value = 1
        alert.value.message = ''
        isAddingToCart.value = false
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    }
})
</script>

<style scoped>
.btn-default {
    background-color: #0E2046;
    color: white;
    border-radius: 0.375rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-weight: 500;
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(14, 32, 70, 0.4);
    transition: background 0.3s ease, box-shadow 0.3s ease;
}

.btn-default:hover {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    box-shadow: 0 6px 18px rgba(248, 123, 16, 0.4);
}

.btn-default:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
