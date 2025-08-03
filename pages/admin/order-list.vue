<template>
    <OrderListPage />
</template>

<script setup>
import OrderListPage from '~/components/admin/pages/OrderListPage.vue';

definePageMeta({ layout: 'admin', middleware: 'auth-admin' })
</script>
