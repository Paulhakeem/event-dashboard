export default function useTicketScanner() {
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

  return {
    starting,
    scanning,
    processing,
    cameraError,
    manualCode,
    result,
    resultTheme,
    startScanner,
    stopScanner,
    validateCode,
    scanNext,
    formatDateTime,
  };
}
