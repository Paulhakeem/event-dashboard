<template>
  <div ref="container" class="mt-4 w-full min-w-0 overflow-hidden">
    <div class="flex justify-center">
      <div :style="frameStyle">
        <div ref="widgetContainer" :style="widgetStyle"></div>
      </div>
    </div>
    <p v-if="error" class="text-red-500 text-xs mt-1 text-center">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const config = useRuntimeConfig();
const siteKey = config.public.recaptchaSiteKey;

const widgetWidth = 304;
const widgetHeight = 78;
const container = ref(null);
const widgetContainer = ref(null);
const scale = ref(1);
const error = ref("");
let widgetId = null;
let resizeObserver = null;

const frameStyle = computed(() => ({
  width: `${widgetWidth * scale.value}px`,
  height: `${widgetHeight * scale.value}px`,
}));
const widgetStyle = computed(() => ({
  width: `${widgetWidth}px`,
  height: `${widgetHeight}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: "top left",
}));

const resizeWidget = () => {
  const availableWidth = container.value?.clientWidth ?? widgetWidth;
  scale.value = Math.min(1, availableWidth / widgetWidth);
};

const onRecaptchaSuccess = (token) => {
  error.value = "";
  emit("update:modelValue", token);
};

const onRecaptchaExpired = () => {
  emit("update:modelValue", "");
};

const onRecaptchaError = () => {
  error.value = "reCAPTCHA failed to load. Please refresh the page.";
};
const renderWidget = () => {
  if (!window.grecaptcha || !widgetContainer.value) return;

  window.grecaptcha.ready(() => {
    try {
      widgetId = window.grecaptcha.render(widgetContainer.value, {
        sitekey: siteKey,
        callback: onRecaptchaSuccess,
        "expired-callback": onRecaptchaExpired,
        "error-callback": onRecaptchaError,
        theme: "light",
        size: "normal",
      });
    } catch (e) {
      error.value = "reCAPTCHA failed to initialize.";
    }
  });
};

const reset = () => {
  if (window.grecaptcha && widgetId !== null) {
    window.grecaptcha.reset(widgetId);
    emit("update:modelValue", "");
  }
};

defineExpose({ reset });

onMounted(() => {
  resizeObserver = new ResizeObserver(resizeWidget);
  if (container.value) {
    resizeObserver.observe(container.value);
  }
  resizeWidget();

  if (window.grecaptcha) {
    renderWidget();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
  script.async = true;
  script.defer = true;
  script.onload = () => renderWidget();
  script.onerror = () => {
    error.value = "Failed to load reCAPTCHA script.";
  };
  document.head.appendChild(script);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (window.grecaptcha && widgetId !== null) {
    try {
      window.grecaptcha.remove(widgetId);
    } catch (_) {}
  }
});
</script>
