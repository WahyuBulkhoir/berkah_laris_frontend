<template>
  <aside :class="[
    'bg-blue-600 text-white shadow h-full transition-all duration-300 ease-in-out overflow-hidden',
    isOpen ? 'w-64 p-4 space-y-4' : 'w-16 p-2 space-y-4'
  ]">
    <!-- Logo + Usaha -->
    <div class="flex items-center gap-3 px-2">
      <div class="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
        <svg class="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M13 3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 10H5V5h7v8zm8-8h-4v2h4v7h-4v2h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
        </svg>
      </div>
      <span v-if="isOpen" class="text-white font-bold text-xl">BerkahLaris</span>
    </div>
    <div class="border-t border-blue-300 my-8"></div>
    <!-- Menu -->
    <div v-for="item in menuItems" :key="item.path">
      <NuxtLink :to="item.path"
        class="flex items-center gap-3 py-2 px-3 rounded hover:bg-blue-500 transition-all duration-200">
        <i :class="[item.icon, 'text-lg']" />
        <span v-if="isOpen" class="whitespace-nowrap">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { computed } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const auth = useAuthStore()
const user = computed(() => auth.user || {})

const initial = computed(() => {
  return user.value?.name?.charAt(0)?.toUpperCase() || '?'
})

// Menu Sidebar
const menuItems = [
  { path: '/teknisi', label: 'Dashboard', icon: 'fas fa-home' },
  { path: '/teknisi/service-list', label: 'Layanan Servis', icon: 'fas fa-tools' },
  { path: '/teknisi/service-report', label: 'Laporan Servis', icon: 'fas fa-chart-line' },
]
</script>
