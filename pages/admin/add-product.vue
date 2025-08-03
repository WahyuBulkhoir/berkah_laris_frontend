<template>
  <AddProductPage />
</template>

<script setup>
import AddProductPage from '~/components/admin/pages/AddProductPage.vue'
definePageMeta({ layout: 'admin', middleware: 'auth-admin' })
</script>