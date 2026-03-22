<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
  >
    <!-- HEADER -->
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

    <!-- MAIN -->
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- EVENT INFO -->
        <div class="lg:col-span-2">
          <!-- IMAGE -->
          <div class="mb-8">
            <img
              :src="event?.image"
              alt="Event"
              class="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          <!-- INFO CARDS -->
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
              <p
                class="text-sm font-semibold capitalize"
                :class="{
                  'text-green-600': event?.status === 'upcoming',
                  'text-blue-600': event?.status === 'ongoing',
                  'text-gray-600': event?.status === 'completed',
                  'text-red-600': event?.status === 'cancelled',
                }"
              >
                {{ event?.status }}
              </p>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <div class="bg-white p-8 rounded-2xl shadow-md mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              About This Event
            </h2>

            <p class="text-gray-700 leading-relaxed text-lg">
              {{ event?.description }}
            </p>
          </div>
        </div>

        <!-- BOOKING SIDEBAR -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-8 sticky top-4">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">
              Book Your Tickets
            </h3>

            <!-- TICKET OPTIONS -->
            <div class="space-y-3 mb-8">
              <!-- REGULAR -->
              <label
                class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                :class="
                  ticketType === 'regular'
                    ? 'border-[#9c4e8b] bg-purple-50'
                    : 'border-gray-200'
                "
              >
                <input
                  type="radio"
                  value="regular"
                  v-model="ticketType"
                  :disabled="!event?.regular"
                  class="w-5 h-5 text-[#9c4e8b]"
                />

                <div class="ml-3 flex-1">
                  <p class="font-semibold text-gray-900">Regular Ticket</p>
                  <p class="text-sm text-gray-600">Standard access</p>
                </div>

                <span class="text-lg font-bold text-[#9c4e8b]">
                  Ksh {{ event?.regular || "Not set" }}
                </span>
              </label>

              <!-- VIP -->
              <label
                class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                :class="
                  ticketType === 'vip'
                    ? 'border-[#9c4e8b] bg-purple-50'
                    : 'border-gray-200'
                "
              >
                <input
                  type="radio"
                  value="vip"
                  v-model="ticketType"
                  :disabled="!event?.vip"
                  class="w-5 h-5 text-[#9c4e8b]"
                />

                <div class="ml-3 flex-1">
                  <p class="font-semibold text-gray-900">VIP Ticket ⭐</p>
                  <p class="text-sm text-gray-600">Premium experience</p>
                </div>

                <span class="text-lg font-bold text-[#9c4e8b]">
                  Ksh {{ event?.vip || "Not set" }}
                </span>
              </label>

              <!-- VVIP -->
              <label
                class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                :class="
                  ticketType === 'vvip'
                    ? 'border-[#9c4e8b] bg-purple-50'
                    : 'border-gray-200'
                "
              >
                <input
                  type="radio"
                  value="vvip"
                  v-model="ticketType"
                  :disabled="!event?.vvip"
                  class="w-5 h-5 text-[#9c4e8b]"
                />

                <div class="ml-3 flex-1">
                  <p class="font-semibold text-gray-900">VVIP Ticket 👑</p>
                  <p class="text-sm text-gray-600">Exclusive access</p>
                </div>

                <span class="text-lg font-bold text-[#9c4e8b]">
                  Ksh {{ event?.vvip || "Not set" }}
                </span>
              </label>
            </div>

            <!-- PHONE INPUT -->
            <div class="mb-6">
              <label class="text-sm text-gray-600"> M-Pesa Phone Number </label>

              <input
                v-model="phone"
                placeholder="2547XXXXXXXX"
                class="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <!-- USER INFO -->
            <div class="mb-6 pb-6 border-b border-gray-200">
              <p class="text-sm text-gray-500">
                {{ user?.firstName }} {{ user?.lastName }}
              </p>

              <p class="text-sm text-gray-500">
                {{ user?.email }}
              </p>
            </div>

            <!-- PAYMENT BUTTON -->
            <button
              @click="handleBooking"
              :disabled="
                !isBookable ||
                paymentStatus !== 'idle' ||
                event.status === 'completed'
              "
              class="w-full p-4 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2"
              :class="{
                'bg-green-500 hover:bg-green-600': paymentStatus === 'idle',
                'bg-yellow-500': paymentStatus === 'waiting',
                'bg-blue-500':
                  paymentStatus === 'verifying' || paymentStatus === 'sending',
                'bg-green-600': paymentStatus === 'success',
                'bg-red-500': paymentStatus === 'failed',
                'bg-gray-400 cursor-not-allowed':
                  paymentStatus !== 'idle' && paymentStatus !== 'success',
              }"
            >
              <!-- Spinner -->
              <svg
                v-if="
                  ['sending', 'waiting', 'verifying'].includes(paymentStatus)
                "
                class="animate-spin h-5 w-5 text-white"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>

              <!-- TEXT STATES -->
              <span v-if="paymentStatus === 'idle'">Pay with M-Pesa</span>
              <span v-else-if="paymentStatus === 'sending'"
                >Sending STK...</span
              >
              <span v-else-if="paymentStatus === 'waiting'"
                >Waiting for payment...</span
              >
              <span v-else-if="paymentStatus === 'verifying'"
                >Verifying payment...</span
              >
              <span v-else-if="paymentStatus === 'success'"
                >Payment Successful 🎉</span
              >
              <span v-else>Failed ❌ Try Again</span>
            </button>

            <!-- ERRORS -->
            <div v-if="error" class="mt-4 text-red-600 text-sm">
              {{ error }}
            </div>

            <!-- SUCCESS -->
            <div v-if="successMessage" class="mt-4 text-green-600 text-sm">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useEventBooking from "~/composables/bookingEvent";
import { computed, ref } from "vue";

const {
  event,
  loading,
  paymentStatus,
  error,
  successMessage,
  bookAndPay,
  ticketType,
} = useEventBooking();

const { user } = useAuth();

const phone = ref("");

const isBookable = computed(() => {
  const ev = event.value;

  if (!ev) return false;

  return (
    ticketType.value &&
    phone.value &&
    ev.status !== "cancelled" &&
    ev.status !== "completed" &&
    ev.TicketQuantity > 0
  );
});

const handleBooking = () => {
  bookAndPay(phone.value);
};
</script>
