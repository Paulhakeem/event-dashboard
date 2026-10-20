<template>
  <section class="mt-6 border-t border-slate-200 dark:border-neutral-700 pt-5">
    <div class="mb-4 flex items-center gap-3" aria-hidden="true">
      <span class="h-px flex-1 bg-slate-200"></span>
      <span
        class="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-neutral-400"
      >
        Or continue with
      </span>
      <span class="h-px flex-1 bg-slate-200"></span>
    </div>

    <p
      v-if="errorMessage"
      class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
      role="alert"
    >
      {{ errorMessage }}
    </p>

    <ClientOnly>
      <p
        v-if="!googleClientId"
        class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-center text-sm text-amber-900"
        role="status"
      >
        Google sign-in is temporarily unavailable. Please use your email and
        password.
      </p>
      <div v-else class="relative">
        <GoogleLoginButton
          :options="buttonOptions"
          :verify-on-server="false"
          @success="onGoogleSuccess"
          @error="onGoogleError"
        />
        <div
          v-if="isLoading"
          class="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-white/90 dark:bg-neutral-900/90 text-sm font-medium text-[#13284b] dark:text-white"
          role="status"
          aria-live="polite"
        >
          <Icon name="svg-spinners:90-ring-with-bg" />
          Connecting your account...
        </div>
      </div>
      <template #fallback>
        <div
          class="flex min-h-11 items-center justify-center rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm text-slate-500 dark:text-neutral-400"
          role="status"
          aria-live="polite"
        >
          Loading Google sign-in...
        </div>
      </template>
    </ClientOnly>
  </section>
</template>

<script setup>
import { ref } from "vue";

const { setAuth } = useAuth();
const config = useRuntimeConfig();
const googleClientId = config.public.googleAuth?.clientId;
const isLoading = ref(false);
const errorMessage = ref("");
const buttonOptions = {
  theme: "outline",
  size: "large",
  type: "standard",
  text: "continue_with",
  shape: "rectangular",
};

const onGoogleSuccess = async (e) => {
  const credential = e.credential;
  if (!credential) {
    errorMessage.value = "Google sign-in did not return a credential. Try again.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const data = await $fetch("/api/auth/google", {
      method: "POST",
      body: { credential },
    });

    if (!data?.success || !data.user?.id) {
      throw new Error("Google sign-in could not be completed. Please try again.");
    }

    setAuth(data);

    const destination =
      data.user.role === "admin"
        ? `/admin/${data.user.id}`
        : data.user.role === "organiser"
          ? `/organiser/${data.user.id}`
          : `/user/${data.user.id}`;
    await navigateTo(destination);
  } catch (error) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.message ||
      "Google sign-in failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const onGoogleError = (error) => {
  errorMessage.value =
    error?.message || "Google sign-in failed. Please try again.";
};
</script>
