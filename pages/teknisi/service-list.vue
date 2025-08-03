<template>
    <ServiceListPage />
</template>

<script setup>
import ServiceListPage from '~/components/teknisi/pages/ServiceListPage.vue'

definePageMeta({ layout: 'teknisi', middleware: 'auth-teknisi' })
</script>
