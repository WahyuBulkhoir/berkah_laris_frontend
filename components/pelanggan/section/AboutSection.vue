<template>
    <section id="tentang" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Tentang BerkahLaris
                </h2>
                <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Solusi elektronik terpercaya sejak 2010.
                </p>
            </div>

            <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <div class="rounded-lg p-8 text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg
              bg-gradient-to-tr from-[#0E2046] via-[#143262] to-[#0E2046]">
                        <i class="fas fa-bullseye text-4xl mb-4 block"></i>
                        <h3 class="text-2xl font-bold mb-4">Visi & Misi</h3>
                        <p class="text-white">
                            Menjadi penyedia solusi elektronik terdepan dengan menawarkan produk berkualitas dan layanan
                            servis profesional yang terjangkau bagi semua kalangan masyarakat.
                        </p>

                        <div class="mt-6 space-y-4">
                            <div v-for="(item, index) in visionItems" :key="index" class="flex items-start">
                                <i class="fas fa-check-circle text-lg text-blue-300 mr-2 mt-1"></i>
                                <p>{{ item }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div class="bg-gray-50 p-6 rounded-lg flex items-start gap-4" v-for="feature in features"
                        :key="feature.title">
                        <i
                            :class="feature.icon + ' text-2xl mt-1 bg-gradient-to-tr from-[#F87B10] via-[#FEB10B] to-[#F87B10] bg-clip-text text-transparent'"></i>
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-1">
                                {{ feature.title }}
                            </h3>
                            <p class="text-gray-600">
                                {{ feature.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const visionItems = [
    'Menyediakan produk elektronik berkualitas dengan harga terjangkau',
    'Memberikan layanan servis profesional dan terpercaya',
    'Mendukung keberlanjutan dengan program daur ulang elektronik'
]

const features = [
    {
        title: 'Pengalaman',
        description: 'Lebih dari 10 tahun pengalaman dalam industri elektronik dengan tim teknisi bersertifikasi.',
        icon: 'fas fa-user-tie'
    },
    {
        title: 'Garansi',
        description: 'Semua produk dan layanan servis kami dilengkapi dengan garansi untuk memberikan ketenangan pikiran bagi pelanggan.',
        icon: 'fas fa-shield-alt'
    },
    {
        title: 'Layanan Pelanggan',
        description: 'Tim dukungan pelanggan kami siap membantu Anda dengan pertanyaan dan kebutuhan elektronik Anda.',
        icon: 'fas fa-headset'
    }
]
</script>
