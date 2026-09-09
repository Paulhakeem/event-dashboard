<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900">
    <div
      class="w-full max-w-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-6 sm:p-8 shadow"
    >
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-[#9c4e8b]">Velora Admin</h1>
        <p class="text-sm text-gray-500 mt-1">Restricted access — admins only</p>
      </div>

      <form class="space-y-5" @submit.prevent="login">
        <p v-if="errorMessage" class="text-red-500 text-sm italic">
          {{ errorMessage }}
        </p>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="admin@example.com"
            class="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-[#9c4e8b] focus:border-[#9c4e8b] dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Your password"
            class="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-[#9c4e8b] focus:border-[#9c4e8b] dark:bg-neutral-900 dark:text-neutral-300"
          />
        </div>

        <GoogleRecaptchaWidget ref="recaptchaWidget" v-model="recaptchaToken" />

        <button
          type="submit"
          :disabled="isLoading || !recaptchaToken"
          class="w-full py-3 px-4 flex justify-center items-center text-sm font-semibold rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition disabled:opacity-50"
        >
          {{ isLoading ? "Logging In..." : "Log In" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const recaptchaToken = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const recaptchaWidget = ref(null);
const { setAuth } = useAuth();

const login = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const data = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        recaptchaToken: recaptchaToken.value,
      },
    });

    if (data.user.role !== "admin") {
      errorMessage.value = "Access denied. Admin credentials required.";
      setAuth(null);
      recaptchaWidget.value?.reset();
      return;
    }

    setAuth(data);
    navigateTo(`/admin/${data.user.id}`);
  } catch (error) {
    console.log(error);
    errorMessage.value =
      error?.data?.statusMessage || "Login failed. Please check your credentials.";
    recaptchaWidget.value?.reset();
  } finally {
    isLoading.value = false;
  }
};
</script>