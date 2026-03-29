<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-500">Update Profile</h1>

    <div class="bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
      <form @submit.prevent="updateProfile" method="post" class="space-y-5">
        <!-- Name -->
        <div>
          <label
            class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Name
          </label>

          <input
            v-model="firstName"
            type="text"
            placeholder="Enter your firstname"
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label
            class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Last Name
          </label>

          <input
            v-model="lastName"
            type="text"
            placeholder="Enter your last name"
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 rounded-xl bg-[#c01581] text-white font-semibold active:scale-[0.98] transition cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
        >
          Save Changes
        </button>
      </form>

      <!-- Danger Zone -->
      <div class="mt-8 border-t pt-6">
        <h2 class="text-lg font-bold mb-3 text-red-500">Danger Zone</h2>
        <!-- text -->
        <p class="text-sm text-gray-600 dark:text-gray-400 pb-2">
          Deleting your account is irreversible. All your data will be
          permanently removed. Please proceed with caution.
        </p>
        <button
          @click="deleteAccount"
          class="w-full py-3 rounded-xl border border-red-500 text-red-500 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { firstName, lastName, loading, updateProfile } = profileEditing();

// delete account logic
const deleteAccount = async () => {
  const res = await fetch("/api/profile/delete-profile", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    // are you sure?
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    window.location.href = "/login";
  } else {
    // Handle error
    const errorData = await res.json();
    alert(`Error: ${errorData.message}`);
  }
};
</script>
