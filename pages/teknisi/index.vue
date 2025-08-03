<template>
    <DashboardPage />
</template>

<script setup>
import DashboardPage from '~/components/teknisi/pages/DashboardPage.vue'
definePageMeta({ layout: 'teknisi', middleware: 'auth-teknisi' })
</script>