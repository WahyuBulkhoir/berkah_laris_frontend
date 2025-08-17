<template>
    <div class="overflow-x-auto rounded-xl shadow border border-gray-100">
        <table class="min-w-full bg-white divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col"
                        class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID Servis
                    </th>
                    <th scope="col"
                        class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Pelanggan
                    </th>
                    <th scope="col"
                        class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                    </th>
                    <th scope="col"
                        class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                    </th>
                </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
                <tr v-if="loading" v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                </tr>

                <tr v-else-if="orders.length === 0">
                    <td colspan="4" class="text-center text-gray-400 py-6 text-sm">
                        Tidak ada data servis terbaru.
                    </td>
                </tr>

                <tr v-else v-for="(order, index) in orders" :key="index"
                    class="hover:bg-gray-50 transition-colors duration-200 ease-in-out">
                    <td class="px-4 py-3 text-sm font-medium text-gray-800">
                        {{ order.id }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                        {{ order.customer }}
                    </td>
                    <td class="px-4 py-3">
                        <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                            :class="getStatusBadge(order.status)">
                            {{ order.status }}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-800">
                        {{ order.total }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    orders: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const getStatusBadge = (status) => {
    switch (status) {
        case 'Selesai':
            return 'bg-green-100 text-green-800';
        case 'Diproses':
            return 'bg-yellow-100 text-yellow-800';
        case 'Menunggu':
            return 'bg-blue-100 text-blue-800';
        case 'Dibatalkan':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}
</script>
