<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 bg-blend-color bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative animate-fade-in">
            <div class="flex justify-between items-center bg-[#0E2046] px-6 py-4 border-gray-600"
                style="background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                    <i class="fas fa-file-invoice text-white text-lg"></i> Detail Pemesanan
                </h2>
                <button @click="$emit('close')" class="text-white hover:text-red-600 text-2xl font-bold">
                    &times;
                </button>
            </div>

            <div class="p-6 space-y-6 text-gray-700 text-sm md:text-base">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Nama Penerima</p>
                        <p>{{ detail.nama_penerima }}</p>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">No. HP</p>
                        <p>{{ detail.no_hp }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <p class="font-extrabold text-[#0E2046]">Alamat</p>
                        <p>{{ detail.alamat }}</p>
                    </div>

                    <div>
                        <p class="font-extrabold text-[#0E2046]">Tanggal Pemesanan</p>
                        <p>{{ formatDate(detail.tgl_pemesanan) }}</p>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Catatan Tambahan</p>
                        <p>{{ detail.cat_opsional || '-' }}</p>
                    </div>

                    <div>
                        <p class="font-extrabold text-[#0E2046]">Status Pesanan</p>
                        <span :class="badgeClass(detail.status_pesanan)">
                            {{ detail.status_pesanan }}
                        </span>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Status Pembayaran</p>
                        <span :class="badgePayment(detail.payment_status)">
                            {{ detail.payment_status }}
                        </span>
                    </div>

                    <div>
                        <p class="font-extrabold text-[#0E2046]">Midtrans Order ID</p>
                        <p>{{ detail.midtrans_order_id || '-' }}</p>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Total Pembayaran</p>
                        <p class="text-lg font-semibold text-green-700">
                            Rp {{ Number(detail.total).toLocaleString('id-ID') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    detail: Object
})

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const badgeClass = (status) => {
    switch (status) {
        case 'Pesanan Dibuat':
            return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
        case 'Pesanan Diproses':
            return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
        case 'Diserahkan Kekurir':
            return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800'
        case 'Pesanan Dalam Perjalanan':
            return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'
        case 'Pesanan Sampai':
            return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
        case 'Selesai':
            return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700'
        default:
            return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
    }
}

const badgePayment = (status) => {
    return status === 'paid'
        ? 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
        : 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
}
</script>

<style scoped>
@keyframes fade-in {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>
