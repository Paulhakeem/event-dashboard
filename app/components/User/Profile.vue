<template>
  <div class="w-full flex justify-center mt-12 px-4">
    <div
      class="relative w-full max-w-md rounded-3xl p-[1px] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-xl"
    >
      <!-- Card -->
      <div
        class="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center"
      >
        <!-- Profile Image -->
        <div class="relative group">
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 blur-md opacity-60 group-hover:opacity-100 transition"
          ></div>

          <img
            src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&w=300&q=80"
            alt="User Profile"
            class="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-lg"
          />

          <!-- Online Badge -->
          <span
            class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></span>
        </div>

        <!-- Name -->
        <h2 class="mt-5 text-2xl font-bold text-gray-800 dark:text-white">
          {{ user.firstName }} {{ user.lastName }}
        </h2>

        <!-- Email -->
        <p class="text-gray-500 dark:text-neutral-400 mt-1 text-sm">
          {{ user.email }}
        </p>

        <!-- Role Badge -->
        <span
          class="mt-3 px-4 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
        >
          Active Member
        </span>

        <!-- Divider -->
        <div
          class="w-full border-t border-gray-200 dark:border-neutral-700 my-6"
        ></div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 w-full">
          <div
            class="flex flex-col items-center bg-gradient-to-br from-indigo-50 to-white dark:from-neutral-800 dark:to-neutral-700 rounded-xl px-4 py-4 shadow hover:scale-105 transition"
          >
            <Icon
              name="mdi:calendar-check"
              class="text-indigo-500 text-3xl mb-1"
            />
            <p class="text-lg font-bold text-gray-800 dark:text-white">15</p>
            <span class="text-xs text-gray-500 dark:text-neutral-300">
              Events Attended
            </span>
          </div>

          <div
            class="flex flex-col items-center bg-gradient-to-br from-pink-50 to-white dark:from-neutral-800 dark:to-neutral-700 rounded-xl px-4 py-4 shadow hover:scale-105 transition"
          >
            <Icon
              name="mdi:calendar-clock"
              class="text-pink-500 text-3xl mb-1"
            />
            <p class="text-lg font-bold text-gray-800 dark:text-white">3</p>
            <span class="text-xs text-gray-500 dark:text-neutral-300">
              Pending Events
            </span>
          </div>
        </div>

        <!-- Member Since -->
        <p class="text-gray-400 dark:text-neutral-500 mt-6 text-xs italic">
          Member since: January 2022
        </p>

        <!-- Buttons -->
        <div class="flex gap-3 mt-6 w-full">
          <button
            @click="editProfile"
            class="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold shadow hover:scale-105 hover:shadow-lg transition"
          >
            Edit Profile
          </button>

          <button
            @click="logout"
            class="flex-1 py-2 rounded-xl border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-white text-sm font-semibold hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, logout } = useAuth();

const editProfile = () => {
  // handle profile edit
};
</script>
