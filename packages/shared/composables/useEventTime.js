import { computed, ref } from "vue";

const parseTime = (value) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value || "").trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return { hours, minutes };
};

export function to12Hour(value) {
  const parsed = parseTime(value);
  if (!parsed) return { time: "", period: "AM" };

  const period = parsed.hours >= 12 ? "PM" : "AM";
  const hour = parsed.hours % 12 || 12;

  return {
    time: `${String(hour).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")}`,
    period,
  };
}

export function to24Hour(time, period) {
  const parsed = parseTime(time);
  if (!parsed) return "";

  let hours = parsed.hours;
  if (String(period).toUpperCase() === "PM" && hours < 12) hours += 12;
  if (String(period).toUpperCase() === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")}`;
}

export function formatEventTime(value) {
  const parsed = parseTime(value);
  if (!parsed) return "";

  const period = parsed.hours >= 12 ? "PM" : "AM";
  const hour = parsed.hours % 12 || 12;

  return `${hour}:${String(parsed.minutes).padStart(2, "0")} ${period}`;
}

export function formatEventTimeRange(start, end) {
  const startLabel = formatEventTime(start);
  const endLabel = formatEventTime(end);
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  return startLabel || endLabel || "";
}

export function useTimeField(getValue, setValue) {
  const override = ref(null);

  const time = computed({
    get: () => to12Hour(getValue()).time,
    set: (value) => {
      const period = override.value || to12Hour(getValue()).period;
      setValue(value ? to24Hour(value, period) : "");
      override.value = null;
    },
  });

  const period = computed({
    get: () => override.value || to12Hour(getValue()).period,
    set: (value) => {
      override.value = String(value).toUpperCase();
      const currentTime = to12Hour(getValue()).time;
      setValue(currentTime ? to24Hour(currentTime, override.value) : "");
    },
  });

  const reset = () => {
    override.value = null;
  };

  return { time, period, reset };
}
