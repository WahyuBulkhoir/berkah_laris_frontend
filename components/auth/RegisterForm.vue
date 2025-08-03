<template>
  <div class="space-y-4">
    <AppAlert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

    <form @submit.prevent="register" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <AppInput id="email" v-model="email" type="email" placeholder="email@anda.com" :error="errors.email" />
        </div>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <AppInput id="username" v-model="username" type="text" placeholder="username anda" :error="errors.username" />
        </div>
      </div>

      <div>
        <label for="nama" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <AppInput id="nama" v-model="nama" type="text" placeholder="Nama Lengkap" :error="errors.nama" />
      </div>

      <div>
        <label for="no_hp" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
        <AppInput id="no_hp" v-model="no_hp" type="tel" placeholder="08xxxxxxxxxx (Pastikan Nomor ini Aktif di WA)"
          :error="errors.no_hp" />
      </div>

      <div>
        <label for="alamat" class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <AppInput id="alamat" v-model="alamat" type="text" placeholder="Alamat" :error="errors.alamat" />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <AppInput id="password" v-model="password" type="password" placeholder="Minimal 6 karakter"
          :error="errors.password" />
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi
          Password</label>
        <AppInput id="password_confirmation" v-model="password_confirmation" type="password"
          placeholder="Ulangi password" :error="errors.password_confirmation" />
      </div>

      <div class="flex items-start">
        <input id="terms" v-model="terms" type="checkbox"
          class="h-4 w-4 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
        <label for="terms" class="ml-2 block text-sm text-gray-700">
          Saya setuju dengan <a href="#" class="text-blue-600 hover:text-blue-800">Syarat & Ketentuan</a> dan
          <a href="#" class="text-blue-600 hover:text-blue-800">Kebijakan Privasi</a>
        </label>
      </div>
      <p v-if="errors.terms" class="text-sm text-red-500 mt-1">{{ errors.terms }}</p>

      <AppButton type="submit" :loading="loading" full>Daftar Sekarang</AppButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import AppInput from '~/components/ui/AppInput.vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppAlert from '~/components/ui/AppAlert.vue'

const emit = defineEmits(['success'])
const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const username = ref('')
const nama = ref('')
const no_hp = ref('')
const alamat = ref('')
const password = ref('')
const password_confirmation = ref('')
const terms = ref(false)

const loading = ref(false)
const errors = ref({})
const alert = ref({ message: '', type: '' })

const validateForm = () => {
  errors.value = {}

  if (!email.value) errors.value.email = 'Email wajib diisi'
  else if (!/\S+@\S+\.\S+/.test(email.value)) errors.value.email = 'Format email tidak valid'

  if (!username.value) errors.value.username = 'Username wajib diisi'
  if (!nama.value) errors.value.nama = 'Nama wajib diisi'
  if (!no_hp.value) errors.value.no_hp = 'Nomor telepon wajib diisi'
  else if (!/^08\d{8,12}$/.test(no_hp.value)) errors.value.no_hp = 'Format nomor telepon tidak valid'

  if (!alamat.value) errors.value.alamat = 'Alamat wajib diisi'
  if (!password.value) errors.value.password = 'Password wajib diisi'
  else if (password.value.length < 6) errors.value.password = 'Minimal 6 karakter'

  if (!password_confirmation.value)
    errors.value.password_confirmation = 'Konfirmasi password wajib diisi'
  else if (password_confirmation.value !== password.value)
    errors.value.password_confirmation = 'Konfirmasi tidak sama dengan password'

  if (!terms.value) errors.value.terms = 'Anda harus menyetujui Syarat & Ketentuan'

  return Object.keys(errors.value).length === 0
}

const register = async () => {
  alert.value.message = ''
  loading.value = true
  errors.value = {}

  if (!validateForm()) {
    alert.value = {
      message: 'Mohon isi data yang diperlukan dengan benar.',
      type: 'error'
    }
    loading.value = false
    return
  }

  try {
    const formData = {
      email: email.value,
      username: username.value,
      nama: nama.value,
      no_hp: no_hp.value,
      alamat: alamat.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
      terms: terms.value
    }

    console.log('📤 Mengirim data:', formData)
    await auth.registerUser(formData)
    emit('success')
    router.push('/auth/verify-notice')
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors || {}
      alert.value = {
        message: 'Terdapat kesalahan pada input Anda.',
        type: 'error'
      }
    } else {
      alert.value = {
        message: err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.',
        type: 'error'
      }
    }
  } finally {
    loading.value = false
  }
}
</script>