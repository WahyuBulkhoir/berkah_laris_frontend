<template>
    <section class="max-w-7xl mx-auto px-4 py-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Keranjang Belanja Anda</h2>

        <div v-if="isLoading" class="text-center text-gray-500 py-10">
            <i class="fas fa-spinner fa-spin mr-2"></i> Memuat keranjang...
        </div>

        <div v-else-if="isRemovingItems" class="text-center text-gray-500 py-10">
            <i class="fas fa-spinner fa-spin mr-2"></i> Menghapus item yang belum dibayar...
        </div>

        <div v-else-if="cartItems.length === 0" class="text-center text-gray-500 py-10">
            <i class="fas fa-shopping-cart text-3xl mb-4"></i>
            <p>Keranjang Anda kosong.</p>
            <NuxtLink to="/produk" class="btn-default inline-block mt-4">
                Belanja Sekarang
            </NuxtLink>
        </div>

        <div v-else class="overflow-x-auto space-y-10">
            <!-- Tabel Produk -->
            <table class="min-w-full text-sm text-gray-700">
                <thead class="gradient-blue-vertical text-white text-sm uppercase tracking-wider">
                    <tr>
                        <th class="p-4 text-left w-10">
                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                                class="rounded focus:ring-blue-500" />
                        </th>
                        <th class="p-4 text-left">Produk</th>
                        <th class="p-4 text-center">Harga</th>
                        <th class="p-4 text-center">Jumlah</th>
                        <th class="p-4 text-center">Subtotal</th>
                        <th class="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cartItems" :key="item.id_keranjang"
                        class="bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
                        <td class="p-4">
                            <input type="checkbox" v-model="selectedItems" :value="item.id_keranjang"
                                :disabled="item.produk?.stok === 0"
                                class="rounded focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed" />
                        </td>
                        <td class="p-4">
                            <p class="font-medium">{{ item.produk?.nama_produk }}</p>
                            <p class="text-xs text-gray-500">{{ item.produk?.kategori?.tipe_produk || '—' }}</p>
                            <p v-if="item.produk?.stok === 0" class="text-xs text-red-600 font-semibold mt-1">Stok Habis
                            </p>
                        </td>
                        <td class="p-4 text-center font-semibold">Rp {{ formatHarga(item.produk?.harga) }}</td>
                        <td class="p-4 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <button @click="decrement(item)"
                                    class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">-</button>
                                <span class="min-w-[24px] text-center">{{ item.quantity }}</span>
                                <button @click="increment(item)" :disabled="item.produk?.stok === 0"
                                    class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                            </div>
                        </td>
                        <td class="p-4 text-center font-semibold text-green-700">Rp {{ formatHarga(item.produk?.harga *
                            item.quantity) }}</td>
                        <td class="p-4 text-center">
                            <button @click="removeFromCart(item.id_keranjang)"
                                class="text-red-500 hover:text-red-700 transition"><i
                                    class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''"
                class="mb-6" />

            <!-- Form Data Penerima -->
            <div class="bg-gray-50 p-6 rounded-md border border-gray-200 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">Informasi Penerima</h3>
                </div>

                <!-- Tombol-tombol interaktif -->
                <div class="flex flex-wrap gap-3">
                    <button @click="toggleAlamatDropdown"
                        class="btn-default flex items-center gap-2 disabled:opacity-50" :disabled="isLoadingAlamat">
                        <template v-if="isLoadingAlamat">
                            <i class="fas fa-spinner fa-spin text-blue-500"></i>
                            <span>Memuat Alamat...</span>
                        </template>
                        <template v-else>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Pilih Alamat Tersimpan</span>
                        </template>
                    </button>

                    <button @click="isiDariProfil" class="btn-default flex items-center gap-2 disabled:opacity-50"
                        :disabled="isLoadingProfile">
                        <template v-if="isLoadingProfile">
                            <i class="fas fa-spinner fa-spin text-green-500"></i>
                            <span>Mengisi Profil...</span>
                        </template>
                        <template v-else>
                            <i class="fas fa-user-circle"></i>
                            <span>Gunakan Data Profil</span>
                        </template>
                    </button>
                </div>

                <!-- Dropdown alamat tersimpan -->
                <div v-if="showAlamatDropdown" class="bg-white border rounded p-4 shadow-md space-y-2">
                    <template v-if="isLoadingAlamat">
                        <div class="text-sm text-gray-500 flex items-center gap-2">
                            <i class="fas fa-spinner fa-spin text-blue-500"></i> Memuat daftar alamat...
                        </div>
                    </template>

                    <template v-else-if="daftarAlamat.length === 0">
                        <div class="text-sm text-gray-500 italic">
                            Belum ada alamat tersimpan. Silakan lakukan pemesanan terlebih dahulu untuk menyimpan
                            alamat.
                        </div>
                    </template>

                    <template v-else>
                        <div v-for="alamat in daftarAlamat" :key="alamat.alamat" class="border-b pb-2">
                            <p class="text-sm font-medium">{{ alamat.nama_penerima }} - {{ alamat.no_hp }}</p>
                            <p class="text-sm text-gray-600">{{ alamat.alamat }}</p>
                            <button @click="pilihAlamat(alamat)" class="text-xs text-blue-600 hover:underline mt-1">
                                Gunakan Alamat Ini
                            </button>
                        </div>
                    </template>
                </div>

                <!-- Input data manual -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Nama Penerima</label>
                        <input v-model="form.nama_penerima" type="text"
                            class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Nomor HP</label>
                        <input v-model="form.no_hp" type="tel"
                            class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm text-gray-600 mb-1">Alamat Lengkap</label>
                    <textarea v-model="form.alamat" rows="3"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div>
                    <label class="block text-sm text-gray-600 mb-1">Catatan Tambahan (Opsional)</label>
                    <textarea v-model="form.cat_opsional" rows="2"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"></textarea>
                </div>
            </div>

            <!-- Tombol Checkout -->
            <div class="mt-6 flex flex-col md:flex-row justify-between items-center border-t pt-4">
                <p class="text-lg font-semibold text-gray-700">
                    Total: Rp {{ formatHarga(selectedTotal) }}
                </p>
                <button @click="checkout" :disabled="selectedItems.length === 0 || isLoadingCheckout"
                    class="btn-green mt-4 md:mt-0 flex items-center justify-center gap-2 disabled:opacity-50">
                    <template v-if="isLoadingCheckout">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Memproses...</span>
                    </template>
                    <template v-else>
                        <i class="fas fa-check-circle"></i>
                        <span>Checkout Produk Terpilih</span>
                    </template>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppAlert from '~/components/ui/AppAlert.vue'
