<template>
  <form
    @submit.prevent="submitEvent"
    class="flex flex-wrap items-center justify-center gap-8 w-full"
  >
    <!-- Upload Dropzone -->
    <label
      for="dropzone-file"
      class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
    >
      <!-- Image Preview -->
      <div v-if="previewImage" class="mt-3">
        <img
          :src="previewImage"
          alt="Preview"
          class="w-64 h-40 object-cover rounded-lg"
        />
      </div>
      <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          class="w-8 h-8 mb-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p class="mb-2 text-sm text-gray-500">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-500">
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p>
      </div>

      <input
        id="dropzone-file"
        type="file"
        class="hidden"
        @change="onFileChange"
      />
    </label>

    <!-- Event Details -->
    <div class="w-full md:w-1/2">
      <input
        v-model="form.title"
        placeholder="Event Title"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <textarea
        v-model="form.description"
        rows="4"
        placeholder="Description"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <input
        v-model="form.date"
        type="date"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <input
        v-model="form.location"
        placeholder="Location"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <input
        v-model="form.price"
        type="number"
        placeholder="Price"
        class="w-full mb-3 border p-2 rounded bg-white"
      />

      <button
        class="w-full bg-[#9c4e8b] text-white p-2 rounded cursor-pointer"
        :disabled="isLoading"
      >
        {{ isLoading ? "Creating..." : "Create Event" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from "vue";
const { token } = useAuth();
const config = useRuntimeConfig();

const form = reactive({
  title: "",
  description: "",
  date: "",
  location: "",
  price: 0,
  image: null,
});

const isLoading = ref(false);
const previewImage = ref(null);
const file = ref(null);

// ✅ When admin selects an image
const onFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    previewImage.value = URL.createObjectURL(selectedFile);
  }
};

// ✅ Upload image to Cloudinary
const uploadToCloudinary = async () => {
  if (!file.value) return null;
  // get signature from backend
  const signRes = await $fetch("/api/cloudinary/cloudinary-signature");
  const { timestamp, signature, apikey } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("apikey", apikey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("upload_preset", config.cloundinaryPresetName);

  try {
    const res = await $fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error.message || "Cloudinary upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// ✅ Submit event form
const submitEvent = async () => {
  try {
    isLoading.value = true;
    const imageUrl = await uploadToCloudinary();

    if (!imageUrl) throw new Error("Image upload failed");
    form.image = imageUrl;

    const res = await $fetch("/api/upload/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    alert("✅ Event created successfully!");
    console.log("Event created:", res);

    // Reset
    Object.assign(form, {
      title: "",
      description: "",
      date: "",
      location: "",
      price: 0,
      image: null,
    });
    previewImage.value = null;
    file.value = null;
  } catch (error) {
    console.error("Error submitting event:", error);
    alert("❌ Failed to create event");
  } finally {
    isLoading.value = false;
  }
};
</script>
