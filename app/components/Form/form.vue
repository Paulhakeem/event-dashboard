<template>
  <div v-if="modal === 'forget'">
    <FormForgetPass @close="modal = 'login'" @sent="openReset" />
  </div>
  <div v-else-if="modal === 'reset'">
    <FormResetPass :initialEmail="sentEmail" @close="modal = 'login'" />
  </div>
  <div v-else
    class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-neutral-900"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-6 sm:p-8 shadow"
    >
      <!-- Sign Up Link -->
      <p class="text-center mb-4">
        <NuxtLink
          to="/signup"
          class="text-sm text-[#9c4e8b] underline hover:text-[#7c3a6d]"
        >
          Don't have an account? Sign up
        </NuxtLink>
      </p>

      <form class="space-y-5" @submit.prevent="login">
        <!-- Error Message -->
        <p v-if="errorMessage" class="text-red-500 text-sm italic">
          {{ errorMessage }}
        </p>

        <!-- Email -->
        <div>
          <label
            class="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
          >
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-[#9c4e8b] focus:border-[#9c4e8b] dark:bg-neutral-900 dark:text-neutral-300 dark:focus:ring-[#9c4e8b]"
          />
        </div>

        <!-- Password -->
        <div>
          <div class="flex justify-between">
            <label
              class="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              Password
            </label>
            <button
              @click="openModal"
              class="block mb-2 text-sm font-medium text-[#2478ff] underline cursor-pointer"
            >
              Forget Password
            </button>
          </div>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-[#9c4e8b] focus:border-[#9c4e8b] dark:bg-neutral-900 dark:text-neutral-300 dark:focus:ring-[#9c4e8b]"
          />
        </div>

        <!-- Role -->
        <div>
          <label
            class="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >Role</label
          >
          <select
            v-model="role"
            class="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm dark:bg-neutral-900 dark:text-neutral-300"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 flex justify-center items-center text-sm font-semibold rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition disabled:opacity-50"
        >
          {{ isLoading ? "Logging In..." : "Log In" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const role = ref("user"); // default selection
const isLoading = ref(false);
const errorMessage = ref("");

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
        role: role.value,
      },
    });

    setAuth(data);

    if (data.user.role === "admin") {
      navigateTo("/admin/dashboard");
    } else {
      navigateTo("/user/dashboard");
    }
  } catch (error) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.data?.message ||
      "Login failed. Please check your credentials.";
  } finally {
    isLoading.value = false;
  }
};

const modal = ref('login'); // 'login' | 'forget' | 'reset'
const sentEmail = ref('');

const openModal = () => {
  modal.value = 'forget';
};

const openReset = (email) => {
  sentEmail.value = email || '';
  modal.value = 'reset';
};
</script>
