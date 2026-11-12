export default function useOrganiserTicketScanner() {
  const { token } = useAuth();
  const READER_ID = "organiser-ticket-qr-reader";
  const DUPLICATE_WINDOW_MS = 3000;

  const events = ref([]);
  const selectedEventId = ref("");
  const loadingEvents = ref(true);
  const eventsError = ref("");
  const starting = ref(false);
  const scanning = ref(false);
  const processing = ref(false);
  const cameraError = ref("");
  const manualCode = ref("");
  const scanner = ref(null);
  const lastCode = ref("");
  const lastScanAt = ref(0);
  const result = ref({ status: "idle", code: "", ticket: null, message: "" });

  const selectedEvent = computed(
    () => events.value.find((item) => item.eventId === selectedEventId.value) || null,
  );
  const resultThemes = {
    idle: {
      heading: "Ready to scan",
      message: "Choose one of your events, then scan or enter a ticket code.",
      icon: "material-symbols:qr-code-scanner-rounded",
      theme:
        "border-gray-200 bg-gray-50 text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
    },
    checking: {
      heading: "Checking ticket",
      message: "Verifying the ticket with the server...",
      icon: "svg-spinners:90-ring-with-bg",
      theme:
        "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
    },
    success: {
      heading: "Entry allowed",
      message: "Ticket is valid. The holder may enter.",
      icon: "material-symbols:check-circle-rounded",
      theme:
        "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
    },
    used: {
      heading: "Ticket already used",
      message: "This ticket has already been scanned.",
      icon: "material-symbols:error-outline-rounded",
      theme:
        "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
    },
    invalid: {
      heading: "Invalid ticket",
      message: "No ticket for this event matches the code.",
      icon: "material-symbols:cancel-outline-rounded",
      theme:
        "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
    },
    inactive: {
      heading: "Ticket not active",
      message: "This ticket cannot be used for entry.",
      icon: "material-symbols:block",
      theme:
        "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
    },
    expired: {
      heading: "Event has ended",
      message: "This event has ended, so the ticket cannot be used.",
      icon: "material-symbols:event-busy-rounded",
      theme:
        "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
    },
    error: {
      heading: "Validation failed",
      message: "The ticket could not be checked. Try again.",
      icon: "material-symbols:warning-rounded",
      theme:
        "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
    },
  };
  const resultTheme = computed(() => {
    const theme = resultThemes[result.value.status] || resultThemes.idle;
    return { ...theme, message: result.value.message || theme.message };
  });

  async function loadEvents() {
    loadingEvents.value = true;
    eventsError.value = "";
    try {
      const response = await $fetch("/api/organiser/tickets", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      events.value = response.events || [];
      if (!events.value.some((item) => item.eventId === selectedEventId.value)) {
        selectedEventId.value = events.value[0]?.eventId || "";
      }
    } catch (error) {
      eventsError.value =
        error?.data?.statusMessage ||
        error?.data?.message ||
        error?.message ||
        "Failed to load your events.";
    } finally {
      loadingEvents.value = false;
    }
  }

  function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
  }

  async function releaseScanner(instance) {
    if (!instance) return;
    try {
      if (instance.isScanning) await instance.stop();
      instance.clear();
    } catch (error) {
      console.warn("Failed to stop the QR scanner:", error);
    }
  }

  async function stopScanner() {
    const instance = scanner.value;
    scanner.value = null;
    scanning.value = false;
    await releaseScanner(instance);
  }

  function describeCameraError(error) {
    if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
      return "Camera permission was denied. Allow camera access or use manual entry.";
    }
    if (error?.name === "NotFoundError" || error?.name === "DevicesNotFoundError") {
      return "No camera was found. Use manual entry instead.";
    }
    if (String(error?.message || "").toLowerCase().includes("secure")) {
      return "Camera access requires HTTPS (or localhost). Use manual entry instead.";
    }
    return error?.message || "Unable to start the camera. Use manual entry instead.";
  }

  async function startScanner() {
    if (!import.meta.client || !selectedEventId.value) return;
    if (starting.value || scanning.value || processing.value) return;

    starting.value = true;
    cameraError.value = "";
    result.value = { status: "idle", code: "", ticket: null, message: "" };
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
  }

  function handleScan(decodedText) {
    if (processing.value) return;
    const code = String(decodedText || "").trim();
    const now = Date.now();
    if (!code || (code === lastCode.value && now - lastScanAt.value < DUPLICATE_WINDOW_MS)) {
      return;
    }
    lastCode.value = code;
    lastScanAt.value = now;
    validateCode(code);
  }

  async function validateCode(rawCode) {
    const ticketCode = String(rawCode || "").trim();
    if (!ticketCode || !selectedEventId.value || processing.value) return;
    if (!token.value) {
      result.value = {
        status: "error",
        code: ticketCode,
        message: "Your session has expired. Sign in again and retry.",
      };
      return;
    }

    starting.value = false;
    processing.value = true;
    manualCode.value = "";
    result.value = { status: "checking", code: ticketCode, ticket: null, message: "" };
    await stopScanner();
    try {
      const response = await $fetch("/api/tickets/validate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { ticketCode, eventId: selectedEventId.value },
      });
      result.value = {
        status: "success",
        code: response?.ticket?.ticketCode || ticketCode,
        ticket: response?.ticket || null,
        message: response?.message || "Ticket is valid. Entry allowed.",
      };
      await loadEvents();
    } catch (error) {
      const message =
        error?.data?.statusMessage ||
        error?.data?.message ||
        error?.message ||
        "Could not validate this ticket.";
      const lowered = message.toLowerCase();
      let status = "error";
      if (error?.statusCode === 404 || lowered.includes("invalid ticket")) {
        status = "invalid";
      } else if (lowered.includes("already used")) {
        status = "used";
      } else if (lowered.includes("expired") || lowered.includes("has ended")) {
        status = "expired";
      } else if (lowered.includes("not active") || lowered.includes("inactive")) {
        status = "inactive";
      }
      result.value = { status, code: ticketCode, ticket: null, message };
    } finally {
      processing.value = false;
    }
  }

  function scanNext() {
    manualCode.value = "";
    startScanner();
  }

  onMounted(loadEvents);
  onBeforeUnmount(stopScanner);

  return {
    events,
    selectedEventId,
    selectedEvent,
    loadingEvents,
    eventsError,
    starting,
    scanning,
    processing,
    cameraError,
    manualCode,
    result,
    resultTheme,
    loadEvents,
    startScanner,
    stopScanner,
    validateCode,
    scanNext,
    formatDateTime,
  };
}
