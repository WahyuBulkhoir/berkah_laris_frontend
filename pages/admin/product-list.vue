<template>
    <ProductListPage />
</template>

<script setup>
import ProductListPage from '~/components/admin/pages/ProductListPage.vue'

definePageMeta({ layout: 'admin', middleware: 'auth-admin' })
</script>
