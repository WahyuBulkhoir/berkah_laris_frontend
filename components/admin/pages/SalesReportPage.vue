<template>
    <div class="space-y-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
                <h2 class="text-2xl font-bold text-gray-800">📊 Laporan Penjualan</h2>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select v-model="selectedMonth"
                        @change="selectedLabel = months.find(m => m.value.bulan === selectedMonth.bulan && m.value.tahun === selectedMonth.tahun)?.label"
                        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm focus:ring-blue-500">
                        <option v-for="(month, index) in months" :key="index" :value="month.value">
                            {{ month.label }}
                        </option>
                    </select>

                    <button @click="downloadLaporan('excel')" :disabled="loadingExcel"
                        class="btn-unduh px-5 py-2 text-white text-sm font-medium rounded-md flex items-center transition-all duration-200 shadow-sm disabled:opacity-60">
                        <span v-if="loadingExcel" class="animate-pulse">⏳ Mengunduh...</span>
                        <span v-else>📥 Unduh Excel</span>
                    </button>

                    <button @click="downloadLaporan('pdf')" :disabled="loadingPDF"
                        class="btn-unduh px-5 py-2 text-white text-sm font-medium rounded-md flex items-center transition-all duration-200 shadow-sm disabled:opacity-60">
                        <span v-if="loadingPDF" class="animate-pulse">⏳ Mengunduh...</span>
                        <span v-else>📄 Unduh PDF</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-blue-50 hover:shadow-lg transition-shadow rounded-xl p-5 shadow group cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm text-blue-600 font-semibold">Total Penjualan</p>
                            <p class="text-2xl font-bold text-blue-800">
                                <span v-if="loadingData">Memuat...</span>
                                <span v-else>Rp {{ totalPenjualan.toLocaleString('id-ID') }}</span>
                            </p>
                        </div>
                        <div
                            class="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fas fa-shopping-cart text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 hover:shadow-lg transition-shadow rounded-xl p-5 shadow group cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm text-green-600 font-semibold">Total Pesanan</p>
                            <p class="text-2xl font-bold text-green-800">
                                <span v-if="loadingData">Memuat...</span>
                                <span v-else>{{ totalPesanan }} Unit </span>
                            </p>
                        </div>
                        <div
                            class="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fas fa-clipboard-list text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 hover:shadow-lg transition-shadow rounded-xl p-5 shadow group cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm text-purple-600 font-semibold">Rata-rata Pesanan</p>
                            <p class="text-2xl font-bold text-purple-800">
                                <span v-if="loadingData">Memuat...</span>
                                <span v-else> Rp {{ rataRataPesanan.toLocaleString('id-ID') }}</span>
                            </p>
                        </div>
                        <div
                            class="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i class="fas fa-chart-line text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Penjualan {{ selectedLabel }}</h3>

            <div v-if="loadingData" class="flex items-end space-x-2 h-48 animate-pulse">
                <div v-for="i in 7" :key="i" class="bg-gray-200 rounded w-8" :style="{ height: `${20 + i * 10}px` }">
                </div>
            </div>

            <div v-else-if="salesData.length === 0" class="text-sm text-gray-500 italic">
                Belum ada data servis harian di bulan ini.
            </div>
            <DailySalesChart :salesData="salesData" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Produk Terlaris</h3>
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
                        <div v-if="topProducts.length === 0" class="text-sm text-gray-500 italic py-3">
                            Belum ada data produk terlaris saat ini.
                        </div>
                        <div v-else v-for="(product, index) in topProducts" :key="index"
                            class="flex justify-between py-3">
                            <div>
                                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                                <div class="text-xs text-gray-500">{{ product.sold }} unit terjual</div>
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

            <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Metode Pembayaran</h3>
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
                        <div v-if="paymentMethods.length === 0" class="text-sm text-gray-500 italic">
                            Belum ada metode pembayaran saat ini.
                        </div>
                        <div v-else v-for="(method, index) in paymentMethods" :key="index"
                            class="flex items-center gap-3">
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
                                <div class="text-xs text-gray-500 mt-1">{{ method.count }} unit</div>
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
import DailySalesChart from '~/components/admin/pages/DailySalesChartPage.vue'

const { $api } = useNuxtApp()

const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const current = new Date()
const currentMonth = current.getMonth() + 1
const currentYear = current.getFullYear()

const months = Array.from({ length: 12 }, (_, i) => {
    return {
        label: `${bulanNames[i]} ${currentYear}`,
        value: { bulan: i + 1, tahun: currentYear }
    }
})

const selectedMonth = ref({ bulan: currentMonth, tahun: currentYear })
const selectedLabel = ref(bulanNames[currentMonth - 1] + ' ' + currentYear)

const totalPenjualan = ref(0)
const totalModal = ref(0)
const totalPesanan = ref(0)
const rataRataPesanan = ref(0)
const labaRugi = ref(0)
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
        case 'cstore': return { color: 'green', icon: 'far fa-credit-card' }
        case 'echannel': return { color: 'blue', icon: 'fas fa-credit-card' }
        default: return { color: 'gray', icon: 'fas fa-money-bill-wave' }
    }
}

const fetchLaporan = async () => {
    try {
        loadingData.value = true
        const { bulan, tahun } = selectedMonth.value
        const res = await $api.get('/laporan/laba-rugi', {
            params: { bulan, tahun }
        })
        const data = res.data

        salesData.value = data.harian || []
        totalPenjualan.value = data.total_pendapatan
        totalModal.value = data.total_modal
        labaRugi.value = data.laba_rugi
        totalPesanan.value = data.total_pesanan ?? 0
        rataRataPesanan.value = totalPesanan.value > 0 ? Math.round(totalPenjualan.value / totalPesanan.value) : 0

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

        const { bulan, tahun } = selectedMonth.value;
        const response = await $api.get('/laporan/laba-rugi/download', {
            params: { bulan, tahun, tipe: format },
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `laporan-penjualan-${bulan}-${tahun}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.error('Gagal mengunduh laporan:', err);
    } finally {
        if (format === 'excel') loadingExcel.value = false
        if (format === 'pdf') loadingPDF.value = false
    }
}

watchEffect(() => {
    if (selectedMonth.value) {
        fetchLaporan()
    }
})
</script>

<style scoped>
.btn-unduh {
    background-color: #0E2046;
    transition: background 0.3s ease;
}

.btn-unduh:hover {
    background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);
    box-shadow: 0 4px 12px rgba(248, 123, 16, 0.3);
}
</style>