import { useCart } from '~/composables/useCart'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const alert = ref({ message: '', type: 'info' })
const isLoading = ref(false)
const selectedItems = ref([])
const selectAll = ref(false)
const { $api } = useNuxtApp()
const config = useRuntimeConfig()
const router = useRouter()
const auth = useAuthStore()
const { cartItems, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart()

const form = ref({
    nama_penerima: '',
    no_hp: '',
    alamat: '',
    cat_opsional: ''
})

const daftarAlamat = ref([])
const showAlamatDropdown = ref(false)
const isLoadingProfile = ref(false)
const isLoadingAlamat = ref(false)
const isLoadingCheckout = ref(false)
const isRemovingItems = ref(false)

const toggleAlamatDropdown = async () => {
    showAlamatDropdown.value = !showAlamatDropdown.value

    if (showAlamatDropdown.value && daftarAlamat.value.length === 0) {
        isLoadingAlamat.value = true
        try {
            const res = await $api.get('/pemesanan/riwayat-alamat')
            daftarAlamat.value = res.data.data
        } catch (error) {
            alert.value = {
                type: 'error',
                message: 'Gagal memuat daftar alamat.'
            }
        } finally {
            isLoadingAlamat.value = false
        }
    }
}

const pilihAlamat = (alamat) => {
    form.value.nama_penerima = alamat.nama_penerima
    form.value.no_hp = alamat.no_hp
    form.value.alamat = alamat.alamat
    showAlamatDropdown.value = false
}

onMounted(async () => {
    if (auth.token) {
        isLoading.value = true
        await fetchCart()
        isLoading.value = false

        const produkHabis = cartItems.value.filter(item => item.produk?.stok === 0)
        if (produkHabis.length > 0) {
            alert.value = {
                type: 'warning',
                message: `Beberapa produk sudah habis stoknya: ${produkHabis.map(p => p.produk?.nama_produk).join(', ')}`
            }
        }

        const { data } = await $api.get('/user/profile-info')
        form.value.nama_penerima = data.nama_penerima || ''
        form.value.no_hp = data.no_hp || ''
        form.value.alamat = data.alamat || ''
    }

    if (process.client && !document.querySelector('#midtrans-script')) {
        const script = document.createElement('script')
        script.id = 'midtrans-script'
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
        script.setAttribute('data-client-key', config.public.midtransClientKey)
        document.head.appendChild(script)
    }
})

const isiDariProfil = async () => {
    isLoadingProfile.value = true
    try {
        const { data } = await $api.get('/user/profile-info')
        form.value.nama_penerima = data.nama_penerima || ''
        form.value.no_hp = data.no_hp || ''
        form.value.alamat = data.alamat || ''
    } catch (error) {
        alert.value = {
            type: 'error',
            message: 'Gagal mengambil data profil.'
        }
    } finally {
        isLoadingProfile.value = false
    }
}

const formatHarga = (val) => Number(val).toLocaleString('id-ID')

const selectedTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        if (selectedItems.value.includes(item.id_keranjang)) {
            const price = parseInt(item.produk?.harga || 0)
            return total + price * item.quantity
        }
        return total
    }, 0)
})

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedItems.value = cartItems.value.map(item => item.id_keranjang)
    } else {
        selectedItems.value = []
    }
}

