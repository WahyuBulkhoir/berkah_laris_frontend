<template>
    <div>
        <AppNavbar />
        <slot />
        <AppFooter />
    </div>
</template>

<script setup>
import AppNavbar from '~/components/pelanggan/AppNavbar.vue'
import AppFooter from '~/components/pelanggan/AppFooter.vue'
</script>
