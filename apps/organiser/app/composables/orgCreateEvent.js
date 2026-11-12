export const orgCreateEvent = () => {
  const { token } = useAuth();
  const config = useRuntimeConfig();
  const form = reactive({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    eventType: "other",
    regular: "",
    vip: "",
    vvip: "",
    TicketQuantity: 0,
    maxTicketsPerUser: null,
    status: "upcoming",
    image: null,
  });

  const isLoading = ref(false);
  const previewImage = ref(null);
  const file = ref(null);
  const freeEntry = ref(false);
  const customTickets = ref([]);

  const addTicketType = () => {
    customTickets.value.push({ name: "", price: 0, quantity: 0 });
  };

  const removeTicketType = (index) => {
    customTickets.value.splice(index, 1);
  };

  const formatPreviewDate = (value) => {
    if (!value) return "";
    return new Date(`${value}T00:00:00`).toDateString();
  };

  const scheduleLabel = computed(() => {
    const start = formatPreviewDate(form.startDate);
    const end = formatPreviewDate(form.endDate);
    let dateLabel = "Date not set";

    if (start && end) {
      dateLabel = start === end ? start : `${start} - ${end}`;
    } else if (start) {
      dateLabel = start;
    } else if (end) {
      dateLabel = end;
    }

    const timeLabel =
      form.startTime && form.endTime
        ? `${form.startTime} - ${form.endTime}`
        : form.startTime || form.endTime || "";

    return timeLabel ? `${dateLabel} · ${timeLabel}` : dateLabel;
  });

  const toggleFreeEntry = () => {
    freeEntry.value = !freeEntry.value;
    if (freeEntry.value) {
      customTickets.value.forEach((t) => (t.price = 0));
    }
  };

  const clearForm = () => {
    Object.assign(form, {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      location: "",
      eventType: "other",
      regular: "",
      vip: "",
      vvip: "",
      TicketQuantity: 0,
      maxTicketsPerUser: null,
      status: "upcoming",
    });
    freeEntry.value = false;
    customTickets.value = [];
    previewImage.value = null;
    file.value = null;
  };

  const shareUrl = ref("");
  const showShareModal = ref(false);

  const closeShareModal = () => {
    showShareModal.value = false;
    shareUrl.value = "";
    clearForm();
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl.value);
      alert("Link copied to clipboard");
    } catch (err) {
      alert("Unable to copy link");
    }
  };

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      file.value = selectedFile;
      previewImage.value = URL.createObjectURL(selectedFile);
    }
  };

  const submitEvent = async () => {
    if (!file.value) {
      alert("Please select an event image");
      return;
    }
    if (!form.startDate && !form.endDate) {
      alert("Please provide a start date or an end date");
      return;
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      alert("End date cannot be before the start date");
      return;
    }

    try {
      isLoading.value = true;
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.startDate || form.endDate);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("startTime", form.startTime);
      formData.append("endTime", form.endTime);
      formData.append("location", form.location);
      formData.append("eventType", form.eventType);
      formData.append("regular", form.regular ?? 0);
      formData.append("vip", form.vip ?? 0);
      formData.append("vvip", form.vvip ?? 0);
      formData.append("customTickets", JSON.stringify(customTickets.value));
      formData.append("freeEntry", String(freeEntry.value));
      formData.append("TicketQuantity", form.TicketQuantity);
      if (form.maxTicketsPerUser != null && form.maxTicketsPerUser !== "") {
        formData.append("maxTicketsPerUser", form.maxTicketsPerUser);
      }
      formData.append("status", form.status);
      if (file.value) {
        formData.append("image", file.value);
      }

      const response = await $fetch(
        `${config.public.organiserCreateEventApi}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token._value}`,
          },
          body: formData,
        },
      );

      if (response?.shareUrl) {
        shareUrl.value = response.shareUrl;
        showShareModal.value = true;
      } else {
        alert("✅ " + response.message);
        clearForm();
      }
    } catch (err) {
      const message =
        err.res?.statusMessage ||
        err.message ||
        "Something went wrong while creating the event.  Please try again.";
      alert("❌ " + message);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    isLoading,
    previewImage,
    freeEntry,
    customTickets,
    scheduleLabel,
    shareUrl,
    showShareModal,
    clearForm,
    addTicketType,
    removeTicketType,
    onFileChange,
    toggleFreeEntry,
    closeShareModal,
    copyShareUrl,
    submitEvent,
  };
};
