<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <!-- Label -->
    <label class="text-sm font-medium text-gray-700 dark:text-neutral-200">
      Profile Image
    </label>

    <!-- Preview -->
    <div
      class="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center bg-gray-50 dark:bg-neutral-800"
    >
      <div v-if="previewImage">
        <img
          :src="previewImage"
          alt="Profile Preview"
          class="w-32 h-32 object-cover"
        />
      </div>
      <span
        v-else
        class="text-xs text-gray-400 dark:text-neutral-500 text-center px-2"
      >
        No image selected
      </span>
    </div>

    <!-- Upload Button -->
    <label
      class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition"
    >
      <Icon name="mdi:camera-plus-outline" class="text-lg" />
      Upload Image
      <input
        @change="previewImageFile"
        type="file"
        accept="image/*"
        class="hidden"
      />
    </label>

    <!-- Helper text -->
    <p class="text-xs text-gray-500 dark:text-neutral-400">
      JPG, PNG • Max 10MB
    </p>
  </div>
</template>

<script setup>
const { previewImageFile, previewImage } = FormAuth();
</script>
