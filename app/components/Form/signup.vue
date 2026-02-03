<template>
  <div class="relative bg-white px-4 py-8 sm:px-6 lg:px-8">
    <!-- Card -->
    <div
      class="flex flex-col border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-10 max-w-xl mx-auto w-full dark:border-neutral-700"
    >
      <p class="text-center sm:text-left">
        <NuxtLink
          to="/login"
          class="text-sm text-[#9c4e8b] underline cursor-pointer"
          >Have an account? Login</NuxtLink
        >
      </p>

      <form class="w-full">
        <!-- allow user to uload profile image -->
         <ProfileImage/>
        <!-- end -->
        <p class="text-red-500 italic text-sm">{{ errorMessage }}</p>

        <div class="mt-6 grid gap-4 lg:gap-6">
          <!-- Two-column grid on larger screens -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label
                for="firstname"
                class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >First Name</label
              >
              <input
                v-model="firstName"
                id="firstname"
                type="text"
                placeholder="First name"
                aria-label="First name"
                required
                class="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg outline-none sm:text-sm focus:border-[#9c4e8b] focus:ring-[#9c4e8b] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500"
              />
            </div>

            <div>
              <label
                for="lastname"
                class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >Last Name</label
              >
              <input
                v-model="lastName"
                id="lastname"
                type="text"
                placeholder="Last name"
                aria-label="Last name"
                required
                class="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg outline-none sm:text-sm focus:border-[#9c4e8b] focus:ring-[#9c4e8b] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500"
              />
            </div>
          </div>

          <div>
            <label
              class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
              >Email</label
            >
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              autocomplete="email"
              required
              class="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg outline-none sm:text-sm focus:border-[#9c4e8b] focus:ring-[#9c4e8b] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            />
          </div>

          <div>
            <label
              class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              placeholder="Create a strong password"
              aria-label="Password"
              required
              minlength="6"
              class="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg outline-none sm:text-sm focus:border-[#9c4e8b] focus:ring-[#9c4e8b] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            />
          </div>
        </div>
      </form>

      <!-- Role Dropdown -->
      <select
        v-model="role"
        aria-label="Select role"
        class="mt-6 p-2 border border-gray-300 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 w-full"
      >
        <option value="user">User</option>
        <option v-if="!adminExists" value="admin">Admin</option>
      </select>

      <!-- Submit button -->
      <div class="mt-6 grid">
        <button
          @click="signup"
          type="submit"
          class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-[#9c4e8b] text-white hover:bg-[#863f76] transition disabled:opacity-50"
        >
          {{ isLoading ? "Sending veryfication code..." : "Verify email" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const {
  firstName,
  lastName,
  email,
  password,
  errorMessage,
  role,
  signup,
  isLoading,
} = FormAuth();

const adminExists = ref(false);

onMounted(async () => {
  try {
    const res = await $fetch('/api/auth/admin-exists');
    adminExists.value = !!res?.exists;
    if (adminExists.value && role.value === 'admin') role.value = 'user';
  } catch (e) {
    adminExists.value = false;
  }
});
</script>
