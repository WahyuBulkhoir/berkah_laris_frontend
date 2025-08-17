<template>
    <section id="beranda" class="hero-gradient py-10 md:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center rounded-lg p-8 text-white"
                style="background: linear-gradient(to top, #F87B10 20%, #FEB10B 50%);">
                <div class="md:w-1/2 mb-8 mx-10 md:mb-0">
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                        Solusi Elektronik Terlengkap untuk Kebutuhan Anda
                    </h1>
                    <p class="mt-4 text-lg" style="color: #dbeafe;">
                        Temukan berbagai produk elektronik baru dan bekas berkualitas serta layanan servis terpercaya.
                    </p>
                    <div class="mt-8 flex flex-col sm:flex-row gap-4">
                        <NuxtLink to="#produk"
                            class="inline-flex items-center justify-center px-5 py-3 border text-base font-medium rounded-md text-white transition-all duration-300"
                            style="background-color: #0E2046;"
                            @mouseover="(e: { target: { style: { background: string; }; }; }) => e.target.style.background = 'linear-gradient(to top, #F87B10 20%, #FEB10B 50%)'"
                            @mouseleave="(e: { target: { style: { background: string; }; }; }) => e.target.style.background = '#0E2046'">
                            Lihat Produk
                        </NuxtLink>

                        <NuxtLink to="#servis"
                            class="inline-flex items-center justify-center px-5 py-3 border text-base font-medium rounded-md text-white transition-all duration-300"
                            style="background-color: #0E2046;"
                            @mouseover="(e: { target: { style: { background: string; }; }; }) => e.target.style.background = 'linear-gradient(to top, #F87B10 20%, #FEB10B 50%)'"
                            @mouseleave="(e: { target: { style: { background: string; }; }; }) => e.target.style.background = '#0E2046'">
                            Layanan Servis
                        </NuxtLink>
                    </div>
                </div>

                <div class="md:w-1/2 flex justify-center relative">
                    <div class="bg-[#0E2046] rounded-full absolute translate-x-10"
                        style="width: 280px; height: 280px; z-index: 0;">
                    </div>
                    <img src="/img/hero-logo.png" alt="Hero Image"
                        class="relative z-10 w-auto h-[400px] translate-x-10" />
                </div>


            </div>
        </div>

        <div class="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    class="p-6 border border-[#082f83] rounded-lg text-center bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div class="inline-flex items-center justify-center p-3 rounded-full mb-4"
                        style="background-color: #dbeafe;">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" style="color: #F87B10;" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Produk Berkualitas</h3>
                    <p class="text-gray-600">Semua produk kami dijamin asli dan bergaransi resmi</p>
                </div>

                <div
                    class="p-6 border border-[#082f83] rounded-lg text-center bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div class="inline-flex items-center justify-center p-3 rounded-full mb-4"
                        style="background-color: #dbeafe;">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" style="color: #F87B10;" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Servis Cepat</h3>
                    <p class="text-gray-600">Teknisi berpengalaman dan proses servis yang cepat</p>
                </div>

                <div
                    class="p-6 border border-[#082f83] rounded-lg text-center bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div class="inline-flex items-center justify-center p-3 rounded-full mb-4"
                        style="background-color: #dbeafe;">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" style="color: #F87B10;" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Harga Terjangkau</h3>
                    <p class="text-gray-600">Harga kompetitif untuk produk baru dan bekas</p>
                </div>
            </div>
        </div>
    </section>
</template>
