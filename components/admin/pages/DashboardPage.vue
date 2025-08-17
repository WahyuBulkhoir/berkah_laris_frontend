<template>
    <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Penjualan" :loading="loading"
                :value="'Rp ' + Number(totalPenjualan).toLocaleString('id-ID')" :change="`${totalPesanan} pesanan`"
                icon="fas fa-shopping-cart" color="blue" trend="up" />
            <StatCard title="Total Produk" :loading="loading" :value="totalProduk.toString()" change=""
                icon="fas fa-box" color="green" trend="flat" />
            <StatCard title="Total Pelanggan" :loading="loading" :value="totalPelanggan.toString()" change=""
                icon="fas fa-users" color="purple" trend="flat" />
            <StatCard title="Pesanan Baru" :loading="loading" :value="pesananBaru.toString()" change="Belum diproses"
                icon="fas fa-clipboard-list" color="yellow" trend="waiting" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-5 lg:col-span-2">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Penjualan Bulanan</h3>
                </div>
                <MonthlySalesChart :chart-data="salesChartData" />
            </div>

            <div class="bg-white rounded-lg shadow p-5">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Produk Terlaris</h3>
                </div>
                <TopProductsList :topProducts="topProducts" :loading="loading" />
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="bg-white rounded-lg shadow p-5">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Pesanan Terbaru</h3>
                </div>
                <RecentOrdersTable :orders="recentOrders" :loading="loading" />
            </div>

            <div class="bg-white rounded-lg shadow p-5">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Stok Menipis</h3>
                </div>
                <LowStockTable :lowStockProducts="lowStockProducts" :loading="loading" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

import StatCard from '~/components/admin/dashboard/StatCard.vue'
import MonthlySalesChart from '~/components/admin/dashboard/MonthlySalesChart.vue'
import TopProductsList from '~/components/admin/dashboard/TopProductsList.vue'
import RecentOrdersTable from '~/components/admin/dashboard/RecentOrdersTable.vue'
import LowStockTable from '~/components/admin/dashboard/LowStockTable.vue'

const { $api } = useNuxtApp()
const loading = ref(true)
const totalPenjualan = ref(0)
const totalPesanan = ref(0)
const totalProduk = ref(0)
const totalPelanggan = ref(0)
const pesananBaru = ref(0)
const topProducts = ref([])
const salesChartData = ref([])
const recentOrders = ref([])
const lowStockProducts = ref([])

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

const fetchDashboardData = async () => {
    loading.value = true
    try {
        const statsRes = await $api.get('/dashboard/stats', {
            params: { bulan: currentMonth, tahun: currentYear }
        })
        const stats = statsRes.data
        totalPenjualan.value = stats.total_penjualan ?? 0
        totalPesanan.value = stats.total_pesanan ?? 0
        totalProduk.value = stats.total_produk ?? 0
        totalPelanggan.value = stats.total_pelanggan ?? 0
        pesananBaru.value = stats.pesanan_baru ?? 0

        const topProductRes = await $api.get('/dashboard/top-products', {
            params: { tahun: currentYear }
        })
        topProducts.value = topProductRes.data.top_products ?? []

        const recentRes = await $api.get('/dashboard/recent-orders')
        recentOrders.value = recentRes.data.data ?? []

        const lowStockRes = await $api.get('/dashboard/low-stock-products')
        lowStockProducts.value = lowStockRes.data.data ?? []

        const salesRes = await $api.get('/laporan/penjualan', {
            params: { tahun: currentYear }
        })
        salesChartData.value = salesRes.data.data ?? []

    } catch (error) {
        console.error('Gagal mengambil data dashboard:', error)
    } finally {
        loading.value = false
    }
}

onMounted(fetchDashboardData)
</script>
