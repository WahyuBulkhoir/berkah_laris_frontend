import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRuntimeConfig } from '#app'

const cartItems = ref([])
const isLoading = ref(false)

export const useCart = () => {
    const auth = useAuthStore()
    const config = useRuntimeConfig()

    const cartTotal = computed(() =>
        cartItems.value.reduce((total, item) => {
            const price = parseInt(item.produk?.harga || 0)
            return total + price * item.quantity
        }, 0)
    )

    const cartCount = computed(() =>
        cartItems.value.reduce((total, item) => total + item.quantity, 0)
    )

    async function fetchCart() {
        isLoading.value = true
        try {
            const data = await $fetch(`${config.public.apiBase}/keranjang`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            cartItems.value = data
        } catch (error) {
            console.error('Gagal mengambil keranjang:', error)
        } finally {
            isLoading.value = false
        }
    }

    async function addToCart(produkId, quantity = 1) {
        if (!auth.user?.id_user) {
            console.warn('⚠️ Tidak ada auth.user.id_user saat addToCart')
            throw new Error('User belum login')
        }

        try {
            await $fetch(`${config.public.apiBase}/keranjang`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
                body: {
                    produk_id: produkId,
                    quantity,
                }
            })
            await fetchCart()
        } catch (err) {
            if (err?.response?.status === 422) {
                throw new Error(err.response._data?.message || 'Jumlah melebihi stok')
            }
            console.error('❌ Gagal menambahkan ke keranjang:', err)
            throw new Error('Gagal menambahkan ke keranjang')
        }
    }

    async function removeFromCart(id_keranjang) {
        try {
            await $fetch(`${config.public.apiBase}/keranjang/${id_keranjang}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            await fetchCart()
        } catch (err) {
            console.error('Gagal menghapus produk', err)
        }
    }

    async function updateQuantity(id_keranjang, quantity) {
        try {
            await $fetch(`${config.public.apiBase}/keranjang/${id_keranjang}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                body: { quantity }
            })
            await fetchCart()
        } catch (err) {
            console.error('Gagal update jumlah', err)
        }
    }

    async function clearCart() {
        const ids = cartItems.value.map(item => item.id_keranjang)
        await Promise.all(ids.map(id => removeFromCart(id)))
    }

    return {
        cartItems,
        cartTotal,
        cartCount,
        isLoading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    }
}
