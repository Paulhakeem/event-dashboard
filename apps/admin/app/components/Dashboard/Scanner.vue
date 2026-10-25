<template>
  <section class="space-y-5">
    <header
      class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-start gap-3">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9c4e8b]/10 text-[#9c4e8b]"
        >
          <Icon name="material-symbols:qr-code-scanner-rounded" class="text-2xl" />
        </span>
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c4e8b]"
          >
            Entry validation
          </p>
          <h1 class="mt-1 text-xl font-bold text-gray-900">Scan ticket QR</h1>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Scan each ticket once to admit the holder. A ticket is marked used
            immediately and cannot be scanned again.
          </p>
        </div>
      </div>
      <span
        class="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
        :class="
          scanning
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-gray-100 text-gray-600'
        "
      >
        <span
          class="h-2 w-2 rounded-full"
          :class="scanning ? 'animate-pulse bg-emerald-500' : 'bg-gray-400'"
        />
        {{ scanning ? "Camera live" : "Camera stopped" }}
      </span>
    </header>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <section class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-semibold text-gray-900">Camera scanner</h2>
            <p class="mt-1 text-sm text-gray-500">
              {{
                scanning
                  ? "Point the camera at the ticket QR code."
                  : "Start the camera, then hold the ticket QR inside the frame."
              }}
            </p>
          </div>
          <Icon
            name="material-symbols:camera-outline-rounded"
            class="shrink-0 text-2xl text-gray-300"
          />
        </div>

        <div
          class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-900"
        >
          <div
            id="ticket-qr-reader"
            class="mx-auto min-h-64 w-full max-w-md [&_video]:rounded-xl"
          />
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-[#9c4e8b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7c3a6d] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="starting || scanning || processing"
            @click="startScanner"
          >
            <Icon
              :name="
                starting
                  ? 'svg-spinners:90-ring-with-bg'
                  : 'material-symbols:qr-code-scanner-rounded'
              "
              :class="{ 'animate-spin': starting }"
            />
            {{ starting ? "Starting..." : "Start camera" }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!scanning"
            @click="stopScanner"
          >
            Stop camera
          </button>
        </div>

        <p
          v-if="cameraError"
          role="alert"
          class="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
        >
          {{ cameraError }}
        </p>
        <p class="mt-3 text-xs text-gray-400">
          Camera access requires HTTPS (or localhost) and permission in the
          browser.
        </p>

        <div class="mt-5 border-t border-gray-100 pt-5">
          <h3 class="flex items-center gap-2 font-semibold text-gray-900">
            <Icon name="material-symbols:keyboard-rounded" class="text-lg text-gray-400" />
            Manual entry
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            If the camera cannot be used, paste or type the ticket code.
          </p>
          <form class="mt-3 flex flex-col gap-2 sm:flex-row" @submit.prevent="validateCode(manualCode)">
            <label for="ticket-code-input" class="sr-only">Ticket code</label>
            <input
              id="ticket-code-input"
              v-model="manualCode"
              type="text"
              autocomplete="off"
              autocapitalize="characters"
              spellcheck="false"
              placeholder="TKT-XXXXXXXXXXXXXXXXXXXX"
              class="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 font-mono text-sm text-gray-900 outline-none transition focus:border-[#9c4e8b] focus:ring-2 focus:ring-[#9c4e8b]/15 disabled:bg-gray-50"
              :disabled="processing"
            />
            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="processing || !manualCode.trim()"
            >
              <Icon name="material-symbols:check-circle-rounded" />
              Validate
            </button>
          </form>
        </div>
      </section>

      <section
        class="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
        aria-live="polite"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-semibold text-gray-900">Validation result</h2>
            <p class="mt-1 text-sm text-gray-500">
              The latest scan result appears here.
            </p>
          </div>
          <Icon
            name="material-symbols:history-rounded"
            class="shrink-0 text-2xl text-gray-300"
          />
        </div>

        <div
          class="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border px-5 py-10 text-center"
          :class="resultTheme.panel"
        >
          <span
            class="flex h-16 w-16 items-center justify-center rounded-full"
            :class="resultTheme.badge"
          >
            <Icon
              :name="resultTheme.icon"
              class="text-4xl"
              :class="{ 'animate-spin': processing }"
            />
          </span>
          <h3 class="mt-4 text-lg font-bold" :class="resultTheme.titleClass">
            {{ resultTheme.heading }}
          </h3>
          <p class="mt-1 max-w-sm text-sm" :class="resultTheme.messageClass">
            {{ resultTheme.message }}
          </p>

          <p
            v-if="result.code"
            class="mt-3 max-w-full break-all rounded-lg bg-white/70 px-3 py-1.5 font-mono text-xs text-gray-600"
          >
            {{ result.code }}
          </p>

          <dl
            v-if="result.ticket"
            class="mt-5 grid w-full max-w-sm grid-cols-1 gap-2 rounded-xl border border-emerald-200 bg-white p-3 text-left text-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Holder</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ result.ticket.userName || "—" }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Event</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ result.ticket.eventName || "—" }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Ticket type</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ result.ticket.ticketType || "—" }}
              </dd>
            </div>
            <div class="flex items-start justify-between gap-3">
              <dt class="text-gray-500">Checked in</dt>
              <dd class="text-right font-semibold text-gray-900">
                {{ formatDateTime(result.ticket.usedAt) }}
              </dd>
            </div>
          </dl>

          <button
            v-if="result.status !== 'idle' && result.status !== 'checking'"
            type="button"
            class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#9c4e8b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7c3a6d] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="processing"
            @click="scanNext"
          >
            <Icon name="material-symbols:qr-code-scanner-rounded" />
            Scan next ticket
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
const { token } = useAuth();

const READER_ID = "ticket-qr-reader";
const DUPLICATE_WINDOW_MS = 3000;

const scanner = ref(null);
const starting = ref(false);
const scanning = ref(false);
const processing = ref(false);
const cameraError = ref("");
const manualCode = ref("");
const lastCode = ref("");
const lastScanAt = ref(0);
const result = ref({
  status: "idle",
  code: "",
  ticket: null,
});

const resultThemes = {
  idle: {
    icon: "material-symbols:qr-code-scanner-rounded",
    panel: "border-gray-200 bg-gray-50",
    badge: "bg-white text-gray-400",
    titleClass: "text-gray-800",
    messageClass: "text-gray-500",
    heading: "Ready to scan",
    copy: "Start the camera or enter a ticket code manually.",
  },
  checking: {
    icon: "svg-spinners:90-ring-with-bg",
    panel: "border-amber-200 bg-amber-50",
    badge: "bg-white text-amber-600",
    titleClass: "text-amber-900",
    messageClass: "text-amber-700",
    heading: "Checking ticket",
    copy: "Verifying the ticket with the server...",
  },
  success: {
    icon: "material-symbols:check-circle-rounded",
    panel: "border-emerald-200 bg-emerald-50",
    badge: "bg-white text-emerald-600",
    titleClass: "text-emerald-900",
    messageClass: "text-emerald-700",
    heading: "Entry allowed",
    copy: "Ticket is valid. The holder may enter.",
  },
  used: {
    icon: "material-symbols:error-outline-rounded",
    panel: "border-amber-200 bg-amber-50",
    badge: "bg-white text-amber-600",
    titleClass: "text-amber-900",
    messageClass: "text-amber-700",
    heading: "Ticket already used",
    copy: "This ticket has already been scanned. Do not allow entry.",
  },
  invalid: {
    icon: "material-symbols:cancel-outline-rounded",
    panel: "border-red-200 bg-red-50",
    badge: "bg-white text-red-600",
    titleClass: "text-red-900",
    messageClass: "text-red-700",
    heading: "Invalid ticket",
    copy: "No ticket matches this code.",
  },
  expired: {
    icon: "material-symbols:event-busy-rounded",
    panel: "border-red-200 bg-red-50",
    badge: "bg-white text-red-600",
    titleClass: "text-red-900",
    messageClass: "text-red-700",
    heading: "Event has ended",
    copy: "This event has ended, so the ticket cannot be used.",
  },
  inactive: {
    icon: "material-symbols:block",
    panel: "border-amber-200 bg-amber-50",
    badge: "bg-white text-amber-600",
    titleClass: "text-amber-900",
    messageClass: "text-amber-700",
    heading: "Ticket not active",
    copy: "This ticket is inactive and cannot be used for entry.",
  },
  error: {
    icon: "material-symbols:warning-rounded",
    panel: "border-red-200 bg-red-50",
    badge: "bg-white text-red-600",
    titleClass: "text-red-900",
    messageClass: "text-red-700",
    heading: "Validation failed",
    copy: "The ticket could not be checked. Try again.",
  },
};

const resultTheme = computed(() => {
  const theme = resultThemes[result.value.status] || resultThemes.idle;
  return {
    ...theme,
    message: result.value.message || theme.copy,
  };
});

const getErrorMessage = (error, fallback) =>
  error?.data?.statusMessage ||
  error?.data?.message ||
  error?.statusMessage ||
  error?.message ||
  fallback;

const classifyError = (message, statusCode) => {
  const text = String(message || "").toLowerCase();
  if (statusCode === 404 || text.includes("invalid ticket")) return "invalid";
  if (text.includes("already used")) return "used";
  if (text.includes("expired") || text.includes("has ended")) return "expired";
  if (text.includes("not active") || text.includes("inactive")) {
    return "inactive";
  }
  return "error";
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const resetResult = () => {
  result.value = { status: "idle", code: "", ticket: null };
};

const releaseScanner = async (instance) => {
  if (!instance) return;
  try {
    if (instance.isScanning) await instance.stop();
    instance.clear();
  } catch (error) {
    console.warn("Failed to stop the QR scanner:", error);
  }
};

const stopScanner = async () => {
  const instance = scanner.value;
  scanner.value = null;
  scanning.value = false;
  await releaseScanner(instance);
};

const describeCameraError = (error) => {
  const name = error?.name || "";
  const message = String(error?.message || "");
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Camera permission was denied. Allow camera access in the browser and try again, or use manual entry.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No camera was found on this device. Use manual entry instead.";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "The camera is already in use by another app. Close it and try again.";
  }
  if (message.toLowerCase().includes("secure")) {
    return "Camera access requires HTTPS (or localhost). Use manual entry instead.";
  }
  return message || "Unable to start the camera. Use manual entry instead.";
};

const startScanner = async () => {
  if (!import.meta.client) return;
  if (starting.value || scanning.value || processing.value) return;

  starting.value = true;
  cameraError.value = "";
  resetResult();
  await stopScanner();

  try {
    const { Html5Qrcode } = await import("html5-qrcode");
    await nextTick();
    if (!starting.value) return;

    const instance = new Html5Qrcode(READER_ID, { verbose: false });
    scanner.value = instance;
    await instance.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: (width, height) => {
          const size = Math.floor(Math.min(width, height) * 0.7);
          return { width: size, height: size };
        },
        aspectRatio: 1,
      },
      (decodedText) => handleScan(decodedText),
      () => {},
    );

    if (!starting.value || scanner.value !== instance) {
      scanner.value = null;
      await releaseScanner(instance);
      return;
    }

    scanning.value = true;
  } catch (error) {
    scanning.value = false;
    const instance = scanner.value;
    scanner.value = null;
    await releaseScanner(instance);
    cameraError.value = describeCameraError(error);
  } finally {
    starting.value = false;
  }
};

