<template>
    <SalesReportPage />
</template>

<script setup>
import SalesReportPage from '~/components/admin/pages/SalesReportPage.vue';

definePageMeta({ layout: 'admin', middleware: 'auth-admin' })
</script>
