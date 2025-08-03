<template>
    <div>
        <!-- Stat Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Pendapatan Servis" :loading="loading"
                :value="`Rp ${Number(stat.total_pendapatan).toLocaleString('id-ID')}`" change="-" icon="fas fa-wallet"
                color="blue" trend="up" />
            <StatCard title="Total Barang Servis" :loading="loading" :value="stat.total_servis.toString()" change="-"
                icon="fas fa-tools" color="green" trend="up" />
            <StatCard title="Total Pelanggan Servis" :loading="loading" :value="stat.total_pelanggan.toString()"
                change="-" icon="fas fa-users" color="purple" trend="up" />
            <StatCard title="Servis Baru" :loading="loading" :value="stat.servis_baru.toString()" change="-"
                icon="fas fa-clipboard-list" color="yellow" trend="waiting" />
        </div>

        <!-- Chart Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-5 lg:col-span-3">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Servis Bulanan</h3>
                </div>
                <MonthlyServiceChart />
            </div>
        </div>

        <!-- Servis Terbaru dan Tipe Produk Terlaris -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="bg-white rounded-lg shadow p-5">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Servis Terbaru</h3>
                </div>
                <RecentServiceTable :orders="recent" :loading="loading" />
            </div>

            <div class="bg-white rounded-lg shadow p-5">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Metode Pembayaran Servis</h3>
                </div>
                <TopPaymentServiceList />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '~/components/teknisi/dashboard/StatCard.vue'
import MonthlyServiceChart from '~/components/teknisi/dashboard/MonthlyServiceChart.vue'
import TopPaymentServiceList from '~/components/teknisi/dashboard/TopPaymentServiceList.vue'
import RecentServiceTable from '~/components/teknisi/dashboard/RecentServiceTable.vue'
import { useNuxtApp } from '#app'

const { $api } = useNuxtApp()
const loading = ref(true)

const stat = ref({
    total_pendapatan: 0,
    total_servis: 0,
    total_pelanggan: 0,
    servis_baru: 0
})

const recent = ref([])

const fetchStat = async () => {
    loading.value = true
    try {
        const res = await $api.get('/dashboard/teknisi')
        stat.value = res.data
        recent.value = res.data.recent_servis
    } catch (err) {
        console.error('Gagal mengambil data dashboard teknisi:', err)
    } finally {
        loading.value = false
    }
}

onMounted(fetchStat)
</script>