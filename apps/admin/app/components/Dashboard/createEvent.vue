<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Column -->
      <div class="lg:col-span-2">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-[#9d4e8a]">Create an Event</h1>
          <p class="mt-2 text-gray-600">
            Quickly create and publish events with a beautiful preview.
          </p>
        </div>

        <form @submit.prevent="submitEvent" class="space-y-6">
          <div class="bg-white rounded-2xl shadow p-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Event Image</label
            >
            <label
              for="dropzone-file"
              class="relative flex items-center justify-center h-48 w-full border-2 border-dashed border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-purple-400 transition"
            >
              <template v-if="previewImage">
                <img :src="previewImage" class="object-cover w-full h-full" />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4"
                >
                  <span class="text-white text-sm"
                    >Preview - click to change</span
                  >
                </div>
              </template>
              <template v-else>
                <div class="flex flex-col items-center justify-center">
                  <Icon
                    name="mdi:cloud-upload"
                    class="text-4xl text-gray-400"
                  />
                  <p class="text-sm text-gray-500 mt-2">
                    Click to upload or drag & drop
                  </p>
                </div>
              </template>
              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                @change="onFileChange"
              />
            </label>
          </div>

          <div class="bg-white rounded-2xl shadow p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Event Title *</label
              >
              <input
                v-model="form.title"
                required
                placeholder="Summer Music Festival"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Description *</label
              >
              <textarea
                v-model="form.description"
                rows="4"
                required
                placeholder="Describe your event"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Location *</label
                >
                <input
                  v-model="form.location"
                  required
                  placeholder="Nairobi, Kenya"
                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Date *</label
                >
                <input
                  v-model="form.date"
                  required
                  type="date"
                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Event Type</label
              >
              <select
                v-model="form.eventType"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="other">Select type</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Tech & Business">Tech & Business</option>
              </select>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Pricing & Tickets</h3>
              <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-sm text-gray-600">Free Entry</span>
                <input
                  type="checkbox"
                  :checked="freeEntry"
                  @change="toggleFreeEntry"
                  class="w-5 h-5 accent-purple-600"
                />
              </label>
            </div>
            <div
              class="space-y-3"
              :class="{ 'opacity-50 pointer-events-none': freeEntry }"
            >
              <div
                v-for="(ticket, index) in customTickets"
                :key="index"
                class="flex flex-col sm:flex-row items-start gap-3 p-3 border rounded-lg"
              >
                <div class="flex-1 w-full min-w-0">
                  <label
                    class="block text-xs font-semibold text-gray-600 mb-1"
                    :for="`ticket-name-${index}`"
                    >Ticket Type</label
                  >
                  <input
                    :id="`ticket-name-${index}`"
                    v-model="ticket.name"
                    type="text"
                    placeholder="e.g. Gold"
                    :disabled="freeEntry"
                    class="w-full p-2 border rounded outline-none"
                  />
                </div>
                <div class="w-full sm:w-28">
                  <label
                    class="block text-xs font-semibold text-gray-600 mb-1"
                    :for="`ticket-price-${index}`"
                    >Price (KES)</label
                  >
                  <input
                    :id="`ticket-price-${index}`"
                    v-model.number="ticket.price"
                    type="number"
                    min="0"
                    placeholder="0"
                    :disabled="freeEntry"
                    class="w-full p-2 border rounded outline-none"
                  />
                </div>
                <div class="w-full sm:w-32">
                  <label
                    class="block text-xs font-semibold text-gray-600 mb-1"
                    :for="`ticket-quantity-${index}`"
                    >Total Tickets</label
                  >
                  <input
                    :id="`ticket-quantity-${index}`"
                    v-model.number="ticket.quantity"
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
                    :disabled="freeEntry"
                    class="w-full p-2 border rounded outline-none"
                  />
                </div>
                <button
                  type="button"
                  @click="removeTicketType(index)"
                  class="self-end text-red-500 hover:text-red-700 text-lg px-2 sm:mb-1"
                  title="Remove ticket type"
                >
                  ✕
                </button>
              </div>
              <button
                type="button"
                @click="addTicketType"
                :disabled="freeEntry"
                class="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                + Add ticket type
              </button>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Max tickets per user (optional)</label
                >
                <input
                  v-model.number="form.maxTicketsPerUser"
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  class="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Status</label
                >
                <select
                  v-model="form.status"
                  class="w-full p-3 border rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div class="mt-4 text-sm text-yellow-700 mb-4" v-if="!canSubmit">
              Please select Free Entry or add at least one ticket type before
              creating the event.
            </div>
            <div class="mt-6 flex gap-4">
              <button
                type="submit"
                :disabled="isLoading || !canSubmit"
                class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Icon
                  v-if="isLoading"
                  name="mdi:loading"
                  class="inline mr-2 animate-spin"
                />
                {{ isLoading ? "Creating Event..." : "Create Event" }}
              </button>
              <button
                type="reset"
                @click="clearForm"
                class="px-6 py-3 border rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Preview Column -->
      <aside class="lg:col-span-1">
        <div class="sticky top-20 space-y-4">
          <div class="bg-white rounded-2xl shadow p-6">
            <div class="h-40 rounded-lg overflow-hidden bg-gray-100">
              <img
                v-if="previewImage"
                :src="previewImage"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                Preview
              </div>
            </div>
            <h3 class="mt-4 text-lg font-bold">
              {{ form.title || "Untitled Event" }}
            </h3>
            <p class="text-sm text-gray-500 mt-2">
              {{
                form.date ? new Date(form.date).toDateString() : "Date not set"
              }}
            </p>
            <p class="mt-3 text-gray-700 text-sm">
              {{
                form.description
                  ? form.description.slice(0, 120) +
                    (form.description.length > 120 ? "..." : "")
                  : "No description yet"
              }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow p-4">
            <h4 class="text-sm font-semibold text-gray-700">Tickets</h4>
            <div class="mt-3 space-y-2">
              <template v-if="freeEntry">
                <div
                  class="flex justify-between text-sm text-green-600 font-medium"
                >
                  <span>Free Entry</span><span>✓</span>
                </div>
              </template>
              <template v-else-if="customTickets.length > 0">
                <div
                  v-for="t in customTickets"
                  :key="t.name + t.price"
                  class="flex justify-between text-sm"
                >
                  <span>{{ t.name || "Unnamed" }}</span
                  ><span
                    >{{ t.price ? "KES " + t.price : "Free" }} ·
                    {{ t.quantity || 0 }} left</span
                  >
                </div>
              </template>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Share Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="closeShareModal"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Share Event Link</h3>
          <button
            @click="closeShareModal"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Icon name="mdi:close" />
          </button>
        </div>
        <p class="text-sm text-gray-600 mb-4">
          Your event has been created. Share this link so people can view it.
          They will need to login or sign up to book.
        </p>
        <div class="flex items-center gap-2 border rounded-lg p-2 bg-gray-50">
          <input
            :value="shareUrl"
            readonly
            class="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
          />
          <button
            @click="copyShareUrl"
            class="px-3 py-2 text-sm font-semibold bg-[#9d4e8a] text-white rounded-lg hover:bg-[#7c3a6d] transition"
          >
            Copy
          </button>
        </div>
        <div class="flex justify-end mt-6">
          <button
            @click="closeShareModal"
            class="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { token } = useAuth();
const config = useRuntimeConfig();
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
  maxTicketsPerUser: null,
  status: "upcoming",
  image: null,
});

