<template>
  <div class="relative bg-white">
    <!-- Card -->
    <div
      class="flex flex-col border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-10 dark:border-neutral-700"
    >
      <p>
        <NuxtLink
          to="/signup"
          class="text-sm text-[#9c4e8b] underline cursor-pointer"
          >Don't have an account? Sign up</NuxtLink
        >
      </p>
      <form>
        <p class="text-red-500 text-sm italic">{{ errorMessage }}</p>
        <div class="mt-6 grid gap-4 lg:gap-6">
          <div>
            <label
              class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
              >Email</label
            >
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg outline-1 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
          <!-- End Grid -->

          <div>
            <label
              class="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg outline-1 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
        </div>
      </form>
      <!-- End Grid -->

      <!-- Checkbox -->
      <select v-model="role" class="mt-4 p-2 border border-gray-300 rounded-lg">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <!-- End Checkbox -->

      <div class="mt-6 grid">
        <button
          @click="login"
          type="submit"
          class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#9c4e8b] text-white disabled:opacity-50 disabled:pointer-events-none"
        >
          {{ isLoading ? "Logging In..." : "Log In" }}
        </button>
      </div>
    </div>
    <!-- End Card -->
  </div>
  <!-- End Col -->
</template>

<script setup>
const email = ref("");
const password = ref("");
const role = ref("user" || "admin");
const { setAuth } = useAuth();
const isLoading = ref(false);
const errorMessage = ref("");

const login = async () => {
  try {
    isLoading.value = true;
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
      error.data?.message || "Login failed. Please check your credentials.";
  } finally {
    isLoading.value = false;
  }
};
</script>
