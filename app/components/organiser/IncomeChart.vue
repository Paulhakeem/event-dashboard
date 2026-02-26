<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-lg font-semibold mb-4">Monthly Income</h2>

    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading income data...
    </div>

    <div v-else-if="IncomeData.length === 0" class="text-center py-10 text-gray-400">
      No bookings found
    </div>

    <BarChart
      v-else
      :data="IncomeData"
      :height="300"
      :categories="IncomeCategories"
      :y-axis="['total']"
      :x-num-ticks="6"
      :radius="4"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
    />
  </div>
</template>

<script setup>
/* =========================
   IMPORTS
========================= */
const { token } = useAuth()

/* =========================
   STATE
========================= */
const eventsBooked = ref([])
const loading = ref(false)

/* =========================
   FETCH BOOKINGS
========================= */
const getBookedEvents = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/organiser/bookedEvents/booking', {
      headers: {
        Authorization: `Bearer ${token._value}`,
      },
    })

    // adjust if your API shape differs
    eventsBooked.value = res.bookings || res || []
  } catch (err) {
    alert('Failed to load booked events')
  } finally {
    loading.value = false
  }
}

onMounted(getBookedEvents)

/* =========================
   COMPUTED MONTHLY TOTALS
========================= */
const IncomeData = computed(() => {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ]

  const totals = {}
  months.forEach(m => (totals[m] = 0))

  eventsBooked.value.forEach(event => {
    if (!event.createdAt || !event.amount) return

    const date = new Date(event.createdAt)
    const month = months[date.getMonth()]
    totals[month] += Number(event.amount)
  })

  return months.map(month => ({
    month,
    total: totals[month],
  }))
})

/* =========================
   CHART CONFIG
========================= */
const IncomeCategories = computed(() => ({
  total: {
    name: 'Total Income',
    color: '#22c55e',
  },
}))

const xFormatter = (i) =>
  IncomeData.value[i]?.month || ''

const yFormatter = (value) =>
  `KES ${value.toLocaleString()}`
</script>
