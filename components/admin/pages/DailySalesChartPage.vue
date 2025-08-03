<template>
    <div class="chart-container" style="height: 250px;">
        <div class="flex justify-between items-end h-full relative">
            <div v-for="(day, index) in days" :key="index" class="chart-bar mx-[-5px] bg-blue-500 rounded"
                :style="{ height: `${day.height}%`, left: `${(index * 3.3)}%` }" :data-day="day.day"
                :data-value="day.value" @mouseover="showTooltip($event, day)" @mouseout="hideTooltip">
            </div>
        </div>

        <div v-if="tooltip.show" class="bg-gray-800 text-white px-2 py-1 rounded text-xs absolute z-10"
            :style="{ bottom: `${tooltip.bottom}px`, left: `${tooltip.left}px`, transform: 'translateX(-50%)' }">
            {{ tooltip.text }}
        </div>
    </div>

    <div class="flex justify-between text-xs text-gray-500 mt-2">
        <span>1</span>
        <span>6</span>
        <span>11</span>
        <span>16</span>
        <span>21</span>
        <span>26</span>
        <span>31</span>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props dari luar (SalesReportPage.vue)
const props = defineProps({
    salesData: {
        type: Array,
        default: () => []
    }
})

// Konversi ke height persen untuk visual
const maxValue = computed(() => {
    return Math.max(...props.salesData.map(item => item.total || 0), 1)
})

const days = computed(() => {
    return Array.from({ length: 31 }, (_, i) => {
        const found = props.salesData.find(item => item.day === i + 1)
        const total = found?.total || 0
        const height = Math.round((total / maxValue.value) * 100)

        return {
            day: i + 1,
            height,
            value: `Rp ${total.toLocaleString('id-ID')}`
        }
    })
})

// Tooltip logika
const tooltip = ref({
    show: false,
    text: '',
    bottom: 0,
    left: 0
})

const showTooltip = (event, day) => {
    tooltip.value = {
        show: true,
        text: `Hari ${day.day}: ${day.value}`,
        bottom: day.height + 10,
        left: event.target.offsetLeft + (event.target.offsetWidth / 2)
    }
}

const hideTooltip = () => {
    tooltip.value.show = false
}
</script>
<style scoped>
.chart-bar {
    position: absolute;
    width: 3%;
    border-radius: 6px 6px 0 0;
    transition: all 0.3s ease;
}
</style>