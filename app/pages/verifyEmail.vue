<script setup>
const {user} = useAuth()
import { ref } from "vue"
const email = useRoute().query.email
const code = ref("")
const loading = ref(false)

const verify = async () => {
  loading.value = true
  try {
    await $fetch("/api/auth/verify-email", {
      method: "POST",
      body: { email, code: code.value },
    })
    navigateTo(user.role.value === "admin" ? "/admin/dashboard" : "/user/dashboard")
  } catch (err) {
    alert("Verification failed")
  } finally {
    loading.value = false
  }
}

const resend = async () => {
  await $fetch("/api/auth/resend-code", {
    method: "POST",
    body: { email },
  })
  alert("Code resent")
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
      <p class="text-gray-500 text-sm mb-6">
        Enter the verification code we sent to your email address.
      </p>

      <!-- Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
        <input
          v-model="code"
          type="text"
          placeholder="Enter code"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#9d4e8a] focus:outline-none"
        />
      </div>

      <!-- Buttons -->
      <button
        @click="verify"
        :disabled="loading"
        class="w-full bg-[#9d4e8a] text-white py-2 rounded-lg font-semibold transition flex items-center justify-center"
      >
        <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
        <span>{{ loading ? "Verifying..." : "Verify" }}</span>
      </button>

      <button
        @click="resend"
        class="w-full mt-3 text-sm text-[#9d4e8a] hover:text-[#9d4e8a] cursor-pointer transition"
      >
        Resend Code
      </button>
    </div>
  </div>
</template>