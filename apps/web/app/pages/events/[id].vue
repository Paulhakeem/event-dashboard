<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-zinc-950 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950"
  >
    <div v-if="loading && !event?._id">
      <div
        class="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700"
      >
        <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <div
            class="h-6 w-32 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-4"
          ></div>
          <div
            class="h-10 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-2"
          ></div>
          <div
            class="h-5 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"
          ></div>
        </div>
      </div>
      <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div
              class="w-full h-96 bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse"
            ></div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="i in 4"
                :key="i"
                class="h-16 bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse"
              ></div>
            </div>
            <div
              class="h-48 bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse"
            ></div>
          </div>
          <div class="lg:col-span-1">
            <div
              class="h-[600px] bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!event?._id || (error && !event?._id)"
      class="min-h-screen flex items-center justify-center px-4"
    >
      <div class="text-center">
        <h1
          class="text-7xl md:text-9xl font-bold text-gray-900 dark:text-white mb-4"
        >
          404
        </h1>
        <h2
          class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200 mb-4"
        >
          Event Not Found
        </h2>
        <p class="text-gray-600 dark:text-neutral-400 mb-8 max-w-md">
          {{
            error ||
            "The event you're looking for doesn't exist or has been removed."
          }}
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
      <div
        class="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700"
      >
        <div class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <NuxtLink
            to="/eventPage"
            class="inline-flex items-center text-[#13284b] dark:text-white hover:text-[#0b1730] dark:hover:text-white mb-4 transition"
          >
            <Icon name="gg:arrow-left" class="mr-2" />
            Back to Events
          </NuxtLink>

          <div class="flex flex-wrap items-center gap-3">
            <h1
              class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
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

      <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="mb-8">
              <img
                :src="event?.image"
                alt="Event"
                class="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div
                class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none"
              >
                <p
                  class="text-xs text-gray-500 dark:text-neutral-400 uppercase"
                >
                  Location
                </p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  📍 {{ event?.location }}
                </p>
              </div>

              <div
                class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none"
              >
                <p
                  class="text-xs text-gray-500 dark:text-neutral-400 uppercase"
                >
                  Date
                </p>
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
                <p
                  v-if="formatEventTimeRange(event?.startTime, event?.endTime)"
                  class="mt-1 text-xs font-medium text-gray-500 dark:text-neutral-400"
                >
                  <Icon
                    name="mdi:clock-outline"
                    class="mr-1 text-[#13284b] dark:text-white"
                  />
                  {{ formatEventTimeRange(event?.startTime, event?.endTime) }}
                </p>
              </div>

              <div
                class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none"
              >
                <p
                  class="text-xs text-gray-500 dark:text-neutral-400 uppercase"
                >
                  Type
                </p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  🎭 {{ event?.eventType || "Event" }}
                </p>
              </div>

              <div
                class="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md dark:shadow-none"
              >
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

            <div
              class="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-md dark:shadow-none mb-8"
            >
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Event
              </h2>

              <p
                class="text-gray-700 dark:text-neutral-300 leading-relaxed text-lg whitespace-pre-line"
              >
                {{ event?.description }}
              </p>
            </div>
          </div>

          <div class="lg:col-span-1 h-full">
            <div
              class="flex h-full flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-lg dark:shadow-none p-6 sm:p-8"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Book Your Tickets
              </h3>

              <div class="flex-1">
                <div
                  class="mb-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-400/10 dark:bg-amber-400/5"
                >
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-[#13284b] shadow-sm dark:bg-neutral-800 dark:text-amber-300"
                  >
                    <Icon name="mdi:calendar-month" class="text-xl" />
                  </div>
                  <div class="min-w-0">
                    <p
                      class="text-sm font-bold text-[#13284b] dark:text-white"
                    >
                      {{
                        new Date(event?.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                    </p>
                    <p
                      v-if="formatEventTimeRange(event?.startTime, event?.endTime)"
                      class="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-neutral-400"
                    >
                      <Icon name="mdi:clock-outline" />
                      {{
                        formatEventTimeRange(event?.startTime, event?.endTime)
                      }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="event?.date"
                  class="mb-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-800/40"
                >
                  <p
                    class="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                  >
                    <Icon
                      name="mdi:timer-outline"
                      class="text-base text-amber-500"
                    />
                    Event countdown
                  </p>
                  <CountdownTimer
                    :date="event.date"
                    :start-time="event.startTime"
                    :end-date="event.endDate"
                    :end-time="event.endTime"
                    expired-label="Event is live"
                    finished-label="Event ended"
                  />
                </div>

                <div
                  v-if="event?.freeEntry"
                  class="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-500/20 dark:bg-green-500/10"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-green-600 dark:bg-green-500/10 dark:text-green-300"
                    >
                      <Icon name="mdi:ticket-check-outline" class="text-xl" />
                    </div>
                    <div>
                      <p
                        class="text-sm font-bold text-green-800 dark:text-green-300"
                      >
                        Free event
                      </p>
                      <p
                        class="mt-0.5 text-xs text-green-700/80 dark:text-green-200/70"
                      >
                        No payment is required for this event.
                      </p>
                    </div>
                  </div>
                </div>

                <div v-else-if="event?.customTickets?.length" class="mb-6">
                  <div class="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <p
                        class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500"
                      >
                        Ticket options
                      </p>
                      <h3
                        class="mt-1 text-base font-bold text-[#13284b] dark:text-white"
                      >
                        Choose your tickets
                      </h3>
                    </div>
                    <span
                      class="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      Max {{ maxQuantity }} · {{ remainingQuantity }} left
                    </span>
                  </div>

                  <div class="space-y-3">
                    <div
                      v-for="(ticket, index) in event.customTickets"
                      :key="`${ticket.name || ticket.ticketType || ticket.type}-${index}`"
                      class="rounded-2xl border p-4 transition-all duration-200"
                      :class="
                        quantityOf(ticket) > 0
                          ? 'border-amber-400 bg-amber-50/70 ring-4 ring-amber-100 dark:border-amber-400/60 dark:bg-amber-400/10 dark:ring-amber-400/10'
                          : 'border-gray-200 bg-white hover:border-[#13284b]/30 dark:border-neutral-700 dark:bg-neutral-800/40'
                      "
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex min-w-0 items-start gap-3">
                          <div
                            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                            :class="
                              quantityOf(ticket) > 0
                                ? 'bg-[#13284b] text-amber-300'
                                : 'bg-gray-100 text-[#13284b] dark:bg-neutral-700 dark:text-white'
                            "
                          >
                            <Icon name="mdi:ticket-outline" class="text-lg" />
                          </div>
                          <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                              <p
                                class="text-sm font-bold text-gray-900 dark:text-white"
                              >
                                {{
                                  ticket.name ||
                                  ticket.ticketType ||
                                  ticket.type
                                }}
                              </p>
                              <span
                                v-if="quantityOf(ticket) > 0"
                                class="rounded-full bg-[#13284b] px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                              >
                                Selected
                              </span>
                            </div>
                            <p
                              class="mt-1 text-lg font-extrabold text-[#9c4e8b] dark:text-amber-300"
                            >
                              Ksh {{ Number(ticket.price).toLocaleString() }}
                              <span
                                class="text-[11px] font-medium text-gray-500 dark:text-neutral-400"
                                >/ ticket</span
                              >
                            </p>
                            <p
                              class="mt-0.5 text-xs font-semibold"
                              :class="
                                isTicketTypeSoldOut(ticket)
                                  ? 'text-red-500'
                                  : 'text-gray-500 dark:text-neutral-400'
                              "
                            >
                              {{
                                isTicketTypeSoldOut(ticket)
                                  ? "Sold out"
                                  : `${ticketAvailable(ticket)} available`
                              }}
                            </p>
                          </div>
                        </div>

                        <span
                          v-if="isTicketTypeSoldOut(ticket)"
                          class="flex-shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700 dark:bg-red-500/20 dark:text-red-300"
                        >
                          Sold out
                        </span>
                      </div>

                      <div
                        class="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/80 p-2 ring-1 ring-gray-100 dark:bg-neutral-900/60 dark:ring-neutral-700/60"
                      >
                        <span
                          class="pl-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
                          >Quantity</span
                        >
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            @click="decreaseTicketQuantity(ticket)"
                            :disabled="quantityOf(ticket) <= 0"
                            :aria-label="`Decrease ${ticket.name || ticket.ticketType || ticket.type} quantity`"
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            min="0"
                            :max="maxForTicket(ticket)"
                            :value="quantityOf(ticket)"
                            @input="
                              setTicketQuantity(ticket, $event.target.value);
                              $event.target.value = quantityOf(ticket);
                            "
                            :aria-label="`${ticket.name || ticket.ticketType || ticket.type} quantity`"
                            class="w-12 rounded-lg border border-gray-200 bg-white py-1.5 text-center text-base font-extrabold text-gray-900 tabular-nums dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
                          />

                          <button
                            type="button"
                            @click="increaseTicketQuantity(ticket)"
                            :disabled="
                              isTicketTypeSoldOut(ticket) ||
                              quantityOf(ticket) >= maxForTicket(ticket)
                            "
                            :aria-label="`Increase ${ticket.name || ticket.ticketType || ticket.type} quantity`"
                            class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#13284b] text-lg font-bold text-white transition hover:bg-[#0b1730] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div
                        v-if="quantityOf(ticket) > 0"
                        class="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-xs dark:border-neutral-700"
                      >
                        <span
                          class="font-semibold text-gray-500 dark:text-neutral-400"
                        >
                          {{ quantityOf(ticket) }} × Ksh
                          {{
                            priceOf(
                              ticket.name || ticket.ticketType || ticket.type,
                            )
                          }}
                        </span>
                        <span
                          class="font-bold text-[#13284b] dark:text-white"
                        >
                          Ksh
                          {{
                            lineTotal({
                              ticketType:
                                ticket.name || ticket.ticketType || ticket.type,
                              quantity: quantityOf(ticket),
                            }).toLocaleString()
                          }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="totalQuantity > 0"
                    class="mt-4 rounded-2xl bg-[#13284b] p-4 text-white shadow-lg shadow-[#13284b]/20"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-sm font-semibold text-white/80">
                        🎟️ {{ totalQuantity }}
                        {{ totalQuantity === 1 ? "ticket" : "tickets" }} selected
                      </span>
                      <span class="text-lg font-extrabold text-amber-300">
                        Ksh {{ totalPrice.toLocaleString() }}
                      </span>
                    </div>
                    <p
                      v-if="remainingQuantity === 0"
                      class="mt-2 text-xs font-medium text-amber-200"
                    >
                      Maximum tickets per user reached.
                    </p>
                  </div>
                </div>

                <div
                  class="mb-6 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-800/40"
                >
                  <span
                    class="font-semibold text-gray-600 dark:text-neutral-300"
                  >
                    Tickets available
                  </span>
                  <span
                    class="font-extrabold text-[#13284b] dark:text-white"
                  >
                    {{
                      Array.isArray(event?.customTickets)
                        ? event.customTickets.reduce(
                            (s, t) =>
                              s +
                              (Number(t.availableQuantity ?? t.quantity) || 0),
                            0,
                          )
                        : event?.TicketQuantity || 0
                    }}
                  </span>
                </div>

                <div
                  class="mb-6 border-b border-gray-100 pb-6 dark:border-neutral-800"
                >
                  <div class="mb-4 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <Icon
                        name="mdi:account-circle-outline"
                        class="text-lg text-amber-500"
                      />
                      <p
                        class="text-sm font-bold text-[#13284b] dark:text-white"
                      >
                        {{ user ? "Booking as" : "Your details" }}
                      </p>
                    </div>
                    <span
                      v-if="user"
                      class="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-bold text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
                    >
                      Account
                    </span>
                    <span
                      v-else
                      class="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
                    >
                      Guest
                    </span>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        for="booking-first-name"
                        class="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
                      >
                        First name <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="booking-first-name"
                        v-model="firstName"
                        type="text"
                        autocomplete="given-name"
                        placeholder="e.g. Amina"
                        class="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#13284b] focus:bg-white focus:ring-4 focus:ring-[#13284b]/10 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-amber-400 dark:focus:bg-neutral-800 dark:focus:ring-amber-400/10"
                      />
                    </div>

                    <div>
                      <label
                        for="booking-last-name"
                        class="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
                      >
                        Last name <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="booking-last-name"
                        v-model="lastName"
                        type="text"
                        autocomplete="family-name"
                        placeholder="e.g. Wanjiku"
                        class="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#13284b] focus:bg-white focus:ring-4 focus:ring-[#13284b]/10 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-amber-400 dark:focus:bg-neutral-800 dark:focus:ring-amber-400/10"
                      />
                    </div>

                    <div class="sm:col-span-2">
                      <label
                        for="booking-email"
                        class="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
                      >
                        Email address <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="booking-email"
                        v-model="email"
                        type="email"
                        autocomplete="email"
                        placeholder="you@example.com"
                        class="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#13284b] focus:bg-white focus:ring-4 focus:ring-[#13284b]/10 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-amber-400 dark:focus:bg-neutral-800 dark:focus:ring-amber-400/10"
                      />
                    </div>
                  </div>

                  <p
                    v-if="!user"
                    class="mt-3 text-xs text-gray-500 dark:text-neutral-400"
                  >
                    Your ticket and payment confirmation are sent to this email.
                  </p>

                  <p
                    v-if="!user"
                    class="mt-3 text-xs leading-5 text-gray-600 dark:text-neutral-400"
                  >
                    You can book as a guest. Create a
                    <NuxtLink
                      to="/signup"
                      class="font-bold text-[#13284b] underline hover:text-[#0b1730] dark:text-amber-300 dark:hover:text-amber-200"
                    >
                      free account
                    </NuxtLink>
                    to track your tickets and save your favorite events.
                    Already have an account?
                    <NuxtLink
                      to="/login"
                      class="font-bold text-[#13284b] underline hover:text-[#0b1730] dark:text-amber-300 dark:hover:text-amber-200"
                    >
                      Log in
                    </NuxtLink>
                  </p>
                </div>

                <div class="mb-6">
                  <label
                    for="booking-phone"
                    class="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
                  >
                    M-Pesa phone number
                  </label>
                  <div class="relative mt-1.5">
                    <span
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"
                    >
                      <Icon name="mdi:cellphone" class="text-lg" />
                    </span>
                    <input
                      id="booking-phone"
                      v-model="phone"
                      placeholder="+2547XXXXXXXX"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#13284b] focus:bg-white focus:ring-4 focus:ring-[#13284b]/10 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-amber-400 dark:focus:bg-neutral-800 dark:focus:ring-amber-400/10"
                    />
                  </div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">
                    You'll receive an M-Pesa prompt on this number.
                  </p>
                </div>
              </div>

              <div class="shrink-0">
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
                  class="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  :class="{
                    'bg-gradient-to-r from-[#13284b] to-[#1e3a6b] hover:from-[#0b1730] hover:to-[#13284b]':
                      paymentStatus === 'idle' &&
                      !event?.freeEntry &&
                      !isEventSoldOut,
                    'bg-amber-500': paymentStatus === 'waiting',
                    'bg-amber-600': paymentStatus === 'pending',
                    'bg-blue-500':
                      paymentStatus === 'verifying' ||
                      paymentStatus === 'sending',
                    'bg-green-600': paymentStatus === 'success',
                    'bg-red-500': paymentStatus === 'failed',
                    'bg-gray-400':
                      event?.freeEntry ||
                      isEventSoldOut ||
                      ['sending', 'waiting', 'verifying'].includes(
                        paymentStatus,
                      ),
                  }"
                >
                  <svg
                    v-if="
                      ['sending', 'waiting', 'verifying'].includes(
                        paymentStatus,
                      )
                    "
                    class="h-5 w-5 animate-spin text-white"
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

                  <span v-if="event?.freeEntry">Free Event</span>
                  <span v-else-if="isEventSoldOut">Sold Out</span>
                  <span v-else-if="paymentStatus === 'idle'"
                    >Pay with M-Pesa</span
                  >
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

                <div
                  v-if="error"
                  class="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                >
                  <Icon
                    name="mdi:alert-circle-outline"
                    class="mt-0.5 shrink-0 text-base"
                  />
                  <span>{{ error }}</span>
                </div>

                <div
                  v-if="successMessage"
                  class="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
                >
                  <Icon
                    name="mdi:check-circle-outline"
                    class="mt-0.5 shrink-0 text-base"
                  />
                  <span>{{ successMessage }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PaymentAlert
      :open="!!paymentAlert"
      :variant="paymentAlert?.variant"
      :title="paymentAlert?.title"
      :message="paymentAlert?.message"
      @close="paymentAlert = null"
    />
  </div>
</template>

<script setup>
import useEventDetails from "~/composables/useEventDetails";
import PaymentAlert from "~/components/Events/PaymentAlert.vue";
import { formatEventTimeRange } from "@velora/shared/composables/useEventTime";

const {
  event,
  loading,
  paymentStatus,
  error,
  successMessage,
  checkPaymentStatus,
  user,
  paymentAlert,
  phone,
  firstName,
  lastName,
  email,
  priceOf,
  ticketAvailable,
  isTicketTypeSoldOut,
  isEventSoldOut,
  lineTotal,
  totalQuantity,
  totalPrice,
  maxQuantity,
  remainingQuantity,
  quantityOf,
  maxForTicket,
  setTicketQuantity,
  increaseTicketQuantity,
  decreaseTicketQuantity,
  isBookable,
  copyShareLink,
  handleBooking,
} = useEventDetails();
</script>
