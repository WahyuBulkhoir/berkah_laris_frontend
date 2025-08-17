<template>
    <header class="bg-white shadow-sm flex items-center justify-between p-4">
        <div class="flex items-center">
            <button id="openSidebar" class="focus:outline-none mr-3" @click="$emit('toggle-sidebar')">
                <i class="fas fa-bars text-gray-600"></i>
            </button>
            <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-10">
                <div class="w-1 h-1 rounded-full flex items-center justify-center p-6 text-white font-semibold">
                    <div class="flex items-center gap-3 px-2">
                        <div
                            class="w-10 h-10 rounded-full bg-[#082f83] text-white flex items-center justify-center font-bold text-lg">
                            {{ initial }}
                        </div>
                    </div>
                    <span class="text-[#F87B10] font-bold">{{ user?.name }}</span>
                </div>

                <button @click="handleLogout" :disabled="auth.isLoggingOut"
                    class="logout-btn px-3 py-2 rounded-md text-sm font-medium text-white">
                    <span v-if="auth.isLoggingOut">
                        <i class="fas fa-spinner fa-spin mr-1"></i> Logout...
                    </span>
                    <span v-else>
                        <i class="fas fa-sign-out-alt mr-1"></i> Logout
                    </span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
    currentPage: String
})

const auth = useAuthStore()
const router = useRouter()
const user = computed(() => auth.user || {})

const initial = computed(() => {
    return user.value?.name?.charAt(0)?.toUpperCase() || '?'
})

const pageTitle = computed(() => {
    const pageTitles = {
        'dashboard': 'Dashboard',
        'add-product': 'Tambah Produk',
        'add-category': 'Tambah Kategori',
        'product-list': 'Daftar Produk',
        'service-list': 'Daftar Servis',
        'sales-report': 'Laporan Penjualan',
        'inventory': 'Inventaris',
        'customers': 'Pelanggan',
        'settings': 'Pengaturan'
    }

    return pageTitles[props.currentPage] || 'Dashboard'
})

async function handleLogout() {
    await auth.logoutUser()
    router.push('/')
}
</script>

<style scoped>
.logout-btn {
    background-color: #d80d0d;
    transition: background 0.3s ease;
}

.logout-btn:hover {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    box-shadow: 0 4px 12px rgba(248, 123, 16, 0.3);
}
</style>
