<template>
  <AddCategoryPage />
</template>

<script setup>
import AddCategoryPage from '~/components/admin/pages/AddCategoryPage.vue'
definePageMeta({ layout: 'admin', middleware: 'auth-admin' })
</script>