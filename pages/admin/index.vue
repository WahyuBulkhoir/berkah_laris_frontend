<template>
  <DashboardPage />
</template>

<script setup>
import DashboardPage from '~/components/admin/pages/DashboardPage.vue'
definePageMeta({ layout: 'admin', middleware: 'auth-admin' })
</script>