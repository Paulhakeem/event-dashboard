<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Column -->
      <div class="lg:col-span-2">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-[#13284b] dark:text-white">Create an Event</h1>
          <p class="mt-2 text-gray-600 dark:text-neutral-400">
            Quickly create and publish events with a beautiful preview.
          </p>
        </div>

        <form @submit.prevent="submitEvent" class="space-y-6">
          <div class="bg-white rounded-2xl shadow p-6 dark:bg-neutral-900 dark:shadow-none">
            <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
              >Event Image</label
            >
            <label
              for="dropzone-file"
              class="relative flex items-center justify-center h-48 w-full border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden cursor-pointer hover:border-amber-400 transition"
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
                    class="text-4xl text-gray-400 dark:text-neutral-400"
                  />
                  <p class="text-sm text-gray-500 dark:text-neutral-400 mt-2">
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

          <div class="bg-white rounded-2xl shadow p-6 space-y-4 dark:bg-neutral-900 dark:shadow-none">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                >Event Title *</label
              >
              <input
                v-model="form.title"
                required
                placeholder="Summer Music Festival"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                >Description *</label
              >
              <textarea
                v-model="form.description"
                rows="4"
                required
                placeholder="Describe your event"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none resize-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                >Location *</label
              >
              <input
                v-model="form.location"
                required
                placeholder="Nairobi, Kenya"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                  >Start Date</label
                >
                <input
                  v-model="form.startDate"
                  type="date"
                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                  >End Date</label
                >
                <input
                  v-model="form.endDate"
                  type="date"
                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                  >Start Time</label
                >
                <input
                  v-model="form.startTime"
                  type="time"
                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                  >End Time</label
                >
                <input
                  v-model="form.endTime"
                  type="time"
                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-neutral-400">
              Start and end dates and times are optional. Provide at least one
              date so the event can be scheduled.
            </p>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                >Event Type</label
              >
              <select
                v-model="form.eventType"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
              >
                <option value="other">Select type</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Tech & Business">Tech & Business</option>
              </select>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow p-6 dark:bg-neutral-900 dark:shadow-none">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Pricing & Tickets</h3>
              <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-sm text-gray-600 dark:text-neutral-400">Free Entry</span>
                <input
                  type="checkbox"
                  :checked="freeEntry"
                  @change="toggleFreeEntry"
                  class="w-5 h-5 accent-amber-500"
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
                class="flex flex-col sm:flex-row sm:items-end gap-3 p-3 border rounded-lg dark:border-neutral-700"
              >
                <div class="flex flex-1 flex-col gap-1 w-full min-w-0">
                  <label
                    class="text-xs font-semibold text-gray-500 dark:text-neutral-400"
                    >Ticket Name</label
                  >
                  <input
                    v-model="ticket.name"
                    type="text"
                    placeholder="Ticket name e.g. Gold"
                    :disabled="freeEntry"
                    class="w-full p-2 border rounded outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                  />
                </div>
                <div class="flex flex-col gap-1 w-full sm:w-32">
                  <label
                    class="text-xs font-semibold text-gray-500 dark:text-neutral-400"
                    >Price (KES)</label
                  >
                  <input
                    v-model.number="ticket.price"
                    type="number"
                    min="0"
                    placeholder="0"
                    :disabled="freeEntry"
                    class="w-full p-2 border rounded outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                  />
                </div>
                <div class="flex flex-col gap-1 w-full sm:w-32">
                  <label
                    class="text-xs font-semibold text-gray-500 dark:text-neutral-400"
                    >Total Tickets</label
                  >
                  <input
                    v-model.number="ticket.quantity"
                    type="number"
                    min="1"
                    placeholder="0"
                    :disabled="freeEntry"
                    class="w-full p-2 border rounded outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                  />
                </div>
                <button
                  type="button"
                  @click="removeTicketType(index)"
                  class="text-red-500 hover:text-red-700 text-lg px-2 pb-1"
                >
                  ✕
                </button>
              </div>
              <button
                type="button"
                @click="addTicketType"
                :disabled="freeEntry"
                class="text-sm text-amber-500 hover:text-amber-800 font-medium"
              >
                + Add ticket type
              </button>
            </div>

            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                  >Max tickets per user (optional)</label
                >
                <input
                  v-model.number="form.maxTicketsPerUser"
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  class="w-full p-3 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                  >Event status</label
                >
                <select
                  v-model="form.status"
                  class="w-full p-3 border rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                >
                  <option value="pending">Pending</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2"
                  >Approval status</label
                >
                <input
                  value="Pending admin approval"
                  readonly
                  class="w-full p-3 border rounded-lg bg-gray-50 text-gray-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                />
              </div>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">
              New events are submitted as pending admin approval regardless of
              the selected event status.
            </p>

            <div class="mt-6 flex gap-4">
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-gradient-to-r from-amber-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-60"
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
                class="px-6 py-3 border rounded-lg dark:border-neutral-700"
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
          <div class="bg-white rounded-2xl shadow p-6 dark:bg-neutral-900 dark:shadow-none">
            <div class="h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
              <img
                v-if="previewImage"
                :src="previewImage"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 dark:text-neutral-400"
              >
                Preview
              </div>
            </div>
            <h3 class="mt-4 text-lg font-bold">
              {{ form.title || "Untitled Event" }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-400 mt-2">
              {{ scheduleLabel }}
            </p>
            <p class="mt-3 text-gray-700 dark:text-neutral-300 text-sm">
              {{
                form.description
                  ? form.description.slice(0, 120) +
                    (form.description.length > 120 ? "..." : "")
                  : "No description yet"
              }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow p-4 dark:bg-neutral-900 dark:shadow-none">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-neutral-300">Tickets</h4>
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
                  ><span>{{ t.price ? "KES " + t.price : "Free" }}</span>
                </div>
              </template>
              <div class="flex justify-between text-sm pt-2 border-t mt-2">
                <span>Available</span
                ><span>{{
                  freeEntry
                    ? "Free"
                    : customTickets.reduce(
                        (sum, t) => sum + (Number(t.quantity) || 0),
                        0,
                      )
                }}</span>
              </div>
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
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 dark:bg-neutral-900"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-neutral-100">
            Share Event Link
          </h3>
          <button
            @click="closeShareModal"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <Icon name="mdi:close" />
          </button>
        </div>
        <p class="text-sm text-gray-600 dark:text-neutral-400 mb-4">
          Your event has been submitted and is pending admin approval. Once
          approved, share this link so people can view it. They will need to
          login or sign up to book.
        </p>
        <div
          class="flex items-center gap-2 border rounded-lg p-2 bg-gray-50 dark:bg-neutral-950 dark:border-neutral-700"
        >
          <input
            :value="shareUrl"
            readonly
            class="flex-1 bg-transparent text-sm text-gray-700 dark:text-neutral-300 outline-none truncate"
          />
          <button
            @click="copyShareUrl"
            class="px-3 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Copy
          </button>
        </div>
        <div class="flex justify-end mt-6">
          <button
            @click="closeShareModal"
            class="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  form,
  isLoading,
  previewImage,
  freeEntry,
  customTickets,
  scheduleLabel,
  shareUrl,
  showShareModal,
  clearForm,
  addTicketType,
  removeTicketType,
  onFileChange,
  toggleFreeEntry,
  closeShareModal,
  copyShareUrl,
  submitEvent,
} = orgCreateEvent();
</script>
