<template>
    <DailySalesChart />
</template>

<script setup>
import DailySalesChart from '~/components/admin/pages/DailySalesChartPage.vue';

definePageMeta({ layout: 'admin', middleware: 'auth-admin' })
</script>
