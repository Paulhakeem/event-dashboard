<template>
  <div class="flex min-h-[80vh] bg-gray-100"> <!-- reduced height -->
    <!-- Left Side -->
    <div
      class="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-[#9d4e8a] to-black text-white p-8"
    >
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-3">Create New Admin</h1>
        <p class="mb-5 text-sm">
          Fill in the details below to create a new admin account.
        </p>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex flex-col justify-center w-full md:w-1/2 bg-white p-6">
      <form
        @submit.prevent="createAdmin"
        class="space-y-4 max-w-sm mx-auto"
      >
        <input
          v-model="firstName"
          type="text"
          placeholder="First name"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9d4e8a]"
        />
        <input
          v-model="lastName"
          type="text"
          placeholder="Last name"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9d4e8a]"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email address"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9d4e8a]"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9d4e8a]"
        />

        <label class="flex items-center space-x-2 text-sm">
          <input type="checkbox" />
          <span>Accept Terms & Conditions</span>
        </label>

        <button
          type="submit"
          class="w-full bg-[#9d4e8a] text-white py-2 rounded-md font-medium cursor-pointer hover:bg-[#7a3c6a] focus:outline-none focus:ring-2 focus:ring-[#9d4e8a] transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loader mr-2"></span>
          <span>{{ isLoading ? "Creating..." : "Create Admin Account" }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const { firstName, lastName, email, password, isLoading, createAdmin } =
  useCreateAdmin();
</script>