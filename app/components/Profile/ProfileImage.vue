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
      <div v-if="localPreview || currentImage">
        <img
          :src="localPreview || currentImage"
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
    <div class="flex gap-2">
      <label
        class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition"
      >
        <Icon name="mdi:camera-plus-outline" class="text-lg" />
        Choose Image
        <input
          @change="onFileChange"
          type="file"
          accept="image/*"
          class="hidden"
        />
      </label>

      <!-- Only show Save (upload) when the user is authenticated -->
      <button
        v-if="token && token.value"
        :disabled="!selectedFile || isUploading"
        @click="uploadImage"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
      >
        <Icon name="mdi:upload" class="text-lg" />
        <span v-if="isUploading">Uploading...</span>
        <span v-else>Save</span>
      </button>
    </div>

    <!-- Helper text -->
    <p class="text-xs text-gray-500 dark:text-neutral-400">
      JPG, PNG • Max 10MB
    </p>
    <p v-if="message" :class="messageClass" class="text-sm mt-2">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const { user, token, setAuth } = useAuth();
const { previewImageFile, previewImage } = FormAuth();

const selectedFile = ref(null);
const localPreview = ref(null);
const isUploading = ref(false);
const message = ref('');

const currentImage = computed(() => user.value?.profileImage || null);

const messageClass = computed(() => {
  return message.value && message.value.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600';
});

const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // If user is authenticated, keep local selection for upload
  if (token && token.value) {
    selectedFile.value = file;
    localPreview.value = URL.createObjectURL(file);
    message.value = '';
    return;
  }

  // During signup (no token) forward file to FormAuth so signup includes it
  previewImageFile(e);
};

const uploadImage = async () => {
  if (!selectedFile.value || !token || !token.value) return;
  isUploading.value = true;
  message.value = '';

  try {
    const formData = new FormData();
    formData.append('profileImage', selectedFile.value);

    const res = await fetch('/api/users/profile-image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.statusMessage || data.message || 'Upload failed');

    // Update global auth user
    setAuth({ token: token.value, user: data.user });
    message.value = 'Profile image updated successfully';
    selectedFile.value = null;
    localPreview.value = null;
  } catch (err) {
    message.value = err.message || 'Upload failed';
  } finally {
    isUploading.value = false;
  }
};

</script>
