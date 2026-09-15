<template>
  <div>
    <!-- COMPACT (single pill) -->
    <div
      v-if="compact"
      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#9c4e8b]/10 text-[#9c4e8b] text-[11px] font-semibold"
      :title="expired ? 'Event date has passed' : 'Time until the event starts'"
    >
      <Icon name="mdi:timer-outline" class="text-sm" />
      <span v-if="expired">{{ expiredLabel }}</span>
      <span v-else class="tabular-nums">
        {{ pad(days) }}d : {{ pad(hours) }}h : {{ pad(minutes) }}m :
        {{ pad(seconds) }}s
      </span>
    </div>

    <!-- FULL (boxes) -->
    <div v-else class="grid grid-cols-4 gap-2">
      <div
        v-for="unit in units"
        :key="unit.label"
        class="flex flex-col items-center justify-center rounded-xl bg-[#9c4e8b]/10 border border-[#9c4e8b]/20 py-3"
      >
        <span class="text-2xl font-bold text-[#9c4e8b] tabular-nums">
          {{ pad(unit.value) }}
        </span>
        <span class="text-[10px] uppercase tracking-wide text-gray-500">
          {{ unit.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  date: { type: [String, Date, Number], required: true },
  compact: { type: Boolean, default: false },
  expiredLabel: { type: String, default: "Event started" },
});

const now = ref(Date.now());
let timer = null;

const target = computed(() => new Date(props.date).getTime());
const diff = computed(() => Math.max(0, target.value - now.value));
const expired = computed(() => diff.value <= 0);

const days = computed(() => Math.floor(diff.value / 86400000));
const hours = computed(() => Math.floor((diff.value % 86400000) / 3600000));
const minutes = computed(() => Math.floor((diff.value % 3600000) / 60000));
const seconds = computed(() => Math.floor((diff.value % 60000) / 1000));

const units = computed(() => [
  { label: "Days", value: days.value },
  { label: "Hours", value: hours.value },
  { label: "Mins", value: minutes.value },
  { label: "Secs", value: seconds.value },
]);

const pad = (value) => String(value).padStart(2, "0");

const startTimer = () => {
  stopTimer();
  now.value = Date.now();
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
};

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

onMounted(startTimer);
onUnmounted(stopTimer);
watch(() => props.date, startTimer);
</script>