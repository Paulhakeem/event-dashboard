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
            v-if="user?.profileImage"
            :src="user.profileImage"
            class="relative w-28 h-28 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl"
          />
          <div
            v-else
            class="relative w-28 h-28 rounded-full bg-[#9c4e8b] flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-neutral-800 shadow-xl"
          >
            {{ (user?.firstName?.[0] || '?').toUpperCase() }}
          </div>

          <span
            class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></span>
        </div>

        <!-- Name -->
        <h2
          class="mt-5 text-2xl font-bold text-gray-800 dark:text-white capitalize"
        >
          {{ user?.firstName || 'User' }} {{ user?.lastName || '' }}
        </h2>

        <p class="text-gray-500 dark:text-neutral-400 text-sm">
          {{ user?.email || '' }}
        </p>

        <!-- Role -->
        <span
          class="mt-3 px-4 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
        >
          {{ user?.role || '' }}
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
            <p class="stat-number">{{ booking.length }}</p>
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
            <p class="stat-number">{{ liveCount }}</p>
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
            <p class="stat-number">
              {{ cancelledSummary?.cancelledCount || 0 }}
            </p>
            <span>Refunded</span>
          </div>
          <div class="stat-card hover:border-pink-400">
            <Icon name="majesticons:user" class="text-pink-500 text-2xl" />
            <p class="stat-number">{{ users.length }}</p>
            <span>Users</span>
          </div>
          <div class="stat-card hover:border-pink-400">
            <Icon name="eos-icons:admin" class="text-pink-500 text-2xl" />
            <p class="stat-number">{{ getOrganisers.length }}</p>
            <span>Organisers</span>
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

        <!-- Two-Factor Authentication -->
        <div
          class="w-full border-t border-gray-200 dark:border-neutral-700 mt-6 pt-6"
        >
          <div class="flex items-center justify-between">
            <div class="text-left">
              <h3 class="text-sm font-semibold text-gray-800 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p class="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                {{
                  mfaEnabled
                    ? "Enabled — a code is required at login."
                    : "Disabled — protect your account with an authenticator app."
                }}
              </p>
            </div>
            <button
              @click="mfaEnabled ? (disableModal = true) : startMfaSetup()"
              :disabled="mfaLoading"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              :class="
                mfaEnabled
                  ? 'border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow hover:scale-[1.02]'
              "
            >
              {{ mfaLoading ? "Please wait..." : mfaEnabled ? "Disable" : "Enable" }}
            </button>
          </div>

          <div
            v-if="mfaSetup"
            class="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-left"
          >
            <p class="text-sm text-gray-700 dark:text-neutral-300 mb-3">
              Scan this QR code with your authenticator app (Google Authenticator,
              Authy, etc.), then enter the 6-digit code to confirm.
            </p>
            <div class="flex justify-center">
              <img
                v-if="mfaSetup.qrDataUrl"
                :src="mfaSetup.qrDataUrl"
                alt="TOTP QR code"
                class="w-48 h-48 rounded-lg bg-white p-2"
              />
            </div>
            <p
              v-if="mfaSetup.secret"
              class="mt-3 text-center text-xs text-gray-500 dark:text-neutral-400 break-all font-mono"
            >
              Secret: {{ mfaSetup.secret }}
            </p>
            <input
              v-model="mfaVerifyCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="6-digit code"
              class="mt-3 w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm dark:bg-neutral-900 dark:text-neutral-300"
            />
            <button
              @click="confirmMfaEnable"
              :disabled="!mfaVerifyCode || mfaLoading"
              class="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow hover:scale-[1.02] transition disabled:opacity-50"
            >
              {{ mfaLoading ? "Verifying..." : "Confirm & Enable" }}
            </button>
            <button
              @click="cancelMfaSetup"
              class="mt-2 w-full py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Disable MFA modal -->
        <div
          v-if="disableModal"
          @click.self="disableModal = false"
          class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        >
          <div
            class="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 w-full max-w-sm"
          >
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white">
              Disable Two-Factor Authentication
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-neutral-400">
              Enter your current authenticator code to confirm.
            </p>
            <input
              v-model="mfaVerifyCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="6-digit code"
              class="mt-3 w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm dark:bg-neutral-900 dark:text-neutral-300"
            />
            <div class="flex gap-3 mt-4">
              <button
                @click="disableModal = false"
                class="flex-1 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white border border-gray-200 dark:border-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                @click="confirmMfaDisable"
                :disabled="!mfaVerifyCode || mfaLoading"
                class="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {{ mfaLoading ? "Disabling..." : "Disable" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 mt-8 w-full">
          <button
            @click="toggle"
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
const { user, token, logout } = useAuth();
const { users } = totalUsers();
const { events } = totalEvents();
const { cancelledEvents } = fetchCancelledEvents();
const { pendingEvents } = usePendingEvent();
const { booking } = useBookingData();

