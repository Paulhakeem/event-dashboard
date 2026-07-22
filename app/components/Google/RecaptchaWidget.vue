<template>
  <div class="mt-4">
    <div ref="widgetContainer" class="flex justify-center"></div>
    <p v-if="error" class="text-red-500 text-xs mt-1 text-center">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const config = useRuntimeConfig();
const siteKey = config.public.recaptchaSiteKey;

const widgetContainer = ref(null);
const error = ref("");
let widgetId = null;

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
  if (window.grecaptcha && widgetId !== null) {
    try {
      window.grecaptcha.remove(widgetId);
    } catch (_) {}
  }
});
</script>
