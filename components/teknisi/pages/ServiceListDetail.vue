<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 bg-blend-color bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
        <div class="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative animate-fade-in">
            <div class="flex justify-between items-center bg-[#0E2046] px-6 py-4 border-gray-600"
                style="background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                    <i class="fas fa-tools text-white text-lg"></i> Detail Servis
                </h2>
                <button @click="$emit('close')" class="text-white hover:text-red-600 text-2xl font-bold">
                    &times;
                </button>
            </div>

            <div class="p-6 space-y-6 text-gray-700 text-sm md:text-base">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Nama Pelanggan</p>
                        <p>{{ detail.user?.name || '-' }}</p>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">No. HP</p>
                        <p>{{ detail.user?.no_hp || '-' }}</p>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Tipe Barang</p>
                        <p>{{ detail.tipe_barang }}</p>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Tanggal Servis</p>
                        <p>{{ formatDate(detail.tanggal_servis) }}</p>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Status Pembayaran</p>
                        <span :class="badgeClass(detail.payment_status)"
                            class="inline-block px-3 py-1 text-xs font-semibold rounded-full">
                            {{ detail.payment_status || '-' }}
                        </span>
                    </div>
                    <div>
                        <p class="font-extrabold text-[#0E2046]">Status Servis</p>
                        <div v-if="isSelesaiDanLunas">
                            <span
                                class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                {{ detail.status_servis }}
                            </span>
                        </div>
                        <div v-else>
                            <select v-model="form.status_servis" class="w-full border rounded px-2 py-1 text-sm">
                                <option value="Diproses">Diproses</option>
                                <option value="Diterima">Diterima</option>
                                <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <p class="font-extrabold text-[#0E2046]">Kerusakan</p>
                    <div v-if="isSelesaiDanLunas">
                        <p>{{ detail.kerusakan }}</p>
                    </div>
                    <div v-else>
                        <textarea v-model="form.kerusakan" rows="2"
                            class="w-full border rounded px-3 py-2 text-sm text-gray-700"></textarea>
                    </div>
                </div>

                <div>
                    <p class="font-extrabold text-[#0E2046]">Keterangan Tambahan</p>
                    <div v-if="isSelesaiDanLunas">
                        <p>{{ detail.ket_tambahan || '-' }}</p>
                    </div>
                    <div v-else>
                        <textarea v-model="form.ket_tambahan" rows="2"
                            class="w-full border rounded px-3 py-2 text-sm text-gray-700"></textarea>
                    </div>
                </div>

                <div v-if="form.status_servis === 'Selesai'">
                    <p class="font-extrabold text-[#0E2046]">Total Biaya</p>
                    <div v-if="isSelesaiDanLunas">
                        <p class="text-lg font-semibold text-green-700">
                            Rp {{ detail.total_biaya.toLocaleString('id-ID') }}
                        </p>
                    </div>
                    <div v-else>
                        <input type="number" v-model="form.total_biaya"
                            class="w-full border rounded px-3 py-2 text-sm text-gray-700" />
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t">
                    <button @click="$emit('close')"
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow-sm transition">
                        Tutup
                    </button>
                    <button v-if="!isSelesaiDanLunas" @click="simpanPerubahan" :disabled="saving"
                        class="btn-simpan px-4 py-2 text-white rounded shadow flex items-center gap-2 transition">
                        <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                        <span v-else>Simpan</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
    isOpen: Boolean,
    detail: Object
})

const emit = defineEmits(['close', 'updated'])
const form = ref({})
const saving = ref(false)
const { $api } = useNuxtApp()

const isSelesaiDanLunas = computed(() =>
    props.detail?.status_servis === 'Selesai' && props.detail?.payment_status === 'paid'
)

watch(() => props.detail, (val) => {
    if (val) {
        form.value = {
            kerusakan: val.kerusakan,
            ket_tambahan: val.ket_tambahan,
            status_servis: val.status_servis,
            total_biaya: val.total_biaya
        }
    }
}, { immediate: true })

const simpanPerubahan = async () => {
    if (!props.detail?.id_servis) return
    saving.value = true
    try {
        await $api.put(`/servis/${props.detail.id_servis}`, {
            kerusakan: form.value.kerusakan,
            ket_tambahan: form.value.ket_tambahan,
            status_servis: form.value.status_servis,
            total_biaya: parseFloat(form.value.total_biaya) || 0
        })
        emit('updated')
        emit('close')
    } catch (err) {
        alert('Gagal menyimpan perubahan.')
        console.error(err)
    } finally {
        saving.value = false
    }
}

const formatDate = (tgl) =>
    new Date(tgl).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

const badgeClass = (status) => {
    return status === 'paid'
        ? 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
        : 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
}
</script>

<style scoped>
@keyframes fade-in {
    0% {
        transform: scale(0.95);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
}

.btn-simpan {
    background-color: #0E2046;
    transition: background 0.3s ease;
}

.btn-simpan:hover {
    background: #082f83;
    box-shadow: 0 4px 12px rgba(248, 123, 16, 0.3);
}
</style>