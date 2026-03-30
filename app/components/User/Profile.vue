<template>
  <div class="w-full flex justify-center mt-12 px-4">
    <div
      class="relative w-full max-w-lg rounded-3xl p-[1px] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl"
    >
      <!-- Card -->
      <div
        class="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center"
      >
        <!-- Avatar -->
        <div class="relative group">
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 blur-xl opacity-70 group-hover:opacity-100 transition"
          ></div>

          <img
            :src="
              user.avatar ||
              'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&w=300&q=80'
            "
            class="relative w-28 h-28 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl"
          />

          <!-- Online badge -->
          <span
            class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></span>
        </div>

        <!-- Name -->
        <h2 class="mt-5 text-2xl font-bold text-gray-800 dark:text-white">
          {{ user.firstName }} {{ user.lastName }}
        </h2>

        <!-- Email -->
        <p class="text-gray-500 dark:text-neutral-400 text-sm">
          {{ user.email }}
        </p>
        <!-- Member Since -->
        <p class="text-gray-400 dark:text-neutral-500 text-xs italic">
          Member since: {{ formatDate(user.joinedAt) }}
        </p>•
        <!-- Role -->
        <span
          class=" px-4 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
        >
          {{ user.role || "Member" }}
        </span>

        <!-- Divider -->
        <div
          class="w-full border-t border-gray-200 dark:border-neutral-700 my-6"
        ></div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <div class="stat-card">
            <Icon name="mdi:calendar-check" class="text-indigo-500 text-2xl" />
            <p class="stat-number">15</p>
            <span>Attended</span>
          </div>

          <div class="stat-card">
            <Icon name="mdi:calendar-clock" class="text-pink-500 text-2xl" />
            <p class="stat-number">3</p>
            <span>Upcoming</span>
          </div>

          <div class="stat-card">
            <Icon
              name="mdi:ticket-confirmation"
              class="text-green-500 text-2xl"
            />
            <p class="stat-number">8</p>
            <span>Bookings</span>
          </div>
          <div class="stat-card">
            <Icon
              name="ri:live-fill"
              class="text-red-500 text-2xl"
            />
            <p class="stat-number">8</p>
            <span>Live Events</span>
          </div>

          <div class="stat-card">
            <Icon name="mdi:cash" class="text-yellow-500 text-2xl" />
            <p class="stat-number">Ksh {{ totalSpent }}</p>
            <span>Spent</span>
          </div>
        </div>

        <!-- Quick Action -->
        <div
          class="mt-4 w-full text-center bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl text-sm text-gray-600 dark:text-neutral-300"
        >
          🎟 You have <b>2 upcoming events</b> this week
        </div>

        <!-- Update Profile Modal -->
        <Transition name="fade">
          <div
            v-if="open"
            @click.self="open = false"
            class="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          >
            <div
              class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 w-full max-w-md"
            >
              <ProfileUpdateProfile />
            </div>
          </div>
        </Transition>

        <!-- Buttons -->
        <div class="flex gap-3 mt-6 w-full">
          <button
            @click="toggle"
            class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition"
          >
            Edit Profile
          </button>

          <button
            @click="logout"
            class="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-white text-sm font-semibold hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
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

// open update profile modal
const open = ref(false);
const toggle = () => {
  open.value = !open.value;
};

// format date
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-KE", {
    month: "long",
    year: "numeric",
  });
};

const { booking } = useBookingData();
const totalSpent = computed(() => {
  return booking.value.reduce((total, b) => total + (b.amount || 0), 0);
});
</script>
