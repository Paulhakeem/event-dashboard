<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-gray-600 text-lg">Fill in the details below to create and publish your event</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitEvent" class="space-y-8">
        <!-- Image Upload Section -->
        <div class="bg-white rounded-2xl shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Event Image</h2>
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition duration-300 group"
          >
            <!-- Image Preview -->
            <div v-if="previewImage" class="relative w-full h-full">
              <img
                :src="previewImage"
                alt="Preview"
                class="w-full h-full object-cover rounded-xl"
              />
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-xl transition flex items-center justify-center">
                <p class="text-white font-semibold">Click to change image</p>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
              <Icon name="mdi:cloud-upload" class="text-5xl text-gray-400 mb-3" />
              <p class="mb-2 text-sm text-gray-600">
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
        </div>

        <!-- Basic Information -->
        <div class="bg-white rounded-2xl shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
          <div class="space-y-5">
            <!-- Title -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
              <input
                v-model="form.title"
                required
                placeholder="e.g. Summer Music Festival"
                class="w-full border-2 border-gray-300 p-3 rounded-lg bg-white text-gray-800 font-medium transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                v-model="form.description"
                required
                rows="4"
                placeholder="Describe your event..."
                class="w-full border-2 border-gray-300 p-3 rounded-lg bg-white text-gray-800 font-medium transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm resize-none"
              />
            </div>

            <!-- Location and Date Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input
                  v-model="form.location"
                  required
                  placeholder="Event location"
                  class="w-full border-2 border-gray-300 p-3 rounded-lg bg-white text-gray-800 font-medium transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input
                  v-model="form.date"
                  required
                  type="date"
                  class="w-full border-2 border-gray-300 p-3 rounded-lg bg-white text-gray-800 font-medium cursor-pointer transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
                />
              </div>
            </div>

            <!-- Event Type -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
              <select
                v-model="form.eventType"
                required
                class="w-full border-2 border-gray-300 p-3 rounded-lg bg-white text-gray-800 font-medium cursor-pointer transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
              >
                <option value="other">Select Event Type</option>
                <option value="concert">🎵 Entertainment</option>
                <option value="workshop">🛠️ Arts & Culture</option>
                <option value="webinar">💻 Tech & Business</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Pricing & Tickets -->
        <div class="bg-white rounded-2xl shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Pricing & Tickets</h2>
          <div class="space-y-5">
            <!-- Ticket Prices -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-4">Ticket Prices (Ksh) *</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="border-2 border-gray-300 rounded-lg p-4 hover:border-[#9c4e8b] transition">
                  <label class="block text-xs font-semibold text-gray-600 uppercase mb-2">Regular</label>
                  <input
                    v-model.number="form.regular"
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full bg-transparent text-2xl font-bold text-gray-900 outline-none"
                  />
                </div>
                <div class="border-2 border-gray-300 rounded-lg p-4 hover:border-[#9c4e8b] transition">
                  <label class="block text-xs font-semibold text-gray-600 uppercase mb-2">⭐ VIP</label>
                  <input
                    v-model.number="form.vip"
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full bg-transparent text-2xl font-bold text-gray-900 outline-none"
                  />
                </div>
                <div class="border-2 border-gray-300 rounded-lg p-4 hover:border-[#9c4e8b] transition">
                  <label class="block text-xs font-semibold text-gray-600 uppercase mb-2">👑 VVIP</label>
                  <input
                    v-model.number="form.vvip"
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full bg-transparent text-2xl font-bold text-gray-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Ticket Quantity & Status Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Total Ticket Quantity *</label>
                <input
                  v-model.number="form.TicketQuantity"
                  required
                  type="number"
                  min="0"
                  placeholder="Number of tickets available"
                  class="w-full border-2 border-gray-300 p-3 rounded-lg bg-white text-gray-800 font-medium transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Event Status *</label>
                <select
                  v-model="form.status"
                  required
                  class="w-full border-2 border-gray-300 p-3 rounded-lg bg-white text-gray-800 font-medium cursor-pointer transition duration-200 hover:border-[#9c4e8b] focus:outline-none focus:ring-2 focus:ring-[#9c4e8b] focus:ring-offset-0 shadow-sm"
                >
                  <option value="upcoming">📅 Upcoming</option>
                  <option value="ongoing">🔴 Ongoing</option>
                  <option value="completed">✅ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 bg-gradient-to-r from-[#9c4e8b] to-[#7c3a6d] text-white font-bold py-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <Icon v-if="isLoading" name="mdi:loading" class="inline mr-2 animate-spin" />
            {{ isLoading ? "Creating Event..." : "Create Event" }}
          </button>
          <button
            type="reset"
            class="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-200"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { token } = useAuth();

const form = reactive({
  title: "",
  description: "",
  date: "",
  location: "",
  eventType: "other",
  regular: "",
  vip: "",
  vvip: "",
  TicketQuantity: 0,
  status: "upcoming",
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

// ✅ Submit event form
const submitEvent = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    formData.append("eventType", form.eventType);
    formData.append("regular", form.regular);
    formData.append("vip", form.vip);
    formData.append("vvip", form.vvip);
    formData.append("TicketQuantity", form.TicketQuantity);
    formData.append("status", form.status);
    formData.append("image", file.value); // 🖼️ add the file

    const res = await $fetch("/api/upload/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
      body: formData,
    });

    alert("✅ Event created successfully!");

    // reset form
    Object.assign(form, {
      title: "",
      description: "",
      date: "",
      location: "",
      eventType: "other",
      regular: 0,
      vip: 0,
      vvip: 0,
      TicketQuantity: 0,
      status: "upcoming",
    });
    previewImage.value = null;
    file.value = null;
  } catch (err) {
    const message =
      err.res?.statusMessage ||
      err.message ||
      "Something went wrong while creating the event.  Please try again.";
    alert("❌ " + message);
  } finally {
    isLoading.value = false;
  }
};
</script>
