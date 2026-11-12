<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
    <div
      class="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm"
    >
      <div class="text-center mb-6">
        <div
          class="w-12 h-12 rounded-xl bg-[#9c4e8b]/10 flex items-center justify-center mx-auto mb-3"
        >
          <Icon name="material-symbols:mark-email-unread" class="text-2xl text-[#9c4e8b]" />
        </div>
        <h1 class="text-xl font-bold text-gray-900">Verify Organiser Email</h1>
        <p class="text-sm text-gray-500 mt-1">
          Enter the verification code sent to
          <span class="font-semibold text-gray-700">{{ email || "the organiser" }}</span>.
        </p>
      </div>

      <p v-if="error" role="alert" class="mb-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>

      <form class="space-y-4" @submit.prevent="verify">
        <div>
          <label
            class="block mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide"
          >
            Verification Code
          </label>
          <input
            v-model="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            placeholder="Enter 6-digit code"
            :disabled="loading"
            class="w-full px-4 py-3 text-sm text-center tracking-[0.4em] border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          :disabled="loading || !email"
          class="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] rounded-xl hover:shadow-lg hover:shadow-[#9c4e8b]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <svg
            v-if="loading"
            class="animate-spin w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <Icon v-else name="material-symbols:verified" class="text-base" />
          {{ loading ? "Verifying…" : "Verify Organiser" }}
        </button>
      </form>

      <button
        type="button"
        :disabled="resending || !email"
        class="w-full mt-3 text-sm font-semibold text-[#9c4e8b] hover:underline disabled:opacity-50 disabled:no-underline"
        @click="resend"
      >
        {{ resending ? "Sending…" : "Resend Code" }}
      </button>

      <button
        type="button"
        class="w-full mt-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        @click="goBack"
      >
        Back to dashboard
      </button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { user } = useAuth();

if (user.value && user.value.role !== "admin") {
  navigateTo("/login");
}

const email = computed(() => route.query.email || "");
const code = ref("");
const loading = ref(false);
const resending = ref(false);
const error = ref("");

const dashboardPath = () =>
  user.value?.id ? `/admin/${user.value.id}` : "/login";

const goBack = () => navigateTo(dashboardPath());

const verify = async () => {
  error.value = "";

  if (!email.value) {
    error.value = "Missing organiser email address.";
    return;
  }
  if (!/^\d{6}$/.test(code.value)) {
    error.value = "Please enter the 6-digit verification code.";
    return;
  }

  loading.value = true;
  try {
    await $fetch("/api/auth/verify-email", {
      method: "POST",
      body: { email: email.value, code: code.value },
    });
    await navigateTo(dashboardPath());
  } catch (err) {
    error.value =
      err?.data?.statusMessage ||
      err?.data?.message ||
      "Verification failed. Please try again.";
  } finally {
    loading.value = false;
  }
};

const resend = async () => {
  if (!email.value) return;
  error.value = "";
  resending.value = true;
  try {
    await $fetch("/api/auth/resend-code", {
      method: "POST",
      body: { email: email.value },
    });
  } catch (err) {
    error.value =
      err?.data?.statusMessage ||
      err?.data?.message ||
      "Failed to resend the verification code.";
  } finally {
    resending.value = false;
  }
};
</script>
