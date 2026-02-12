<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Form Column -->
      <div class="lg:col-span-2">
        <div class="mb-6">
          <h1 class="text-3xl font-extrabold text-gray-900">Create an Event</h1>
          <p class="mt-2 text-gray-600">Quickly create and publish events with a beautiful preview.</p>
        </div>

        <form @submit.prevent="submitEvent" class="space-y-6">
          <div class="bg-white rounded-2xl shadow p-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Event Image</label>
            <label for="dropzone-file" class="relative flex items-center justify-center h-48 w-full border-2 border-dashed border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-purple-400 transition">
              <template v-if="previewImage">
                <img :src="previewImage" class="object-cover w-full h-full" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
                  <span class="text-white text-sm">Preview - click to change</span>
                </div>
              </template>
              <template v-else>
                <div class="flex flex-col items-center justify-center">
                  <Icon name="mdi:cloud-upload" class="text-4xl text-gray-400" />
                  <p class="text-sm text-gray-500 mt-2">Click to upload or drag & drop</p>
                </div>
              </template>
              <input id="dropzone-file" type="file" class="hidden" @change="onFileChange" />
            </label>
          </div>

          <div class="bg-white rounded-2xl shadow p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
              <input v-model="form.title" required placeholder="Summer Music Festival" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea v-model="form.description" rows="4" required placeholder="Describe your event" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none resize-none"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input v-model="form.location" required placeholder="Nairobi, Kenya" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input v-model="form.date" required type="date" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
              <select v-model="form.eventType" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none">
                <option value="other">Select type</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Tech & Business">Tech & Business</option>
              </select>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Pricing & Tickets</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <label class="block text-xs text-gray-600 mb-2">Regular</label>
                <input v-model.number="form.regular" type="number" min="0" placeholder="Leave empty to disable" class="w-full p-2 outline-none" />
              </div>
              <div class="p-4 border rounded-lg">
                <label class="block text-xs text-gray-600 mb-2">VIP</label>
                <input v-model.number="form.vip" type="number" min="0" placeholder="Leave empty to disable" class="w-full p-2 outline-none" />
              </div>
              <div class="p-4 border rounded-lg">
                <label class="block text-xs text-gray-600 mb-2">VVIP</label>
                <input v-model.number="form.vvip" type="number" min="0" placeholder="Leave empty to disable" class="w-full p-2 outline-none" />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Total Tickets</label>
                <input v-model.number="form.TicketQuantity" required type="number" min="0" class="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select v-model="form.status" class="w-full p-3 border rounded-lg">
                  <option value="pending">Pending</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div class="mt-6 flex gap-4">
              <button type="submit" :disabled="isLoading" class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-60">
                <Icon v-if="isLoading" name="mdi:loading" class="inline mr-2 animate-spin" />
                {{ isLoading ? 'Creating Event...' : 'Create Event' }}
              </button>
              <button type="reset" @click="clearForm" class="px-6 py-3 border rounded-lg">Clear</button>
            </div>
          </div>
        </form>
      </div>

      <!-- Preview Column -->
      <aside class="lg:col-span-1">
        <div class="sticky top-20 space-y-4">
          <div class="bg-white rounded-2xl shadow p-6">
            <div class="h-40 rounded-lg overflow-hidden bg-gray-100">
              <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">Preview</div>
            </div>
            <h3 class="mt-4 text-lg font-bold">{{ form.title || 'Untitled Event' }}</h3>
            <p class="text-sm text-gray-500 mt-2">{{ form.date ? new Date(form.date).toDateString() : 'Date not set' }}</p>
            <p class="mt-3 text-gray-700 text-sm">{{ form.description ? form.description.slice(0, 120) + (form.description.length > 120 ? '...' : '') : 'No description yet' }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow p-4">
            <h4 class="text-sm font-semibold text-gray-700">Tickets</h4>
            <div class="mt-3 space-y-2">
              <div class="flex justify-between text-sm"><span>Regular</span><span>{{ form.regular || '—' }}</span></div>
              <div class="flex justify-between text-sm"><span>VIP</span><span>{{ form.vip || '—' }}</span></div>
              <div class="flex justify-between text-sm"><span>VVIP</span><span>{{ form.vvip || '—' }}</span></div>
              <div class="flex justify-between text-sm pt-2 border-t mt-2"><span>Available</span><span>{{ form.TicketQuantity || 0 }}</span></div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import useAuth from '~/composables/useAuth';

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

const onFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    previewImage.value = URL.createObjectURL(selectedFile);
  }
};

const clearForm = () => {
  Object.assign(form, {
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
  });
  previewImage.value = null;
  file.value = null;
};

const submitEvent = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    formData.append("eventType", form.eventType);
    if (form.regular !== "" && form.regular !== null && form.regular !== undefined) formData.append("regular", form.regular);
    if (form.vip !== "" && form.vip !== null && form.vip !== undefined) formData.append("vip", form.vip);
    if (form.vvip !== "" && form.vvip !== null && form.vvip !== undefined) formData.append("vvip", form.vvip);
    formData.append("TicketQuantity", form.TicketQuantity);
    formData.append("status", form.status);
    formData.append("image", file.value);

    await $fetch("/api/upload/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
      body: formData,
    });

    alert("✅ Event created successfully!");
    clearForm();
  } catch (err) {
    const message = err.res?.statusMessage || err.message || "Something went wrong";
    alert("❌ " + message);
  } finally {
    isLoading.value = false;
  }
};
</script>
