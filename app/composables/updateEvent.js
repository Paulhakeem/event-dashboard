export default function updateEvent(eventsRef = null) {
  const config = useRuntimeConfig()
  const editingEvent = ref(false);
  const events = eventsRef || ref([]);
  const editForm = ref({
    image: "",
    title: "",
    description: "",
    date: "",
    location: "",
    TicketQuantity: 0,
    customTickets: [],
    status: "upcoming",
    eventType: "other",
  });

  const removeEvent = async (id) => {
     if (!confirm("Are you sure you want to delete this event?")) return;
    const res = await $fetch(`${config.public.deleteEvent}/${id}`, {
      method: "DELETE",
    });
    if (res && res.success) {
      events.value = events.value.filter((e) => e._id !== id);
    } else {
      window.alert(res.statusMessage || "Delete failed");
    }
  };

  const addTicket = () => {
    editForm.value.customTickets.push({ name: "", price: 0 });
  };

  const removeTicket = (index) => {
    editForm.value.customTickets.splice(index, 1);
  };

  const openEdit = (ev) => {
    editingEvent.value = ev._id;
    editForm.value = {
      image: ev.image || "",
      title: ev.title || "",
      description: ev.description || "",
      date: ev.date ? new Date(ev.date).toISOString().slice(0, 10) : "",
      location: ev.location || "",
      TicketQuantity: ev.TicketQuantity || 0,
      customTickets: ev.customTickets
        ? ev.customTickets.map((t) => ({ name: t.name, price: t.price }))
        : [],
      status: ev.status || "upcoming",
      eventType: ev.eventType || "other",
    };
  };

  const closeEdit = () => {
    editingEvent.value = null;
  };

  const submitUpdate = async () => {
    try {
      const res = await $fetch(`${config.public.updateEvent}/${editingEvent.value}`, {
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
    addTicket,
    removeTicket,
  };
}
