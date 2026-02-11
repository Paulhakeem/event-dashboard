<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
  >
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <NuxtLink
          to="/eventPage"
          class="inline-flex items-center text-[#9c4e8b] hover:text-[#7c3a6d] mb-4 transition"
        >
          <Icon name="gg:arrow-left" class="mr-2" />
          Back to Events
        </NuxtLink>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
          {{ event?.title }}
        </h1>
        <p class="text-gray-600 mt-2 text-lg">
          Book your tickets for an unforgettable experience
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Event Image & Details -->
        <div class="lg:col-span-2">
          <!-- Image -->
          <div class="mb-8">
            <img
              :src="event?.image"
              alt="Event"
              class="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          <!-- Event Info Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-4 rounded-lg shadow-md">
              <p class="text-xs text-gray-500 uppercase">Location</p>
              <p class="text-sm font-semibold text-gray-900">
                📍 {{ event?.location }}
              </p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md">
              <p class="text-xs text-gray-500 uppercase">Date</p>
              <p class="text-sm font-semibold text-gray-900">
                📅
                {{
                  new Date(event?.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              </p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md">
              <p class="text-xs text-gray-500 uppercase">Type</p>
              <p class="text-sm font-semibold text-gray-900">
                🎭 {{ event?.eventType || "Event" }}
              </p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md">
              <p class="text-xs text-gray-500 uppercase">Status</p>
              <p
                :class="{
                  'text-green-600': event?.status === 'upcoming',
                  'text-blue-600': event?.status === 'ongoing',
                  'text-gray-600': event?.status === 'completed',
                  'text-red-600': event?.status === 'cancelled',
                }"
                class="text-sm font-semibold capitalize"
              >
                {{ event?.status || "upcoming" }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white p-8 rounded-2xl shadow-md mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              About This Event
            </h2>
            <p class="text-gray-700 leading-relaxed text-lg">
              {{ event?.description }}
            </p>
          </div>
        </div>

        <!-- Booking Sidebar -->
        <div class="lg:col-span-1">
          <!-- Ticket Selection -->
          <div class="bg-white rounded-2xl shadow-lg p-8 sticky top-4">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">
              Book Your Tickets
            </h3>

            <!-- Ticket Options -->
            <div class="space-y-3 mb-8">
              <!-- (Legacy ticket types removed) -->
              <!-- Regular / VIP / VVIP are shown below. If a price is not configured the option will be disabled. -->

              <!-- Regular Ticket -->
              <label
                class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-[#9c4e8b] cursor-pointer transition"
                :class="{
                  'border-[#9c4e8b] bg-purple-50': ticketType === 'regular',
                }"
              >
                <input
                  type="radio"
                  v-model="ticketType"
                  value="regular"
                  :disabled="event?.regular === undefined || event?.regular === null"
                  class="w-5 h-5 text-[#9c4e8b]"
                />
                <div class="ml-3 flex-1">
                  <p class="font-semibold text-gray-900">Regular Ticket</p>
                  <p class="text-sm text-gray-600">Standard access</p>
                </div>
                <span class="text-lg font-bold text-[#9c4e8b]"
                  >Ksh {{ event?.regular !== undefined && event?.regular !== null ? event?.regular : 'Not set' }}</span
                >
              </label>
              <!-- vip -->
              <label
                class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-[#9c4e8b] cursor-pointer transition"
                :class="{
                  'border-[#9c4e8b] bg-purple-50': ticketType === 'vip',
                }"
              >
                <input
                  type="radio"
                  v-model="ticketType"
                  value="vip"
                  :disabled="event?.vip === undefined || event?.vip === null"
                  class="w-5 h-5 text-[#9c4e8b]"
                />
                <div class="ml-3 flex-1">
                  <p class="font-semibold text-gray-900">VIP Ticket ⭐</p>
                  <p class="text-sm text-gray-600">Premium experience</p>
                </div>
                <span class="text-lg font-bold text-[#9c4e8b]"
                  >Ksh {{ event?.vip !== undefined && event?.vip !== null ? event?.vip : 'Not set' }}</span
                >
              </label>

              <label
                class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-[#9c4e8b] cursor-pointer transition"
                :class="{
                  'border-[#9c4e8b] bg-purple-50': ticketType === 'vvip',
                }"
              >
                <input
                  type="radio"
                  v-model="ticketType"
                  value="vvip"
                  :disabled="event?.vvip === undefined || event?.vvip === null"
                  class="w-5 h-5 text-[#9c4e8b]"
                />
                <div class="ml-3 flex-1">
                  <p class="font-semibold text-gray-900">VVIP Ticket 👑</p>
                  <p class="text-sm text-gray-600">Exclusive access</p>
                </div>
                <span class="text-lg font-bold text-[#9c4e8b]"
                  >Ksh {{ event?.vvip !== undefined && event?.vvip !== null ? event?.vvip : 'Not set' }}</span
                >
              </label>
            </div>

            <!-- Tickets Available -->
            <div class="mb-6 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-700">
                🎟️ {{ event?.TicketQuantity || 0 }} tickets available
              </p>
            </div>

            <!-- User Info -->
            <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold">
                  Your Name
                </p>
                <p class="text-gray-900 font-semibold">
                  {{ user.firstName }} {{ user.lastName }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold">
                  Email
                </p>
                <p class="text-gray-900 font-semibold">{{ user.email }}</p>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-900 mb-4">Payment Method</h4>

              <div class="space-y-3">
                <!-- mpesa payment -->
                <button
                  @click="bookAndPay"
                  class="w-full flex items-center justify-center gap-3 p-4 bg-linear-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 cursor-pointer"
                >
                  <Icon name="mingcute:phone-fill" class="text-2xl" />
                  {{ loading ? "Processing..." : "Pay with Mobile Money" }}
                </button>
                <!-- card payment -->
                <button
                  class="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition duration-200 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Icon name="solar:card-linear" class="text-2xl" />
                  Card (Coming Soon)
                </button>
              </div>
            </div>

            <!-- Messages -->
            <div
              v-if="error"
              class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4"
            >
              {{ error }}
            </div>
            <div
              v-if="successMessage"
              class="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm mb-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="font-semibold">{{ successMessage }}</p>
                  <p class="text-xs text-green-700">
                    We've emailed your ticket — you can also download it here.
                  </p>
                </div>
                <div class="ml-4 shrink-0">
                  <button
                    @click="downloadTicket"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50"
                  >
                    <Icon name="ic:round-download" />
                    Download Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useEventBooking from "~/composables/bookingEvent";

// import booking composable
const {
  event,
  loading,
  error,
  successMessage,
  bookAndPay,
  ticketType,
  downloadTicket,
} = useEventBooking();

const { user } = useAuth();
</script>
