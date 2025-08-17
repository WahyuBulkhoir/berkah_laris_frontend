<template>
  <div class="min-h-screen flex items-center justify-center bg-red-50">
    <div class="bg-white p-6 rounded shadow text-center">
      <h1 class="text-2xl font-bold text-red-600">Akses Ditolak</h1>
      <p class="text-gray-600 mt-2">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <NuxtLink to="/auth/login"
        class="mt-4 inline-block text-[#0E2046] hover:bg-gradient-to-t from-[#F87B10] to-[#FEB10B] hover:text-white px-4 py-2 rounded-lg transition">
        Kembali ke Beranda
      </NuxtLink>
    </div>
  </div>
</template>
