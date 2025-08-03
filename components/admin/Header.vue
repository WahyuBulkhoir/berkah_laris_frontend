<template>
    <header class="bg-white shadow-sm flex items-center justify-between p-4">
        <div class="flex items-center">
            <button id="openSidebar" class="focus:outline-none mr-3" @click="$emit('toggle-sidebar')">
                <i class="fas fa-bars text-gray-600"></i>
            </button>
            <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center space-x-4">
            <!-- Notification
            <div class="relative">
                <button class="focus:outline-none">
                    <i class="fas fa-bell text-gray-600"></i>
                    <span
                        class="notification-badge absolute bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
            </div> -->

            <!-- Profile + Logout -->
            <div class="flex items-center space-x-10">
                <div class="w-1 h-1 rounded-full flex items-center justify-center p-6 text-white font-semibold">
                    <!-- Avatar + Username -->
                    <div class="flex items-center gap-3 px-2">
                        <div
                            class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                            {{ initial }}
                        </div>
                    </div>
                    <span class="text-blue-600 font-bold">{{ user?.name }}</span>
                </div>

                <!-- Logout button -->
                <button @click="handleLogout" :disabled="auth.isLoggingOut"
                    class="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
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
.notification-badge {
    top: -5px;
    right: -5px;
}
</style>
