<template>
  <div class="w-full flex justify-center px-4 py-6">
    <!-- Glow Border -->
    <div
      class="relative w-full max-w-2xl rounded-3xl p-[1px] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl"
    >
      <!-- Card -->
      <div
        class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center"
      >
        <!-- Profile -->
        <div class="relative group">
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 blur-xl opacity-70 group-hover:opacity-100 transition"
          ></div>

          <img
            src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&w=300&q=80"
            class="relative w-28 h-28 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl"
          />

          <span
            class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></span>
        </div>

        <!-- Name -->
        <h2
          class="mt-5 text-2xl font-bold text-gray-800 dark:text-white capitalize"
        >
          {{ user.firstName }} {{ user.lastName }}
        </h2>

        <p class="text-gray-500 dark:text-neutral-400 text-sm">
          {{ user.email }}
        </p>

        <!-- Role -->
        <span
          class="mt-3 px-4 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
        >
          {{ user.role }}
        </span>

        <!-- Divider -->
        <div
          class="w-full border-t border-gray-200 dark:border-neutral-700 my-6"
        ></div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          <!-- Card -->
          <div class="stat-card hover:border-indigo-400">
            <Icon name="mdi:calendar-check" class="text-indigo-500 text-2xl" />
            <p class="stat-number">{{ events.length }}</p>
            <span>Total Events</span>
          </div>

          <div class="stat-card hover:border-green-400">
            <Icon
              name="mdi:ticket-confirmation"
              class="text-green-500 text-2xl"
            />
            <p class="stat-number">{{ totalBookedEvents }}</p>
            <span>Booked</span>
          </div>

          <div class="stat-card hover:border-red-400">
            <Icon name="mdi:close-circle" class="text-red-500 text-2xl" />
            <p class="stat-number">{{ cancelledEvents.length }}</p>
            <span>Cancelled</span>
          </div>

          <div class="stat-card hover:border-yellow-400">
            <Icon name="mdi:clock-outline" class="text-yellow-500 text-2xl" />
            <p class="stat-number">{{ pendingEvents.length }}</p>
            <span>Pending</span>
          </div>

          <div class="stat-card hover:border-purple-400">
            <Icon name="mdi:calendar-star" class="text-purple-500 text-2xl" />
            <p class="stat-number">{{ ongoingEvents.length }}</p>
            <span>Live</span>
          </div>

          <div class="stat-card hover:border-pink-400">
            <Icon name="mdi:cash-multiple" class="text-pink-500 text-2xl" />
            <p class="stat-number text-green-500 font-semibold">
              Ksh {{ (total.total || 0).toLocaleString() }}
            </p>
            <span>Income</span>
          </div>
        </div>

        <!-- users & organisers -->
        <div class="grid grid-cols-3 gap-4 w-full pt-10">
          <div class="stat-card hover:border-pink-400">
            <Icon name="majesticons:user" class="text-pink-500 text-2xl" />
            <p class="stat-number">0</p>
            <span>Refunded</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 mt-8 w-full">
          <button
            @click="editProfile"
            class="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition"
          >
            Edit Profile
          </button>

          <button
            @click="logout"
            class="flex-1 py-3 rounded-xl border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-white text-sm font-semibold hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const { user, logout, token } = useAuth();
const { events } = organiserEvents();
const { cancelledEvents } = fetchCancelledEvents();
const { pendingEvents } = usePendingEvent();
const { booking } = useBookingData();

// total income
const config = useRuntimeConfig();
const total = ref({ total: 0 });
const totalBookedEvents = ref([]);

watch(
  events,
  async () => {
    const res = await $fetch(`${config.public.organiserBookedEvents}`, {
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
    });
    totalBookedEvents.value = res.totalBookedEvents;
  },
  { immediate: true },
);

// total amount

// get events with ongoing status
const ongoingEvents = computed(() => {
  return events.value.filter((event) => event.status === "ongoing");
});
const editProfile = () => {
  // handle profile edit
};
</script>
