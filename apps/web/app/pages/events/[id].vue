<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-zinc-950 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950"
  >
    <!-- LOADING SKELETON -->
    <div v-if="loading && !event?._id">
      <div class="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
        <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <div class="h-6 w-32 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-4"></div>
          <div class="h-10 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-2"></div>
          <div class="h-5 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
        </div>
      </div>
      <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="w-full h-96 bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse"></div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="i in 4" :key="i" class="h-16 bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
            </div>
            <div class="h-48 bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse"></div>
          </div>
          <div class="lg:col-span-1">
            <div class="h-[600px] bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 404 / ERROR -->
    <div v-else-if="!event?._id || (error && !event?._id)" class="min-h-screen flex items-center justify-center px-4">
      <div class="text-center">
        <h1 class="text-7xl md:text-9xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200 mb-4">Event Not Found</h2>
        <p class="text-gray-600 dark:text-neutral-400 mb-8 max-w-md">
          {{ error || "The event you're looking for doesn't exist or has been removed." }}
        </p>
        <NuxtLink
          to="/eventPage"
          class="inline-flex items-center gap-2 px-6 py-3 bg-[#13284b] hover:bg-[#0b1730] text-white font-semibold rounded-lg transition"
        >
          <Icon name="gg:arrow-left" />
          Back to Events
        </NuxtLink>
      </div>
    </div>

    <div
      v-else
      class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-zinc-950 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950"
    >
    <!-- HEADER -->
    <div class="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
      <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <NuxtLink
          to="/eventPage"
          class="inline-flex items-center text-[#13284b] dark:text-white hover:text-[#0b1730] dark:hover:text-white mb-4 transition"
        >
          <Icon name="gg:arrow-left" class="mr-2" />
          Back to Events
        </NuxtLink>

        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {{ event?.title }}
          </h1>
          <button
            @click="copyShareLink"
            class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-amber-300 text-[#101d3a] hover:bg-amber-200 transition active:scale-95"
          >
            <Icon name="mdi:share-variant" />
            Share
          </button>
        </div>

        <p class="text-gray-600 dark:text-neutral-400 mt-2 text-lg">
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
            <div class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none">
              <p class="text-xs text-gray-500 dark:text-neutral-400 uppercase">Location</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                📍 {{ event?.location }}
              </p>
            </div>

            <div class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none">
              <p class="text-xs text-gray-500 dark:text-neutral-400 uppercase">Date</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                <Icon
                  name="mdi:calendar-month"
                  class="inline mr-1 text-[#13284b] dark:text-white"
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

            <div class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none">
              <p class="text-xs text-gray-500 dark:text-neutral-400 uppercase">Type</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                🎭 {{ event?.eventType || "Event" }}
              </p>
            </div>

            <div class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none">
              <p
                class="text-sm font-semibold capitalize"
                :class="{
                  'text-green-600': event?.status === 'upcoming',
                  'text-blue-600': event?.status === 'ongoing',
                  'text-gray-600': event?.status === 'completed',
                  'dark:text-neutral-400': event?.status === 'completed',
                  'text-red-600': event?.status === 'cancelled',
                }"
              >
                {{ event?.status }}
              </p>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <div class="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-md dark:shadow-none mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About This Event
            </h2>

            <p class="text-gray-700 dark:text-neutral-300 leading-relaxed text-lg">
              {{ event?.description }}
            </p>
          </div>
        </div>

        <!-- BOOKING SIDEBAR -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-none p-8 sticky top-4">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Book Your Tickets
            </h3>

            <!-- EVENT DATE -->
            <div
              class="flex items-center gap-2 mb-6 p-3 bg-amber-50 rounded-lg border border-amber-100"
            >
              <Icon
                name="mdi:calendar-month"
                class="text-[#13284b] text-xl flex-shrink-0"
              />
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
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
              <p class="text-sm text-gray-500 dark:text-neutral-400 mb-2">Time until event starts</p>
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
                    ? 'border-[#13284b] bg-amber-50'
                    : 'border-gray-200 dark:border-neutral-700'
                "
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <label
                      class="block text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1"
                    >
                      Ticket Type{{
                        ticketLines.length > 1 ? " " + (index + 1) : ""
                      }}
                    </label>
                    <select
                      :value="line.ticketType"
                      @change="line.ticketType = $event.target.value"
                      class="w-full p-2.5 border rounded-lg text-sm font-semibold text-gray-900 dark:text-white shadow-sm dark:shadow-none outline-none focus:ring-2 focus:ring-[#13284b] bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    >
                      <option value="" disabled>Select ticket type</option>
                      <option
                        v-for="ticket in event.customTickets"
                        :key="ticket.name"
                        :value="ticket.name"
                      >
                        {{ ticket.name }} — Ksh {{ ticket.price }} ({{
                          ticket.availableQuantity ?? ticket.quantity ?? 0
                        }}
                        tickets)
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
                  <span class="text-sm text-gray-600 dark:text-neutral-400">Quantity</span>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="decreaseLineQuantity(index)"
                      :disabled="line.quantity <= 0"
                      aria-label="Decrease quantity"
                      class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-lg font-bold text-gray-700 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>

                    <span
                      class="w-6 text-center text-xl font-bold text-gray-900 dark:text-white tabular-nums"
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
                      class="flex h-9 w-9 items-center justify-center rounded-full bg-[#13284b] hover:bg-[#0b1730] text-lg font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  v-if="line.ticketType"
                  class="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-neutral-700 text-sm"
                >
                  <span class="text-gray-600 dark:text-neutral-400">
                    {{ line.quantity }} × Ksh {{ priceOf(line.ticketType) }}
                  </span>
                  <span class="font-bold text-[#13284b] dark:text-white">
                    Ksh {{ lineTotal(line).toLocaleString() }}
                  </span>
                </div>
              </div>

              <!-- ADD MORE -->
              <button
                type="button"
                @click="addTicketLine"
                class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-[#13284b]/40 text-[#13284b] dark:text-white font-semibold hover:bg-amber-50 transition"
              >
                <span class="text-lg leading-none">+</span>
                Add more tickets
              </button>

              <!-- SUMMARY -->
              <div
                v-if="totalQuantity > 0"
                class="flex items-center justify-between mt-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg text-sm"
              >
                <span class="text-gray-600 dark:text-neutral-400">
                  🎟️ {{ totalQuantity }}
                  {{ totalQuantity === 1 ? "ticket" : "tickets" }} selected
                </span>
                <span class="font-bold text-[#13284b] dark:text-white text-base">
                  Total: Ksh {{ totalPrice.toLocaleString() }}
                </span>
              </div>
            </div>

            <div
              class="flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400 mb-6"
            >
              <span>🎟️ {{ (Array.isArray(event?.customTickets) ? event.customTickets.reduce((s,t)=>s+(Number(t.availableQuantity??t.quantity)||0),0) : (event?.TicketQuantity||0)) }} tickets available</span>
            </div>

            <!-- CONTACT DETAILS -->
            <div class="mb-6 pb-6 border-b border-gray-200 dark:border-neutral-700">
              <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                  {{ user ? "Booking as" : "Your details" }}
                </p>
                <span
                  v-if="user"
                  class="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5"
                >
                  Account
                </span>
                <span
                  v-else
                  class="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5"
                >
                  Guest
                </span>
              </div>

              <div class="space-y-3">
                <div>
                  <label for="booking-first-name" class="text-sm text-gray-600 dark:text-neutral-400">
                    First name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="booking-first-name"
                    v-model="firstName"
                    type="text"
                    autocomplete="given-name"
                    placeholder="e.g. Amina"
                    class="w-full border rounded-lg p-3 mt-1 text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label for="booking-last-name" class="text-sm text-gray-600 dark:text-neutral-400">
                    Last name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="booking-last-name"
                    v-model="lastName"
                    type="text"
                    autocomplete="family-name"
                    placeholder="e.g. Wanjiku"
                    class="w-full border rounded-lg p-3 mt-1 text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label for="booking-email" class="text-sm text-gray-600 dark:text-neutral-400">
                    Email address <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="booking-email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    class="w-full border rounded-lg p-3 mt-1 text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500"
                  />
                </div>
              </div>

              <p v-if="!user" class="mt-3 text-xs text-gray-500 dark:text-neutral-400">
                Your ticket and payment confirmation are sent to this email.
              </p>

              <p v-if="!user" class="mt-3 text-sm text-gray-600 dark:text-neutral-400">
                Have an account?
                <NuxtLink
                  to="/login"
                  class="font-semibold text-[#13284b] dark:text-white underline hover:text-[#0b1730] dark:hover:text-white"
                >
                  Log in
                </NuxtLink>
                or
                <NuxtLink
                  to="/signup"
                  class="font-semibold text-[#13284b] dark:text-white underline hover:text-[#0b1730] dark:hover:text-white"
                >
                  Sign up
                </NuxtLink>
                to track your bookings.
              </p>
            </div>

            <!-- PHONE INPUT -->
            <div class="mb-6">
              <label class="text-sm text-gray-600 dark:text-neutral-400"> M-Pesa Phone Number </label>

              <input
                v-model="phone"
                placeholder="+2547XXXXXXXX"
                class="w-full border rounded-lg p-3 mt-2 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500"
              />
            </div>

            <!-- PAYMENT BUTTON -->
            <button
              @click="
                paymentStatus === 'pending'
                  ? checkPaymentStatus()
                  : handleBooking()
              "
              :disabled="
                event?.freeEntry ||
                !isBookable ||
                !['idle', 'failed', 'pending'].includes(paymentStatus)
              "
              class="w-full p-4 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
              :class="{
                'bg-green-500 hover:bg-green-600': paymentStatus === 'idle',
                'bg-yellow-500': paymentStatus === 'waiting',
                'bg-yellow-600': paymentStatus === 'pending',
                'bg-blue-500':
                  paymentStatus === 'verifying' || paymentStatus === 'sending',
                'bg-green-600': paymentStatus === 'success',
                'bg-red-500': paymentStatus === 'failed',
                'bg-gray-400 cursor-not-allowed': [
                  'sending',
                  'waiting',
                  'verifying',
                ].includes(paymentStatus),
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
              <span v-else-if="paymentStatus === 'pending'"
                >Check payment status</span
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
  </div>
</template>

<script setup>
import useEventBooking from "~/composables/bookingEvent";
import { computed, ref, watch } from "vue";

const route = useRoute();

const {
  event,
  loading,
  paymentStatus,
  error,
  successMessage,
  bookAndPay,
  checkPaymentStatus,
} = useEventBooking();

const { user } = useAuth();

const phone = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const ticketLines = ref([{ ticketType: "", quantity: 1 }]);

// Logged-in users book with their account details by default; guests type
// their own. The fields stay editable either way.
watch(
  user,
  (u) => {
    if (!u) return;
    if (!firstName.value) firstName.value = u.firstName || "";
    if (!lastName.value) lastName.value = u.lastName || "";
    if (!email.value) email.value = u.email || "";
  },
  { immediate: true },
);

const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const priceOf = (name) =>
  event.value?.customTickets?.find((t) => t.name === name)?.price ?? 0;

const lineTotal = (line) => priceOf(line.ticketType) * (line.quantity || 0);

const totalQuantity = computed(() =>
  ticketLines.value.reduce((sum, line) => sum + (line.quantity || 0), 0),
);

const totalPrice = computed(() =>
  ticketLines.value.reduce((sum, line) => sum + lineTotal(line), 0),
);

const maxQuantity = computed(() => {
  const eventTotal = event.value?.TicketQuantity || 0;
  const maxPerUser = Math.floor(Number(event.value?.maxTicketsPerUser) || 0);
  if (maxPerUser > 0) return Math.min(eventTotal || maxPerUser, maxPerUser);
  return eventTotal;
});

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

const getTypeAvailability = (typeName) => {
  if (!typeName) return Infinity;
  const t = event.value?.customTickets?.find(
    (c) => String(c.name || c.ticketType || c.type).toLowerCase() === String(typeName).toLowerCase(),
  );
  if (t) {
    const avail = Number(t.availableQuantity ?? t.quantity ?? 0);
    if (Number.isFinite(avail) && avail >= 0) return avail;
  }
  return maxQuantity.value;
};

const remainingForLine = (index) => {
  const line = ticketLines.value[index];
  const avail = getTypeAvailability(line?.ticketType);
  if (!Number.isFinite(avail)) {
    const other = totalQuantity.value - (line?.quantity || 0);
    return Math.max(0, maxQuantity.value - other);
  }
  return Math.max(0, avail);
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
    firstName.value.trim() &&
    lastName.value.trim() &&
    isEmail(email.value) &&
    ev.status !== "cancelled" &&
    ev.status !== "completed" &&
    ev.TicketQuantity > 0 &&
    totalQuantity.value <= maxQuantity.value &&
    selectedTickets.value.every((t) => {
      const match = ev.customTickets?.find((c) => c.name === t.ticketType);
      return !!match && !!match.price;
    })
  );
});

const copyShareLink = async () => {
  if (process.client) {
    const url =
      event.value?.shareUrl ||
      `${window.location.origin}/events/${route.params.id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      } else {
        window.prompt("Copy this link:", url);
      }
    } catch (err) {
      window.prompt("Copy this link:", url);
    }
  }
};

const handleBooking = () => {
  if (event.value?.freeEntry) return;
  bookAndPay(phone.value, selectedTickets.value, {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
  });
};
</script>
