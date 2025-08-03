<template>
    <div class="space-y-6 mb-6">
        <!-- Header & Pilihan Bulan + Tombol Unduh -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
                <h2 class="text-2xl font-bold text-gray-800">🛠️ Laporan Servis</h2>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select v-model="selectedMonth"
                        @change="selectedLabel = months.find(m => m.value.bulan === selectedMonth.bulan && m.value.tahun === selectedMonth.tahun)?.label"
                        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm focus:ring-blue-500">
                        <option v-for="(month, index) in months" :key="index" :value="month.value">
                            {{ month.label }}
                        </option>
                    </select>

                    <!-- Tombol Unduh Excel -->
                    <button @click="downloadLaporan('excel')" :disabled="loadingExcel"
                        class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md flex items-center transition-all duration-200 shadow-sm disabled:opacity-60">
                        <span v-if="loadingExcel" class="animate-pulse">⏳ Mengunduh...</span>
                        <span v-else>📥 Unduh Excel</span>
                    </button>

                    <!-- Tombol Unduh PDF -->
                    <button @click="downloadLaporan('pdf')" :disabled="loadingPDF"
                        class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md flex items-center transition-all duration-200 shadow-sm disabled:opacity-60">
                        <span v-if="loadingPDF" class="animate-pulse">⏳ Mengunduh...</span>
                        <span v-else>📄 Unduh PDF</span>
                    </button>
                </div>
            </div>

            <!-- Statistik Utama -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-blue-50 hover:shadow-lg transition-shadow rounded-xl p-5 shadow group cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm text-blue-600 font-semibold">Total Pendapatan Servis</p>
                            <p class="text-2xl font-bold text-blue-800">Rp {{
                                Number(totalPendapatan).toLocaleString('id-ID') }}
                            </p>
                        </div>
                        <div
                            class="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fas fa-wallet text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 hover:shadow-lg transition-shadow rounded-xl p-5 shadow group cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm text-green-600 font-semibold">Total Barang Servis</p>
                            <p class="text-2xl font-bold text-green-800">{{ totalBarangServis }} Unit</p>
                        </div>
                        <div
                            class="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fas fa-tools text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 hover:shadow-lg transition-shadow rounded-xl p-5 shadow group cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm text-purple-600 font-semibold">Total Pelanggan Servis</p>
                            <p class="text-2xl font-bold text-purple-800">{{ totalPelanggan }} orang</p>
                        </div>
                        <div
                            class="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fas fa-user-friends text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Grafik Harian -->
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Servis {{ selectedLabel }}</h3>
            <div v-if="salesData.length === 0" class="text-sm text-gray-500 italic">Belum ada data servis harian di
                bulan ini.</div>
            <DailyServiceChartPage v-else :salesData="salesData" />
        </div>

        <!-- Servis Terbaru & Metode Pembayaran -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <!-- Servis Terbaru -->
            <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Servis Terbaru</h3>
                <div class="divide-y divide-gray-200">
                    <template v-if="loadingData">
                        <div v-for="i in 3" :key="i" class="py-3 animate-pulse">
                            <div class="flex justify-between">
                                <div>
                                    <div class="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                    <div class="h-3 bg-gray-100 rounded w-20"></div>
                                </div>
                                <div class="text-right">
                                    <div class="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                                    <div class="h-3 bg-gray-100 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="(product, index) in topProducts" :key="index" class="flex justify-between py-3">
                            <div>
                                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                                <div class="text-xs text-gray-500">{{ product.sold }} kali servis</div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm text-green-600 font-semibold">{{ product.price }}</div>
                                <div class="text-xs text-gray-500">Total: {{ product.total.toLocaleString('id-ID') }}
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Metode Pembayaran -->
            <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Metode Pembayaran Servis</h3>
                <div class="space-y-4">
                    <template v-if="loadingData">
                        <div v-for="i in 3" :key="i" class="flex items-center gap-3 animate-pulse">
                            <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-2 bg-gray-100 rounded w-full"></div>
                                <div class="h-3 bg-gray-100 rounded w-1/4"></div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="(method, index) in paymentMethods" :key="index" class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-full flex items-center justify-center bg-opacity-20"
                                :class="`bg-${method.color}-100`">
                                <i :class="`${method.icon} text-${method.color}-600 text-lg`"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <span class="font-medium text-sm text-gray-700">{{ method.name }}</span>
                                    <span class="text-sm text-gray-500">{{ method.percentage }}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div :class="`bg-${method.color}-500 h-2 rounded-full transition-all duration-300`"
                                        :style="{ width: `${method.percentage}%` }"></div>
                                </div>
                                <div class="text-xs text-gray-500 mt-1">{{ method.count }} transaksi</div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useNuxtApp } from '#app'