const increment = (item) => {
    if (item.quantity < item.produk?.stok) {
        updateQuantity(item.id_keranjang, item.quantity + 1)
    } else {
        alert.value = {
            message: `Stok maksimal untuk "${item.produk?.nama_produk}" hanya ${item.produk?.stok}.`,
            type: 'warning'
        }
        setTimeout(() => alert.value.message = '', 3000)
    }
}

const decrement = (item) => {
    if (item.quantity > 1) {
        updateQuantity(item.id_keranjang, item.quantity - 1)
    }
}

const checkout = async () => {
    if (!form.value.nama_penerima || !form.value.no_hp || !form.value.alamat) {
        alert.value = {
            message: 'Lengkapi informasi penerima terlebih dahulu!',
            type: 'warning'
        }
        return
    }

    isLoadingCheckout.value = true

    try {
        const res = await $api.post('/pemesanan', {
            ...form.value,
            selected_items: selectedItems.value
        })

        const snapToken = res.data.snap_token

        if (!snapToken) {
            alert.value = {
                type: 'error',
                message: 'Token pembayaran tidak tersedia.'
            }
            return
        }

        const openSnap = () => {
            if (typeof window.snap !== 'undefined') {
                const selectedBeforeSnap = [...selectedItems.value]

                window.snap.pay(snapToken, {
                    onSuccess: async function () {
                        isLoading.value = true
                        alert.value = { type: 'success', message: 'Pembayaran berhasil! Menghapus item yang dibayar...' }

                        await $api.post('/keranjang/hapus-massal', {
                            id_keranjang: selectedBeforeSnap
                        })
                        await fetchCart()

                        selectedItems.value = []
                        selectAll.value = false
                        form.value = {
                            nama_penerima: '',
                            no_hp: '',
                            alamat: '',
                            cat_opsional: ''
                        }

                        isLoading.value = false

                        setTimeout(() => {
                            router.push('/produk/order/order')
                        }, 3000)
                    },
                    onPending: function () {
                        alert.value = {
                            type: 'info',
                            message: 'Pembayaran tertunda. Silakan selesaikan pembayaran.'
                        }
                    },
                    onError: function () {
                        alert.value = {
                            type: 'error',
                            message: 'Pembayaran gagal. Silakan coba lagi.'
                        }
                    },
                    onClose: async function () {
                        isRemovingItems.value = true
                        try {
                            await $api.post('/pemesanan/batal-checkout', {
                                id_keranjang: selectedBeforeSnap
                            })
                            await $api.post('/keranjang/hapus-massal', {
                                id_keranjang: selectedBeforeSnap
                            })
                            await fetchCart()
                            selectedItems.value = []
                            selectAll.value = false

                            alert.value = {
                                type: 'warning',
                                message: 'Anda menutup popup sebelum menyelesaikan pembayaran. Item telah dihapus & stok dikembalikan.'
                            }
                        } catch (e) {
                            console.error('Gagal rollback stok/keranjang:', e)
                            alert.value = {
                                type: 'error',
                                message: 'Terjadi kesalahan saat membatalkan checkout.'
                            }
                        } finally {
                            isRemovingItems.value = false
                        }
                    }
                })
            } else {
                alert.value = {
                    type: 'error',
                    message: 'Gagal memuat Snap. Silakan refresh halaman.'
                }
            }
        }

        if (typeof window.snap === 'undefined') {
            setTimeout(openSnap, 1000)
        } else {
            openSnap()
        }

        selectedItems.value = []
        selectAll.value = false
        form.value = { nama_penerima: '', no_hp: '', alamat: '', cat_opsional: '' }

    } catch (err) {
        console.error(err)
        alert.value = {
            type: 'error',
            message: 'Checkout gagal. Silakan coba lagi.'
        }
    } finally {
        isLoadingCheckout.value = false
    }
}

watch(selectedItems, val => {
    selectAll.value = val.length === cartItems.value.length
})

definePageMeta({
    layout: 'pelanggan',
    middleware: 'auth-pelanggan'
})
</script>

<style scoped>
.btn-default {
    background-color: #0E2046;
    /* Warna biru gelap default */
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(14, 32, 70, 0.4);
    transition: background 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    user-select: none;
}

.btn-default:hover {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    box-shadow: 0 6px 18px rgba(248, 123, 16, 0.5);
    text-decoration: none;
}

.btn-default:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-green {
    background-color: #16a34a;
    /* Warna hijau checkout */
    color: white;
    border-radius: 0.375rem;
    padding-left: 1.5rem;
    /* px-6 */
    padding-right: 1.5rem;
    padding-top: 0.5rem;
    /* py-2 */
    padding-bottom: 0.5rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    user-select: none;
}

.btn-green:hover {
    background-color: #15803d;
    /* Hijau lebih gelap saat hover */
}

.btn-green:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.gradient-blue-vertical {
    background: linear-gradient(to bottom, #0E2046, #082f83);
    color: white;
}
</style>