<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ initialEmail: { type: String, default: '' } });
const emit = defineEmits(["close"]);

const email = ref(props.initialEmail || '');
const code = ref("");
const password = ref("");
const message = ref("");

watch(() => props.initialEmail, (v) => {
  email.value = v || '';
});

const resetPassword = async () => {
  try {
    const res = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: {
        email: email.value,
        code: code.value,
        newPassword: password.value,
      },
    });
    message.value = res?.message || '';
    if (res?.message) alert(res.message);
    emit('close');
  } catch (error) {
    const msg = error?.data?.statusMessage || error?.data?.message || 'Request failed.';
    alert(msg);
  }
};
</script>

<template>
  <div
    class="mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700"
  >
    <div class="p-4 sm:p-7">
      <div class="text-center">
        <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">
         Reset password?
        </h1>
      </div>
      <div class="mt-5">
        <!-- Form -->
        <form @submit.prevent="resetPassword">
          <div class="grid gap-y-4">
            <!-- Form Group -->
            <div>
              <label for="email" class="block text-sm mb-2 dark:text-white"
                >Email address</label
              >
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  v-model="email"
                  class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  required
                />
                
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm mb-2 dark:text-white"
                >Enter Code</label
              >
              <div class="relative">
                <input
                  type="code"
                  id="code"
                  name="code"
                  v-model="code"
                  class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  required
                />
                
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm mb-2 dark:text-white"
                >New Password</label
              >
              <div class="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  v-model="password"
                  class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  required
                />
                
              </div>
            </div>
            <!-- End Form Group -->

            <button
              type="submit"
              class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#9c4e8b] text-white disabled:opacity-50 disabled:pointer-events-none"
            >
              Change password
            </button>
          </div>
        </form>
        <!-- End Form -->
      </div>
    </div>
  </div>
</template>
