<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-md text-center space-y-6 p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-green-600">Email Berhasil Diverifikasi!</h2>
            <p class="text-gray-600">Silakan login menggunakan akun Anda.</p>
            <NuxtLink to="/auth/login"
                class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Ke Halaman Login
            </NuxtLink>
        </div>
    </div>
</template>
