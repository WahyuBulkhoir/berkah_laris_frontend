<template>
    <HeroSection />
    <ProductSection />
    <ServiceSection />
    <AboutSection />
    <ContactSection />
</template>

<script setup>
import HeroSection from '~/components/pelanggan/HeroSection.vue'
import ProductSection from '~/components/pelanggan/section/ProductSection.vue'
import ServiceSection from '~/components/pelanggan/section/ServiceSection.vue'
import AboutSection from '~/components/pelanggan/section/AboutSection.vue'
import ContactSection from '~/components/pelanggan/section/ContactSection.vue'

definePageMeta({ layout: 'pelanggan', middleware: 'auth-pelanggan' })
</script>