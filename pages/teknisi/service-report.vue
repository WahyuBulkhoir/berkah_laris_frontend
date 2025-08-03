<template>
    <ServiceReportPage />
</template>

<script setup>
import ServiceReportPage from '~/components/teknisi/pages/ServiceReportPage.vue';

definePageMeta({ layout: 'teknisi', middleware: 'auth-teknisi' })
</script>
