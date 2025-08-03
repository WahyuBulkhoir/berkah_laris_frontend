<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 class="text-3xl font-bold text-red-600 mb-4">❌ Link Verifikasi Tidak Valid</h1>
        <p class="text-gray-700 mb-6">Link verifikasi mungkin sudah kedaluwarsa atau tidak valid.</p>
        <NuxtLink to="/auth/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            Kembali ke Login
        </NuxtLink>
    </div>
</template>
