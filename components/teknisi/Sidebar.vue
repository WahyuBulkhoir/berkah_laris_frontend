<template>
  <aside :class="[
    'bg-[#0E2046] text-white shadow h-full transition-all duration-300 ease-in-out overflow-hidden',
    isOpen ? 'w-64 p-4 space-y-4' : 'w-16 p-2 space-y-4'
  ]">
    <div class="h-16 flex items-center mb-0 justify-center">
      <img v-show="!isOpen || isMobile" src="/img/logo-bulat.png" alt="Logo Bulat BerkahLaris"
        class="h-12 w-12 rounded-full object-cover transition-opacity duration-300"
        :class="{ 'opacity-0': !(!isOpen || isMobile), 'opacity-100': !isOpen || isMobile }" />
      <img v-show="isOpen && !isMobile" src="/img/logo-bl-h-w.png" alt="Logo BerkahLaris"
        class="h-13 w-auto transition-opacity duration-300"
        :class="{ 'opacity-0': !(isOpen && !isMobile), 'opacity-100': isOpen && !isMobile }" />
    </div>

    <div class="border-t border-blue-300 my-8"></div>

    <div v-for="item in menuItems" :key="item.path">
      <NuxtLink :to="item.path" class="flex items-center gap-3 py-2 px-3 rounded transition-all duration-200" :class="[
        isActive(item.path)
          ? 'bg-gradient-to-t from-[#F87B10] via-[#FEB10B] to-[#FEB10B]'
          : 'bg-[#0E2046] hover:bg-gradient-to-t hover:from-[#F87B10] hover:via-[#FEB10B] hover:to-[#FEB10B]'
      ]">
        <i :class="[item.icon, 'text-lg']" />
        <span v-if="isOpen" class="whitespace-nowrap">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const route = useRoute()
const auth = useAuthStore()
const user = computed(() => auth.user || {})
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  const img1 = new Image()
  img1.src = '/img/logo-bulat.png'
  const img2 = new Image()
  img2.src = '/img/logo-bl-h-w.png'
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

const initial = computed(() => {
  return user.value?.name?.charAt(0)?.toUpperCase() || '?'
})

const isActive = (path) => route.path === path

const menuItems = [
  { path: '/teknisi', label: 'Dashboard', icon: 'fas fa-home' },
  { path: '/teknisi/service-list', label: 'Layanan Servis', icon: 'fas fa-tools' },
  { path: '/teknisi/service-report', label: 'Laporan Servis', icon: 'fas fa-chart-line' },
]
</script>