<template>
  <div class="flex min-h-[80vh] rounded-2xl overflow-hidden">
    <!-- ── LEFT PANEL (hidden on mobile) ────────────────── -->
    <div
      class="hidden md:flex w-2/5 flex-col items-center justify-center relative bg-gradient-to-br from-[#9c4e8b] via-[#7c3a6d] to-[#1a0a14] p-10 overflow-hidden"
    >
      <!-- Decorative circles -->
      <div
        class="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5"
      ></div>
      <div
        class="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/5"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.03]"
      ></div>

      <!-- Content -->
      <div class="relative z-10 text-center text-white">
        <div
          class="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6"
        >
          <Icon
            name="material-symbols:admin-panel-settings"
            class="text-3xl text-white"
          />
        </div>
        <h1 class="text-2xl font-bold mb-3 leading-tight">Create New Admin</h1>
        <p class="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
          Grant administrative access to manage events, users, and platform
          settings.
        </p>

        <!-- Feature list -->
        <div class="mt-8 space-y-3 text-left">
          <div
            v-for="f in features"
            :key="f"
            class="flex items-center gap-3 text-sm text-white/70"
          >
            <span
              class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
            >
              <Icon name="material-symbols:check" class="text-xs text-white" />
            </span>
            {{ f }}
          </div>
        </div>
      </div>
    </div>

    <!-- ── RIGHT PANEL ───────────────────────────────────── -->
    <div
      class="flex-1 bg-white flex flex-col justify-center px-6 py-10 sm:px-10"
    >
      <div class="max-w-sm w-full mx-auto">
        <!-- Mobile header -->
        <div class="md:hidden text-center mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-[#9c4e8b]/10 flex items-center justify-center mx-auto mb-3"
          >
            <Icon
              name="material-symbols:admin-panel-settings"
              class="text-xl text-[#9c4e8b]"
            />
          </div>
          <h1 class="text-xl font-bold text-gray-900">Create New Admin</h1>
          <p class="text-xs text-gray-400 mt-1">
            Fill in the details to create an admin account.
          </p>
        </div>

        <!-- Desktop heading -->
        <div class="hidden md:block mb-8">
          <h2 class="text-xl font-bold text-gray-900">Admin Details</h2>
          <p class="text-xs text-gray-400 mt-1">All fields are required.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="createAdmin" class="flex flex-col gap-4">
          <!-- Name row -->
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >First Name</label
              >
              <input
                v-model="firstName"
                type="text"
                placeholder="John"
                class="px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >Last Name</label
              >
              <input
                v-model="lastName"
                type="text"
                placeholder="Doe"
                class="px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >Email Address</label
            >
            <div class="relative">
              <Icon
                name="material-symbols:mail-outline"
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                v-model="email"
                type="email"
                placeholder="admin@example.com"
                class="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >Password</label
            >
            <div class="relative">
              <Icon
                name="material-symbols:lock-outline"
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 characters"
                class="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon
                  :name="
                    showPassword
                      ? 'material-symbols:visibility-off-outline'
                      : 'material-symbols:visibility-outline'
                  "
                  class="text-sm"
                />
              </button>
            </div>
          </div>

          <!-- Terms -->
          <label class="flex items-start gap-3 cursor-pointer group">
            <div class="relative mt-0.5 flex-shrink-0">
              <input v-model="accepted" type="checkbox" class="sr-only peer" />
              <div
                class="w-4 h-4 rounded border-2 border-gray-300 peer-checked:bg-[#9c4e8b] peer-checked:border-[#9c4e8b] transition-all flex items-center justify-center"
              >
                <Icon
                  v-if="accepted"
                  name="material-symbols:check"
                  class="text-white text-xs"
                />
              </div>
            </div>
            <span class="text-xs text-gray-500 leading-relaxed">
              I confirm this account has admin privileges and accept the
              <span
                class="text-[#9c4e8b] font-medium cursor-pointer hover:underline"
                >Terms & Conditions</span
              >
            </span>
          </label>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading || !accepted"
            class="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] rounded-xl hover:shadow-lg hover:shadow-[#9c4e8b]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-1"
          >
            <svg
              v-if="isLoading"
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
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <Icon
              v-else
              name="material-symbols:admin-panel-settings"
              class="text-base"
            />
            {{ isLoading ? "Creating account…" : "Create Admin Account" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { firstName, lastName, email, password, isLoading, createAdmin } =
  useCreateAdmin();

const showPassword = ref(false);
const accepted = ref(false);

const features = [
  "Full platform management access",
  "Manage events and attendees",
  "View analytics and reports",
  "Moderate users and content",
];
</script>
