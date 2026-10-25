<template>
  <div>
    <!-- COMPACT (single pill) -->
    <div
      v-if="compact"
      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#13284b]/10 dark:bg-neutral-800 text-[#13284b] dark:text-white text-[11px] font-semibold"
      :title="title"
    >
      <Icon
        :name="finished ? 'mdi:flag-checkered' : 'mdi:timer-outline'"
        class="text-sm"
      />
      <span v-if="finished">{{ finishedLabel }}</span>
      <span v-else-if="expired">{{ expiredLabel }}</span>
      <span v-else class="tabular-nums">
        {{ pad(days) }}d : {{ pad(hours) }}h : {{ pad(minutes) }}m :
        {{ pad(seconds) }}s
      </span>
    </div>

    <!-- FULL (boxes) -->
    <template v-else>
      <div
        v-if="expired"
        class="flex items-center justify-center gap-2 rounded-xl bg-[#13284b]/10 dark:bg-neutral-800 border border-[#13284b]/20 dark:border-neutral-700 py-4"
      >
        <Icon
          :name="finished ? 'mdi:flag-checkered' : 'mdi:play-circle-outline'"
          class="text-xl text-[#13284b] dark:text-white"
        />
        <span class="text-sm font-semibold text-[#13284b] dark:text-white">
          {{ finished ? finishedLabel : expiredLabel }}
        </span>
      </div>
      <div v-else class="grid grid-cols-4 gap-2">
        <div
          v-for="unit in units"
          :key="unit.label"
          class="flex flex-col items-center justify-center rounded-xl bg-[#13284b]/10 dark:bg-neutral-800 border border-[#13284b]/20 dark:border-neutral-700 py-3"
        >
          <span class="text-2xl font-bold text-[#13284b] dark:text-white tabular-nums">
            {{ pad(unit.value) }}
          </span>
          <span class="text-[10px] uppercase tracking-wide text-gray-500 dark:text-neutral-400">
            {{ unit.label }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  date: { type: [String, Date, Number], required: true },
  startTime: { type: String, default: "" },
  endDate: { type: [String, Date, Number], default: null },
  endTime: { type: String, default: "" },
  compact: { type: Boolean, default: false },
  expiredLabel: { type: String, default: "Event started" },
  finishedLabel: { type: String, default: "Event ended" },
});

const now = ref(Date.now());
let timer = null;

const parseTime = (value, fallbackHour, fallbackMinute) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value || ""));
  if (!match) return [fallbackHour, fallbackMinute];
  return [Number(match[1]), Number(match[2])];
};

const start = computed(() => {
  const value = new Date(props.date).getTime();
  if (Number.isNaN(value) || !props.startTime) return value;
  const date = new Date(value);
  const [hours, minutes] = parseTime(props.startTime, 0, 0);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
});

const end = computed(() => {
  const base = props.endDate || props.date;
  const value = new Date(base).getTime();
  if (Number.isNaN(value)) return value;
  const date = new Date(value);
  const [hours, minutes] = parseTime(props.endTime, 23, 59);
  date.setHours(hours, minutes, 59, 999);
  if (date.getTime() <= start.value) date.setDate(date.getDate() + 1);
  return date.getTime();
});

const diff = computed(() => Math.max(0, start.value - now.value));
const expired = computed(() => start.value <= now.value);
const finished = computed(() => end.value <= now.value);

const title = computed(() =>
  finished.value
    ? "Event has ended"
    : expired.value
      ? "Event has started"
      : "Time until the event starts",
);

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
watch(() => [props.date, props.startTime, props.endDate, props.endTime], startTimer);
</script>
