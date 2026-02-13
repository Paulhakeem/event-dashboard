export const orgCreateEvent = () => {
  const {} = useAuth();

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

  //   Handle image selection and preview
  const handleImageChange = (event) => {
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
      formData.append("regular", form.regular);
      formData.append("vip", form.vip);
      formData.append("vvip", form.vvip);
      formData.append("TicketQuantity", form.TicketQuantity);
      formData.append("status", form.status);
      if (file.value) {
        formData.append("image", file.value);
      }
      // optional ticket prices (only append if defined)
      if (
        form.regular !== "" &&
        form.regular !== null &&
        form.regular !== undefined
      )
        formData.append("regular", form.regular);
      if (form.vip !== "" && form.vip !== null && form.vip !== undefined)
        formData.append("vip", form.vip);
      if (form.vvip !== "" && form.vvip !== null && form.vvip !== undefined)
        formData.append("vvip", form.vvip);

      const response = await $fetch("/api/organiser/addevent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: formData,
      });

      alert("Event created successfully!");
      // Reset form
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
      previewImage.value = null;
      file.value = null;
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
};
