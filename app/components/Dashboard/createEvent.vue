<template>
  <form @submit.prevent="submitEvent" class="flex flex-wrap items-center justify-center gap-8 w-full">
    <label
      for="dropzone-file"
      class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
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
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p>
      </div>
      <input id="dropzone-file" @change="onFileChange" type="file" class="hidden" />
    </label>
    <div class="w-full md:w-1/2">
      <input
        v-model="title"
        placeholder="Event Title"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <textarea
        v-model="description"
        rows="4"
        placeholder="Description"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <input
        v-model="date"
        type="date"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <input
        v-model="location"
        placeholder="Location"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <input
        v-model="price"
        type="number"
        class="w-full mb-3 border p-2 rounded bg-white"
      />
      <button class="w-full bg-[#9c4e8b] text-white p-2 rounded">
        Create Event
      </button>
    </div>
  </form>
</template>

<script setup>
const { token } = useAuth();

const title = ref("");
const description = ref("");
const date = ref("");
const location = ref("");
const price = ref(0);
const image = ref(null);

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value = file;
  }
};

const submitEvent = async () => {
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("date", date.value);
  formData.append("location", location.value);
  formData.append("price", price.value);
  if (image.value) {
    formData.append("image", image.value);
  }

  try {
    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    });

    if (!response.ok) {
      alert(data.message || "Failed to upload event");
    }

    const data = await response.json();
    alert("Event created successfully!");
    // Reset form fields
    title.value = "";
    description.value = "";
    date.value = "";
    location.value = "";
    price.value = 0;
    image.value = null;
  } catch (error) {
    console.error("Error creating event:", error);
  }
};
</script>
