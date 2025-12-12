<template>
  <div class="w-full flex justify-center mt-10 px-4">
    <div
      class="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700
             rounded-xl p-6 w-full max-w-md flex flex-col items-center text-center shadow"
    >
      <!-- User Photo -->
      <div class="relative">
        <img
          :src="user.photo"
          alt="User Profile"
          class="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-neutral-600"
        />
      </div>

      <!-- Name -->
      <h2 class="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
        {{ user.name }}
      </h2>

      <!-- Email -->
      <p class="text-gray-600 dark:text-neutral-300 mt-1">
        {{ user.email }}
      </p>

      <!-- Edit Button -->
      <button
        @click="editProfile"
        class="mt-5 px-6 py-2 rounded-lg bg-[#9c4e8b] text-white text-sm font-medium 
               hover:bg-[#7c3a6d] transition"
      >
        Edit Profile
      </button>
    </div>
  </div>
</template>

<script setup>
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  photo:
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&w=300&q=80",
};

const editProfile = () => {
  console.log("Edit button clicked");
};
</script>