import DailyServiceChartPage from '~/components/teknisi/pages/DailyServiceChartPage.vue'

const { $api } = useNuxtApp()

const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const current = new Date()
const currentMonth = current.getMonth() + 1
const currentYear = current.getFullYear()

const months = Array.from({ length: 12 }, (_, i) => ({
    label: `${bulanNames[i]} ${currentYear}`,
    value: { bulan: i + 1, tahun: currentYear }
}))

const selectedMonth = ref({ bulan: currentMonth, tahun: currentYear })
const selectedLabel = ref(`${bulanNames[currentMonth - 1]} ${currentYear}`)

const totalPendapatan = ref(0)
const totalBarangServis = ref(0)
const totalPelanggan = ref(0)
const salesData = ref([])
const topProducts = ref([])
const paymentMethods = ref([])
const loadingExcel = ref(false)
const loadingPDF = ref(false)
const loadingData = ref(true)

function mapPaymentAppearance(methodName) {
    switch (methodName.toLowerCase()) {
        case 'qris': return { color: 'red', icon: 'fas fa-qrcode' }
        case 'bank_transfer': return { color: 'green', icon: 'fas fa-university' }
        case 'dana': return { color: 'blue', icon: 'fas fa-money-bill-wave' }
        case 'gopay': return { color: 'blue', icon: 'fas fa-mobile-alt' }
        case 'shopeepay': return { color: 'red', icon: 'fas fa-wallet' }
        case 'akulaku': return { color: 'red', icon: 'fas fa-credit-card' }
        case 'credit_card': return { color: 'green', icon: 'far fa-credit-card' }
        default: return { color: 'gray', icon: 'fas fa-money-bill-wave' }
    }
}

const fetchLaporan = async () => {
    try {
        loadingData.value = true
        const { bulan, tahun } = selectedMonth.value
        const res = await $api.get('/laporan/servis', { params: { bulan, tahun } })
        const data = res.data

        const maxTotal = Math.max(...(data.harian || []).map(d => d.total || 0), 1)
        data.harian = (data.harian || []).map(item => ({
            ...item,
            height: Math.round((item.total / maxTotal) * 100)
        }))
        salesData.value = data.harian

        totalPendapatan.value = data.total_pendapatan || 0
        totalBarangServis.value = data.total_pesanan || 0
        totalPelanggan.value = data.total_pelanggan || 0

        topProducts.value = data.top_products || []
        paymentMethods.value = (data.top_methods || []).map(method => {
            const { color, icon } = mapPaymentAppearance(method.name)
            return { ...method, color, icon }
        })

        loadingData.value = false
    } catch (err) {
        console.error('Gagal mengambil laporan:', err)
        loadingData.value = false
    }
}

const downloadLaporan = async (format) => {
    try {
        if (format === 'excel') loadingExcel.value = true
        if (format === 'pdf') loadingPDF.value = true

        const { bulan, tahun } = selectedMonth.value
        const response = await $api.get('/laporan/servis/download', {
            params: { bulan, tahun, tipe: format },
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `laporan-servis-${bulan}-${tahun}.${format === 'excel' ? 'xlsx' : 'pdf'}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (err) {
        console.error('Gagal mengunduh laporan:', err)
    } finally {
        if (format === 'excel') loadingExcel.value = false
        if (format === 'pdf') loadingPDF.value = false
    }
}

watchEffect(() => {
    if (selectedMonth.value) fetchLaporan()
})
</script>
