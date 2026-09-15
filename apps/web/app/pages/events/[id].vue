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
                <Icon
                  name="mdi:calendar-month"
                  class="inline mr-1 text-[#9c4e8b]"
                />
                {{
                  new Date(event?.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
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

            <!-- EVENT DATE -->
            <div
              class="flex items-center gap-2 mb-6 p-3 bg-purple-50 rounded-lg border border-purple-100"
            >
              <Icon
                name="mdi:calendar-month"
                class="text-[#9c4e8b] text-xl flex-shrink-0"
              />
              <p class="text-sm font-semibold text-gray-900">
                {{
                  new Date(event?.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
              </p>
            </div>

            <!-- COUNTDOWN -->
            <div v-if="event?.date" class="mb-6">
              <p class="text-sm text-gray-500 mb-2">Time until event starts</p>
              <CountdownTimer
                :date="event.date"
                expired-label="Event is live"
              />
            </div>

            <!-- TICKET OPTIONS -->
            <div
              v-if="event?.freeEntry"
              class="mb-8 p-4 bg-green-50 rounded-xl border border-green-100 text-green-700"
            >
              <p class="font-semibold">Free Event</p>
              <p class="text-sm text-gray-600 mt-1">
                This event is free entry, so the payment button is disabled.
              </p>
            </div>
            <div v-else-if="event?.customTickets?.length" class="mb-8">
              <!-- TICKET LINES -->
              <div
                v-for="(line, index) in ticketLines"
                :key="index"
                class="p-4 border-2 rounded-xl mb-3 transition"
                :class="
                  line.ticketType
                    ? 'border-[#9c4e8b] bg-purple-50'
                    : 'border-gray-200'
                "
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <label
                      class="block text-xs font-semibold text-gray-500 mb-1"
                    >
                      Ticket Type{{
                        ticketLines.length > 1 ? " " + (index + 1) : ""
                      }}
                    </label>
                    <select
                      :value="line.ticketType"
                      @change="line.ticketType = $event.target.value"
                      class="w-full p-2.5 border rounded-lg text-sm font-semibold text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[#9c4e8b] bg-white"
                    >
                      <option value="" disabled>Select ticket type</option>
                      <option
                        v-for="ticket in event.customTickets"
                        :key="ticket.name"
                        :value="ticket.name"
                      >
                        {{ ticket.name }} — Ksh {{ ticket.price }}
                      </option>
                    </select>
                  </div>

                  <button
                    v-if="ticketLines.length > 1"
                    type="button"
                    @click="removeTicketLine(index)"
                    :aria-label="'Remove ticket line ' + (index + 1)"
                    title="Remove this ticket"
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition text-xl font-bold flex-shrink-0"
                  >
                    −
                  </button>
                </div>

                <div class="flex items-center justify-between mt-3">
                  <span class="text-sm text-gray-600">Quantity</span>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="decreaseLineQuantity(index)"
                      :disabled="line.quantity <= 0"
                      aria-label="Decrease quantity"
                      class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>

                    <span
                      class="w-6 text-center text-xl font-bold text-gray-900 tabular-nums"
                    >
                      {{ line.quantity }}
                    </span>

                    <button
                      type="button"
                      @click="increaseLineQuantity(index)"
                      :disabled="
                        !line.ticketType ||
                        line.quantity >= remainingForLine(index)
                      "
                      aria-label="Increase quantity"
                      class="flex h-9 w-9 items-center justify-center rounded-full bg-[#9c4e8b] hover:bg-[#7c3a6d] text-lg font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  v-if="line.ticketType"
                  class="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 text-sm"
                >
                  <span class="text-gray-600">
                    {{ line.quantity }} × Ksh {{ priceOf(line.ticketType) }}
                  </span>
                  <span class="font-bold text-[#9c4e8b]">
                    Ksh {{ lineTotal(line).toLocaleString() }}
                  </span>
                </div>
              </div>

              <!-- ADD MORE -->
              <button
                type="button"
                @click="addTicketLine"
                class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-[#9c4e8b]/40 text-[#9c4e8b] font-semibold hover:bg-purple-50 transition"
              >
                <span class="text-lg leading-none">+</span>
                Add more tickets
              </button>

              <!-- SUMMARY -->
              <div
                v-if="totalQuantity > 0"
                class="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg text-sm"
              >
                <span class="text-gray-600">
                  🎟️ {{ totalQuantity }}
                  {{ totalQuantity === 1 ? "ticket" : "tickets" }} selected
                </span>
                <span class="font-bold text-[#9c4e8b] text-base">
                  Total: Ksh {{ totalPrice.toLocaleString() }}
                </span>
              </div>
            </div>

            <div
              class="flex items-center justify-between text-sm text-gray-600 mb-6"
            >
              <span>🎟️ {{ event?.TicketQuantity || 0 }} tickets available</span>
            </div>

            <!-- PHONE INPUT -->
            <div class="mb-6">
              <label class="text-sm text-gray-600"> M-Pesa Phone Number </label>

              <input
                v-model="phone"
                placeholder="+2547XXXXXXXX"
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
                (paymentStatus !== 'idle' && paymentStatus !== 'failed')
              "
              class="w-full p-4 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
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
              <span v-if="event?.freeEntry">Free Event</span>
              <span v-else-if="paymentStatus === 'idle'">Pay with M-Pesa</span>
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

const { event, paymentStatus, error, successMessage, bookAndPay } =
  useEventBooking();

const { user } = useAuth();

const phone = ref("");
const ticketLines = ref([{ ticketType: "", quantity: 1 }]);

const priceOf = (name) =>
  event.value?.customTickets?.find((t) => t.name === name)?.price ?? 0;

const lineTotal = (line) => priceOf(line.ticketType) * (line.quantity || 0);

const totalQuantity = computed(() =>
  ticketLines.value.reduce((sum, line) => sum + (line.quantity || 0), 0),
);

const totalPrice = computed(() =>
  ticketLines.value.reduce((sum, line) => sum + lineTotal(line), 0),
);

const maxQuantity = computed(() => event.value?.TicketQuantity || 0);

const selectedTickets = computed(() =>
  ticketLines.value
    .filter((line) => line.ticketType && Number(line.quantity) > 0)
    .map((line) => ({
      ticketType: line.ticketType,
      quantity: Number(line.quantity),
    })),
);

const addTicketLine = () => {
  if (totalQuantity.value >= maxQuantity.value) return;
  ticketLines.value.push({ ticketType: "", quantity: 1 });
};

const removeTicketLine = (index) => {
  if (ticketLines.value.length <= 1) return;
  ticketLines.value.splice(index, 1);
};

const remainingForLine = (index) => {
  const line = ticketLines.value[index];
  const other = totalQuantity.value - (line?.quantity || 0);
  return Math.max(0, maxQuantity.value - other);
};

const increaseLineQuantity = (index) => {
  const line = ticketLines.value[index];
  if (!line?.ticketType) return;
  if (line.quantity < remainingForLine(index)) line.quantity++;
};

const decreaseLineQuantity = (index) => {
  const line = ticketLines.value[index];
  if (line?.quantity > 0) line.quantity--;
};

const isBookable = computed(() => {
  const ev = event.value;

  if (!ev) return false;
  if (ev.freeEntry) return false;

  return (
    selectedTickets.value.length > 0 &&
    phone.value &&
    ev.status !== "cancelled" &&
    ev.status !== "completed" &&
    ev.TicketQuantity > 0 &&
    totalQuantity.value <= ev.TicketQuantity &&
    selectedTickets.value.every((t) => {
      const match = ev.customTickets?.find((c) => c.name === t.ticketType);
      return !!match && !!match.price;
    })
  );
});

const handleBooking = () => {
  bookAndPay(phone.value, selectedTickets.value);
};
</script>
