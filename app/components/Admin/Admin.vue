<template>
  <div class="w-full p-4">
    <div class="mx-auto max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Banner -->
      <div class="relative h-40 sm:h-48 lg:h-56">
        <img src="/images/club.jpg" alt="banner" class="w-full h-full object-cover" />
        <!-- avatar -->
        <div class="absolute left-1/2 -translate-x-1/2 bottom-0 transform translate-y-1/2">
          <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-1 shadow">
            <img
              :src="user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=2000&q=80'"
              alt="Profile"
              class="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="px-6 pt-16 pb-6">
        <div class="text-center">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="text-sm sm:text-base text-gray-500 mt-1">{{ user.email }}</p>
          <div class="inline-block mt-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f6e9f2] text-[#9c4e8b]">Role: {{ user.role }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button @click="openProfile()" class="w-full sm:w-auto px-4 py-2 rounded-md bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition">Edit Profile</button>
          <NuxtLink to="/admin/create-event" class="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 text-center">Create Event</NuxtLink>
          <NuxtLink to="/admin/bookings" class="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 text-center">Bookings</NuxtLink>
        </div>

        <!-- Stats -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 bg-[#faf5fb] rounded-lg text-center">
            <p class="text-sm text-gray-500">Total Events</p>
            <p class="mt-2 text-lg font-semibold text-gray-800">220</p>
          </div>
          <div class="p-4 bg-[#faf5fb] rounded-lg text-center">
            <p class="text-sm text-gray-500">Total Users</p>
            <p class="mt-2 text-lg font-semibold text-gray-800">2.0k</p>
          </div>
          <div class="p-4 bg-[#faf5fb] rounded-lg text-center">
            <p class="text-sm text-gray-500">Bookings</p>
            <p class="mt-2 text-lg font-semibold text-gray-800">2.5k</p>
          </div>
        </div>

        <!-- Additional info -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg">
            <p class="text-sm text-gray-500">Phone</p>
            <p class="mt-1 font-semibold text-gray-800">{{ user.adminNumber || 'Not provided' }}</p>
          </div>
          <div class="p-4 border rounded-lg">
            <p class="text-sm text-gray-500">Member since</p>
            <p class="mt-1 font-semibold text-gray-800">{{ user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '—' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();
onMounted(() => {
  console.log(user);
});
const { profile, openProfile } = useAdminMenu();
</script>