const handleScan = (decodedText) => {
  if (processing.value) return;
  const code = String(decodedText || "").trim();
  if (!code) return;

  const now = Date.now();
  if (code === lastCode.value && now - lastScanAt.value < DUPLICATE_WINDOW_MS) {
    return;
  }
  lastCode.value = code;
  lastScanAt.value = now;
  validateCode(code);
};

const validateCode = async (rawCode) => {
  const code = String(rawCode || "").trim();
  if (!code || processing.value) return;

  if (!token.value) {
    result.value = {
      status: "error",
      code,
      ticket: null,
      message: "Your session has expired. Sign in again and retry.",
    };
    return;
  }

  starting.value = false;
  processing.value = true;
  manualCode.value = "";
  result.value = { status: "checking", code, ticket: null };

  await stopScanner();

  try {
    const response = await $fetch("/api/tickets/validate", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { ticketCode: code },
    });
    result.value = {
      status: "success",
      code: response?.ticket?.ticketCode || code,
      ticket: response?.ticket || null,
      message: response?.message || "Ticket is valid. Entry allowed.",
    };
  } catch (error) {
    const message = getErrorMessage(error, "Could not validate this ticket.");
    const statusCode =
      error?.statusCode || error?.response?.status || error?.status;
    const status = classifyError(message, statusCode);
    result.value = { status, code, ticket: null, message };
  } finally {
    processing.value = false;
  }
};

const scanNext = () => {
  manualCode.value = "";
  startScanner();
};

onBeforeUnmount(() => {
  stopScanner();
});
</script>
