<template>
  <div class="space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="mdi:ticket" class="text-[#9d4e8a]" /> My Tickets
      </h2>
      <p class="text-sm text-gray-500">
        View and manage your upcoming and past event tickets here
      </p>
    </div>

    <!-- Tickets Card -->
    <div class="p-6 bg-linear-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <p class="text-lg font-semibold text-gray-700">My Tickets</p>
        <NuxtLink
          to="/eventPage"
          class="px-4 py-2 text-sm font-medium text-white bg-[#9d4e8a] rounded-lg shadow transition cursor-pointer"
        >
          Explore Events
        </NuxtLink>
      </div>

      <!-- Filter Tabs -->
      <div class="flex space-x-2 mb-6">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          @click="activeFilter = option.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium',
            activeFilter === option.value
              ? 'bg-[#9d4e8a] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTickets.length === 0" class="text-center py-10">
        <div class="flex justify-center mb-3">
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-[#9d4e8a]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.894L9 2m6 18l5.447-2.724A2 2 0 0021 15.382V6.618a2 2 0 00-1.553-1.894L15 2M9 2h6v18H9V2z" />
            </svg>
          </div>
        </div>
        <p class="text-gray-500">
          You have no tickets yet. <br />
          <span class="text-[#9d4e8a] font-medium">Explore events</span> and book your tickets to see them here!
        </p>
      </div>

      <!-- Tickets List -->
      <div class="space-y-4">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket._id"
          class="p-4 bg-white rounded-lg shadow border border-gray-200"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-gray-800">{{ ticket.eventName }}</h3>
              <p class="text-sm text-gray-500">Ticket ID: {{ ticket._id }}</p>
            </div>
            <span class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              {{ new Date(ticket.createdAt).toLocaleDateString() }}
            </span>
            <span class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium uppercase">
              {{ ticket.ticketType }}
            </span>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {{ ticket.amount }} Ksh
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const { tickets, filterOptions, activeFilter, filteredTickets } = useTickets();

</script>