<template>
    <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-2 animate-pulse">
            <div v-for="i in 5" :key="i" class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-lg bg-gray-200"></div>
                <div class="flex-1 space-y-1">
                    <div class="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div class="w-full h-1.5 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>

        <!-- No Data -->
        <div v-else-if="topProducts.length === 0" class="text-gray-400 text-sm text-center">
            Tidak ada data produk terlaris.
        </div>

        <!-- Produk Terlaris -->
        <div v-else v-for="(product, index) in topProducts" :key="index" class="flex items-center space-x-3">
            <!-- Gambar Produk -->
            <div class="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img :src="getImageUrl(product.gambar)" alt="gambar produk" class="w-full h-full object-cover"
                    @error="onImageError" />
            </div>

            <!-- Informasi Produk -->
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between space-x-2" :title="product.name">
                    <span class="font-medium truncate max-w-[60%]">
                        {{ product.name || 'Nama Produk' }}
                    </span>
                    <span class="text-gray-500 text-sm whitespace-nowrap">
                        {{ product.sold || 0 }} terjual
                    </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div class="h-1.5 rounded-full transition-all duration-300"
                        :class="`bg-${getColor(product.color)}-600`"
                        :style="{ width: `${Math.max(product.percentage || 0, 5)}%` }">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    topProducts: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const defaultImage = '/img/product-default.jpg'

const getImageUrl = (url) => {
    return url || defaultImage
}

const onImageError = (event) => {
    event.target.src = defaultImage
}

const getColor = (color) => {
    const allowed = ['blue', 'green', 'purple', 'red']
    return allowed.includes(color) ? color : 'gray'
}
</script>