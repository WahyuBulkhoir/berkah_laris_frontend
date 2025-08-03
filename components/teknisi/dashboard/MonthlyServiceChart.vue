<template>
    <div class="chart-container">
        <div class="flex justify-between items-end h-full relative">
            <div v-for="(month, index) in months" :key="index" class="chart-bar"
                :style="{ height: `${month.height}%`, left: `${1 + (index * 8.3)}%` }" :data-month="month.name"
                :data-value="formatCurrency(month.value)" @mouseover="showTooltip($event, month)"
                @mouseout="hideTooltip"></div>
        </div>

        <div v-if="tooltip.show" class="bg-gray-800 text-white px-2 py-1 rounded text-xs absolute z-10"
            :style="{ bottom: `${tooltip.bottom}px`, left: `${tooltip.left}px`, transform: 'translateX(-50%)' }">
            {{ tooltip.text }}
        </div>
    </div>

    <!-- Label Bulan -->
    <div class="flex justify-between text-xs text-gray-500 mt-2 px-2 relative z-10">
        <span v-for="(month, index) in months" :key="'label-' + index" class="month-label w-[4%] text-center block">
            {{ month.name }}
        </span>
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

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value)
}

const fetchMonthlyData = async () => {
    try {
        const res = await $api.get('/dashboard/teknisi/monthly')
        months.value = res.data
    } catch (err) {
        console.error('Gagal mengambil data grafik bulanan:', err)
    }
}

const showTooltip = (event, month) => {
    tooltip.value = {
        show: true,
        text: `${month.name}: ${formatCurrency(month.value)}`,
        bottom: month.height + 10,
        left: event.target.offsetLeft + (event.target.offsetWidth / 2)
    }
}

const hideTooltip = () => {
    tooltip.value.show = false
}

onMounted(fetchMonthlyData)
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

@media (max-width: 768px) {
    .month-label {
        transform: rotate(-65deg);
        font-size: 10px;
        margin-top: 16px;
    }
}
</style>