// total income
const config = useRuntimeConfig();
const total = ref({ total: 0 });

// open update profile modal
const open = ref(false);
const toggle = () => {
  open.value = !open.value;
};

const getOrganisers = computed(() => {
  return users.value.filter((users) => users.role === "organiser");
});

const liveCount = computed(() => {
  return events.value.filter((e) => e.status === "live").length;
});

const cancelledSummary = ref({ cancelledCount: 0, totalRefunded: 0 });

onMounted(async () => {
  try {
    const res = await $fetch(`${config.public.totalAmountApi}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (res?.success) {
      total.value = { total: res.total || 0 };
    }
  } catch (error) {
    console.error("Error fetching total amount:", error);
    total.value = { total: 0 };
  }
  try {
    const res = await $fetch(`${config.public.cancelledSummaryApi}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (res?.success) {
      cancelledSummary.value = res;
    }
  } catch (error) {
    console.error("Error fetching cancelled summary:", error);
  }
});

const editProfile = () => {
  // handle profile edit
};

// ---- Two-Factor Authentication ----
const mfaEnabled = ref(false);
const mfaSetup = ref(null);
const mfaVerifyCode = ref("");
const mfaLoading = ref(false);
const disableModal = ref(false);
const mfaMessage = ref("");

const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
}));

const loadMfaStatus = async () => {
  try {
    const res = await $fetch("/api/profile/mfa/status", {
      headers: headers.value,
    });
    mfaEnabled.value = Boolean(res?.mfaEnabled);
  } catch (error) {
    console.error("Error fetching MFA status:", error);
  }
};

const startMfaSetup = async () => {
  mfaLoading.value = true;
  mfaSetup.value = null;
  try {
    const res = await $fetch("/api/profile/mfa/setup", {
      method: "POST",
      headers: headers.value,
    });
    mfaSetup.value = res;
  } catch (error) {
    mfaMessage.value =
      error?.data?.statusMessage || "Failed to start setup";
    console.error(error);
  } finally {
    mfaLoading.value = false;
  }
};

const confirmMfaEnable = async () => {
  mfaLoading.value = true;
  try {
    await $fetch("/api/profile/mfa/enable", {
      method: "POST",
      headers: headers.value,
      body: { code: mfaVerifyCode.value },
    });
    mfaEnabled.value = true;
    mfaSetup.value = null;
    mfaVerifyCode.value = "";
    mfaMessage.value = "Two-factor authentication enabled.";
  } catch (error) {
    mfaMessage.value =
      error?.data?.statusMessage || "Invalid code. Try again.";
  } finally {
    mfaLoading.value = false;
  }
};

const cancelMfaSetup = () => {
  mfaSetup.value = null;
  mfaVerifyCode.value = "";
};

const confirmMfaDisable = async () => {
  mfaLoading.value = true;
  try {
    await $fetch("/api/profile/mfa/disable", {
      method: "POST",
      headers: headers.value,
      body: { code: mfaVerifyCode.value },
    });
    mfaEnabled.value = false;
    disableModal.value = false;
    mfaVerifyCode.value = "";
    mfaMessage.value = "Two-factor authentication disabled.";
  } catch (error) {
    mfaMessage.value =
      error?.data?.statusMessage || "Invalid code. Try again.";
  } finally {
    mfaLoading.value = false;
  }
};

onMounted(() => {
  loadMfaStatus();
});
</script>