const isLoading = ref(false);
const previewImage = ref(null);
const file = ref(null);
const freeEntry = ref(false);
const customTickets = ref([]);

const addTicketType = () => {
  customTickets.value.push({ name: "", price: 0, quantity: 0 });
};

const removeTicketType = (index) => {
  customTickets.value.splice(index, 1);
};

const canSubmit = computed(
  () => freeEntry.value || customTickets.value.length > 0,
);

const toggleFreeEntry = () => {
  freeEntry.value = !freeEntry.value;
  if (freeEntry.value) {
    customTickets.value.forEach((t) => {
      t.price = 0;
    });
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
    maxTicketsPerUser: null,
    status: "upcoming",
    image: null,
  });
  freeEntry.value = false;
  customTickets.value = [];
  previewImage.value = null;
  file.value = null;
};

const shareUrl = ref("");
const showShareModal = ref(false);

const closeShareModal = () => {
  showShareModal.value = false;
  clearForm();
};

const copyShareUrl = async () => {
  try {
    await navigator.clipboard?.writeText(shareUrl.value);
    alert("Link copied to clipboard");
  } catch (err) {
    alert("Unable to copy link");
  }
};

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
    formData.append("regular", form.regular ?? 0);
    formData.append("vip", form.vip ?? 0);
    formData.append("vvip", form.vvip ?? 0);
    formData.append("customTickets", JSON.stringify(customTickets.value));
    formData.append("freeEntry", String(freeEntry.value));
    formData.append("TicketQuantity", form.TicketQuantity || 0);
    if (form.maxTicketsPerUser != null && form.maxTicketsPerUser !== "") {
      formData.append("maxTicketsPerUser", form.maxTicketsPerUser);
    }
    formData.append("status", form.status);
    formData.append("image", file.value);

    const res = await $fetch(`${config.public.createEventApi}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
      body: formData,
    });

    alert("✅ Event created successfully!");
    if (res?.shareUrl) {
      shareUrl.value = res.shareUrl;
      showShareModal.value = true;
    } else {
      clearForm();
    }
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
