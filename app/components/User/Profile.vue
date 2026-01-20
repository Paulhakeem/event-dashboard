<template>
  <div class="w-full flex justify-center mt-10 px-4">
    <div
      class="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-8 w-full max-w-md flex flex-col items-center text-center shadow-lg hover:shadow-xl transition"
    >
      <!-- User Photo -->
      <div class="relative">
        <img
          src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&w=300&q=80"
          alt="User Profile"
          class="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
        />
      </div>

      <!-- Name -->
      <h2 class="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
        {{ user.firstName }} {{ user.lastName }}
      </h2>

      <!-- Email -->
      <p class="text-gray-600 dark:text-neutral-300 mt-1 text-sm">
        {{ user.email }}
      </p>

      <!-- Additional Info -->
      <p class="text-gray-500 dark:text-neutral-400 mt-2 text-sm italic">
        Member since: January 2022
      </p>

      <!-- Stats -->
      <div class="flex flex-wrap gap-4 pt-6 w-full justify-center">
        <div
          class="flex flex-col items-center bg-gray-100 dark:bg-neutral-700 rounded-lg px-4 py-3 shadow-sm w-40"
        >
          <Icon name="mdi:calendar-check" class="text-indigo-500 text-2xl mb-1" />
          <p class="text-gray-800 dark:text-white font-semibold">15</p>
          <span class="text-xs text-gray-500 dark:text-neutral-300">Events Attended</span>
        </div>

        <div
          class="flex flex-col items-center bg-gray-100 dark:bg-neutral-700 rounded-lg px-4 py-3 shadow-sm w-40"
        >
          <Icon name="mdi:calendar-clock" class="text-pink-500 text-2xl mb-1" />
          <p class="text-gray-800 dark:text-white font-semibold">3</p>
          <span class="text-xs text-gray-500 dark:text-neutral-300">Pending Events</span>
        </div>
      </div>

      <!-- Edit Button -->
      <button
        @click="editProfile"
        class="mt-6 px-6 py-2 rounded-lg bg-linear-to-r from-pink-600 to-purple-600 text-white text-sm font-medium hover:from-pink-700 hover:to-purple-700 transition"
      >
        Edit Profile
      </button>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();

const editProfile = () => {
  // handle profile edit
};
</script>