
export const orgCreateEvent = () => {
  const { token } = useAuth();
const config = useRuntimeConfig()
  const form = reactive({
    title: "",
    description: "",
    date: "",
    location: "",
    eventType: "other",
    regular: "",
    vip: "",
    vvip: "",
    TicketQuantity: 0,
    status: "upcoming",
    image: null,
  });

  const isLoading = ref(false);
  const previewImage = ref(null);
  const file = ref(null);
  const freeEntry = ref(false);
  const customTickets = ref([]);

  const addTicketType = () => {
    customTickets.value.push({ name: "", price: 0 });
  };

  const removeTicketType = (index) => {
    customTickets.value.splice(index, 1);
  };

  const toggleFreeEntry = () => {
    freeEntry.value = !freeEntry.value;
    if (freeEntry.value) {
      customTickets.value.forEach(t => t.price = 0);
    }
  };

  const clearForm = () => {
    Object.assign(form, {
      title: "",
      description: "",
      date: "",
      location: "",
      eventType: "other",
      regular: "",
      vip: "",
      vvip: "",
      TicketQuantity: 0,
      status: "upcoming",
    });
    freeEntry.value = false;
    customTickets.value = [];
    previewImage.value = null;
    file.value = null;
  };

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      file.value = selectedFile;
      previewImage.value = URL.createObjectURL(selectedFile);
    }
  };

  const submitEvent = async () => {
    try {
      isLoading.value = true;
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("location", form.location);
      formData.append("eventType", form.eventType);
      formData.append("regular", form.regular ?? 0);
      formData.append("vip", form.vip ?? 0);
      formData.append("vvip", form.vvip ?? 0);
      formData.append("customTickets", JSON.stringify(customTickets.value));
      formData.append("TicketQuantity", form.TicketQuantity);
      formData.append("status", form.status);
      if (file.value) {
        formData.append("image", file.value);
      }

      const response = await $fetch(`${config.public.organiserCreateEventApi}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token._value}`,
        },
        body: formData,
      });

      alert("✅ " + response.message);
      clearForm();
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
    clearForm,
    addTicketType,
    removeTicketType,
    onFileChange,
    toggleFreeEntry,
    submitEvent,
  };
};
