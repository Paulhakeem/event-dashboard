export default function updateEvent(eventsRef = null) {
  const editingEvent = ref(false);
  const events = eventsRef || ref([]);
  const editForm = ref({
    image: "",
    title: "",
    description: "",
    date: "",
    location: "",
    TicketQuantity: 0,
    regular: 0,
    vip: 0,
    vvip: 0,
    status: "upcoming",
    eventType: "other",
  });

  const removeEvent = async (id) => {
    const res = await $fetch(`/api/events/${id}`, {
      method: "DELETE",
    });
    if (res && res.success) {
      events.value = events.value.filter((e) => e._id !== id);
    } else {
      window.alert(res.statusMessage || "Delete failed");
    }
  };

  const openEdit = (ev) => {
    editingEvent.value = ev._id;
    editForm.value = {
      image: ev.image || "",
      title: ev.title || "",
      description: ev.description || "",
      date: ev.date ? new Date(ev.date).toISOString().substr(0, 10) : "",
      location: ev.location || "",
      TicketQuantity: ev.TicketQuantity || 0,
      regular: ev.regular || 0,
      vip: ev.vip || 0,
      vvip: ev.vvip || 0,
      status: ev.status || "upcoming",
      eventType: ev.eventType || "other",
    };
  };

  const closeEdit = () => {
    editingEvent.value = null;
  };

  const submitUpdate = async () => {
    try {
      const res = await $fetch(`/api/events/${editingEvent.value}`, {
        method: "PATCH",
        body: { ...editForm.value },
      });
      if (res && res.updatedEvent) {
        const idx = events.value.findIndex(
          (e) => e._id === res.updatedEvent._id
        );
        if (idx !== -1) events.value[idx] = res.updatedEvent;
        closeEdit();
      } else {
        window.alert(res.statusMessage || "Update failed");
      }
    } catch (err) {
      window.alert(err.message || err);
    }
  };

  return {
    editingEvent,
    editForm,
    removeEvent,
    openEdit,
    closeEdit,
    submitUpdate,
  };
}
