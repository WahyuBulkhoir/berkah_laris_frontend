<template>
    <div>
        <div class="flex justify-between items-end h-64 relative">
            <div v-for="(month, index) in months" :key="index" class="chart-bar"
                :style="{ height: `${month.height}%`, left: `${2 + (index * 8.5)}%` }" :data-month="month.name"
                :data-value="formatCurrency(month.value)" @mouseover="showTooltip($event, month)"
                @mouseout="hideTooltip">
            </div>
        </div>

        <div v-if="tooltip.show" class="bg-gray-800 text-white px-2 py-1 rounded text-xs absolute z-10"
            :style="{ bottom: `${tooltip.bottom}px`, left: `${tooltip.left}px`, transform: 'translateX(-50%)' }">
            {{ tooltip.text }}
        </div>

        <!-- Label Bulan -->
        <div class="flex justify-between text-xs text-gray-500 mt-2 px-2 relative z-10">
            <span v-for="(month, index) in months" :key="'label-' + index" class="month-label w-[4%] text-center block">
                {{ month.name }}
            </span>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $api } = useNuxtApp()

const months = ref([])
const tooltip = ref({
    show: false,
    text: '',
    bottom: 0,
    left: 0
})

const showTooltip = (event, month) => {
    const rect = event.target.getBoundingClientRect()

    tooltip.value = {
        show: true,
        text: `${month.name}: ${formatCurrency(month.value)}`,
        bottom: window.innerHeight - rect.top + 10,
        left: rect.left + rect.width / 2
    }
}

const hideTooltip = () => {
    tooltip.value.show = false
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value)
}

const fetchData = async () => {
    try {
        const currentYear = new Date().getFullYear()

        // Panggil endpoint API yang sesuai
        const { data } = await $api.get('/laporan/penjualan', {
            params: { tahun: currentYear }
        })

        const penjualanData = data.data || []

        const maxValue = Math.max(...penjualanData.map(item => item.total_penjualan), 1)

        months.value = penjualanData.map(item => ({
            name: item.nama_bulan,
            value: item.total_penjualan,
            height: Math.round((item.total_penjualan / maxValue) * 100)
        }))
    } catch (error) {
        console.error('Gagal mengambil data grafik:', error)
    }
}

onMounted(fetchData)
</script>

<style scoped>
.chart-bar {
    position: absolute;
    bottom: 0;
    width: 4%;
    background: linear-gradient(to top, #0ea5e9, #38bdf8);
    border-radius: 4px 4px 0 0;
    transition: height 0.6s ease;
}

.chart-container {
    height: 300px;
    position: relative;
}

.month-label {
    white-space: nowrap;
    transform-origin: top left;
    transition: transform 0.3s ease;
}

/* Saat layar mobile (misalnya max 768px), miringkan label */
@media (max-width: 768px) {
    .month-label {
        transform: rotate(-65deg);
        font-size: 10px;
        margin-top: 16px;
    }
}
</style>
