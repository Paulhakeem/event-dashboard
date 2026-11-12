<template>
  <div class="w-full flex justify-center px-4 py-6">
    <div
      class="relative w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl"
    >
      <div
        class="rounded-3xl p-8 flex flex-col items-center text-center"
      >
        <!-- Profile -->
        <div class="relative">
          <img
            v-if="user?.profileImage"
            :src="user.profileImage"
            :alt="`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Profile picture'"
            class="relative w-28 h-28 rounded-full object-cover border-4 border-gray-100 dark:border-neutral-800"
          />
          <div
            v-else
            class="flex w-28 h-28 items-center justify-center rounded-full border-4 border-gray-100 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-800 text-2xl font-semibold text-gray-600 dark:text-neutral-300"
            aria-label="Profile initials"
          >
            {{ initials }}
          </div>

          <span
            class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"
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
          class="mt-3 px-4 py-1 text-xs rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300"
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

          <div class="stat-card hover:border-amber-400">
            <Icon name="mdi:calendar-star" class="text-amber-500 text-2xl" />
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
        <div class="flex gap-3 mt-8 w-full">
          <button
            @click="toggle"
            class="flex-1 py-3 rounded-xl bg-[#13284b] text-white text-sm font-semibold shadow-sm hover:bg-[#0b1730] transition"
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
import ProfileUpdateProfile from "../Profile/update-profile.vue";
const { user, logout, token } = useAuth();
const { events } = organiserEvents();
const { pendingEvents } = usePendingEvent();
const cancelledEvents = ref([]);
const initials = computed(() => {
  const first = user.value?.firstName?.[0] || "";
  const last = user.value?.lastName?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U";
});

// total income
const config = useRuntimeConfig();
const total = ref({ total: 0 });
const totalBookedEvents = ref([]);

// open update profile modal
const open = ref(false);
const toggle = () => {
  open.value = !open.value;
};

// cancelled events
watch(
  events,
  () => {
    cancelledEvents.value = events.value.filter(
      (event) => event.status === "cancelled",
    );
  },
  { immediate: true },
);

watch(
  events,
  async () => {
    const res = await $fetch(`${config.public.organiserBookingEvents}`, {
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
    });
    totalBookedEvents.value = res.totalBookedEvents;
  },
  { immediate: true },
);

// total amount
watch(
  events,
  async () => {
    const res = await $fetch(`${config.public.organiserTotalAmount}`, {
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
    });
    total.value.total = res.totalIncome;
  },
  { immediate: true },
);

// get events with ongoing status
const ongoingEvents = computed(() => {
  return events.value.filter((event) => event.status === "ongoing");
});
const editProfile = () => {
  // handle profile edit
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
