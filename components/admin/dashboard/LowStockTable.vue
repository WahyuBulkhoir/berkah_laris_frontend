<template>
    <div class="overflow-x-auto rounded-xl shadow border border-gray-100">
        <table class="min-w-full bg-white divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nama Produk
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        SKU
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Kategori
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Stok
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <!-- Skeleton Loading -->
                <tr v-if="loading" v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-10"></div>
                    </td>
                </tr>

                <!-- No Data -->
                <tr v-else-if="lowStockProducts.length === 0">
                    <td colspan="4" class="text-center text-gray-400 py-6 text-sm">
                        Tidak ada produk dengan stok menipis.
                    </td>
                </tr>

                <!-- Data -->
                <tr v-else v-for="(product, index) in lowStockProducts" :key="index"
                    class="hover:bg-gray-50 transition duration-200">
                    <td class="px-4 py-3 text-sm font-medium text-gray-800" :title="product.nama_produk">
                        {{ shortenProductName(product.nama_produk) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                        {{ product.sku }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">
                        {{ product.kategori?.tipe_produk || '-' }}
                    </td>
                    <td class="px-4 py-3 text-sm">
                        <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                            :class="getStockBadge(product.stok)">
                            {{ product.stok }} unit
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    lowStockProducts: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const shortenProductName = (name) => {
    const words = name.trim().split(/\s+/)
    return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : name
}

const getStockBadge = (stock) => {
    if (stock <= 2) return 'bg-red-100 text-red-800'
    if (stock <= 4) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-700'
}
</script>
