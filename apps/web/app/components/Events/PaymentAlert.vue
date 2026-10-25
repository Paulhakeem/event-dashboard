<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="presentation"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        />

        <div
          class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="payment-alert-title"
          aria-describedby="payment-alert-message"
        >
          <button
            type="button"
            class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Close payment alert"
            @click="$emit('close')"
          >
            <Icon name="material-symbols:close-rounded" class="text-xl" />
          </button>

          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            :class="
              isSuccess
                ? 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400'
                : 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'
            "
          >
            <Icon
              :name="
                isSuccess
                  ? 'material-symbols:check-circle-rounded'
                  : 'material-symbols:error-rounded'
              "
              class="text-3xl"
            />
          </div>

          <h3
            id="payment-alert-title"
            class="mt-4 text-center text-lg font-bold text-gray-900 dark:text-white"
          >
            {{ title }}
          </h3>
          <p
            id="payment-alert-message"
            class="mt-2 text-center text-sm text-gray-600 dark:text-neutral-400"
          >
            {{ message }}
          </p>

          <button
            type="button"
            class="mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            :class="
              isSuccess
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            "
            @click="$emit('close')"
          >
            {{ isSuccess ? "Done" : "Close" }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  variant: { type: String, default: "success" },
  title: { type: String, default: "" },
  message: { type: String, default: "" },
});

defineEmits(["close"]);

const isSuccess = computed(() => props.variant === "success");
</script>
