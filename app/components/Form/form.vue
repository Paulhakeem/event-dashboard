<template>
  <div class="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
    <div
      class="w-full max-w-md bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
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

      <form class="space-y-5">
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
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-[#9c4e8b] focus:border-[#9c4e8b] dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-[#9c4e8b]"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            class="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
          >
            Password
          </label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-[#9c4e8b] focus:border-[#9c4e8b] dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-[#9c4e8b]"
          />
        </div>

        <!-- Role Dropdown -->
        <div>
          <select
            v-model="role"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Login Button -->
        <div>
          <button
            @click="login"
            type="submit"
            class="w-full py-3 px-4 flex justify-center items-center text-sm font-semibold rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition disabled:opacity-50"
          >
            {{ isLoading ? "Logging In..." : "Log In" }}
          </button>
        </div>
      </form>
    </div>
  </div>
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
