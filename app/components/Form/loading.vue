<template>
  <div
    class="flex flex-col items-center justify-center min-h-[300px] bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700"
  >
    <svg
      class="animate-spin h-10 w-10 text-[#9c4e8b]"
      xmlns="http://www.w3.org/2000/svg"
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
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>

    <p class="mt-4 text-sm text-gray-600 dark:text-neutral-400">
      Sending reset code…
    </p>
  </div>
</template>

<script setup></script>
