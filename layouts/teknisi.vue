<template>
    <div class="flex h-screen">
        <Sidebar :isOpen="isSidebarOpen" />

        <div class="flex-1 flex flex-col overflow-hidden">
            <Header @toggle-sidebar="toggleSidebar" />
            <main class="flex-1 overflow-y-auto bg-gray-100 p-4">
                <Transition name="fade-slide" mode="out-in">
                    <slot />
                </Transition>
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '~/components/teknisi/Sidebar.vue'
import Header from '~/components/teknisi/Header.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
    auth.logout()
    router.push('/auth/login')
}

const isSidebarOpen = ref(true)

function updateSidebarState() {
    const isMobile = window.innerWidth < 768
    isSidebarOpen.value = !isMobile
}

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
    updateSidebarState()
    window.addEventListener('resize', updateSidebarState)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateSidebarState)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
