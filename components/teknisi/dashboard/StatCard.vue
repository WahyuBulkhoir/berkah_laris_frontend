<template>
    <div class="bg-white rounded-lg shadow p-5">
        <div class="flex justify-between">
            <div>
                <div class="text-gray-500 text-sm">{{ title }}</div>
                <div class="text-2xl font-bold text-gray-800">{{ value }}</div>
                <div :class="trendClass">
                    <i :class="trendIcon"></i> {{ change }}
                </div>
            </div>
            <div :class="`bg-${color}-100 rounded-full h-12 w-12 flex items-center justify-center`">
                <i :class="`${icon} text-${color}-600 text-xl`"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: String,
    value: String,
    change: String,
    icon: String,
    color: String,
    trend: String
});

const trendClass = computed(() => {
    switch (props.trend) {
        case 'up':
            return 'text-green-500 text-sm mt-1';
        case 'down':
            return 'text-red-500 text-sm mt-1';
        case 'waiting':
            return 'text-yellow-500 text-sm mt-1';
        default:
            return 'text-gray-500 text-sm mt-1';
    }
});

const trendIcon = computed(() => {
    switch (props.trend) {
        case 'up':
            return 'fas fa-arrow-up';
        case 'down':
            return 'fas fa-arrow-down';
        case 'waiting':
            return 'fas fa-clock';
        default:
            return 'fas fa-minus';
    }
});
</script>