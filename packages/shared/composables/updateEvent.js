import { ref } from "vue";
import { useRuntimeConfig } from "#imports";
import { $fetch } from "ofetch";
import { useAuth } from "./useAuth.js";

export default function updateEvent(eventsRef = null) {
  const config = useRuntimeConfig()
  const { token } = useAuth();
  const editingEvent = ref(false);
  const events = eventsRef || ref([]);
  const editForm = ref({
    image: "",
    title: "",
    description: "",
    date: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    TicketQuantity: 0,
    maxTicketsPerUser: null,
    customTickets: [],
    freeEntry: false,
    status: "upcoming",
    eventType: "other",
  });

  const toDateInput = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
  };

  const removeEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await $fetch(`${config.public.deleteEvent}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      if (res && res.success) {
        events.value = events.value.filter((e) => e._id !== id);
      } else {
        window.alert(res?.statusMessage || "Delete failed");
      }
    } catch (err) {
      window.alert(
        err?.data?.statusMessage || err?.message || "Unable to delete event",
      );
    }
  };

  const addTicket = () => {
    editForm.value.customTickets.push({ name: "", price: 0, quantity: 0 });
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
      date: toDateInput(ev.date),
      startDate: toDateInput(ev.startDate),
      endDate: toDateInput(ev.endDate),
      startTime: ev.startTime || "",
      endTime: ev.endTime || "",
      location: ev.location || "",
      TicketQuantity: ev.TicketQuantity || 0,
      maxTicketsPerUser: ev.maxTicketsPerUser ?? null,
      customTickets: ev.customTickets
        ? ev.customTickets.map((t) => ({
            name: t.name,
            price: t.price,
            quantity: t.quantity ?? 0,
            availableQuantity: t.availableQuantity ?? t.quantity ?? 0,
          }))
        : [],
      freeEntry: Boolean(ev.freeEntry),
      status: ev.status || "upcoming",
      eventType: ev.eventType || "other",
    };
  };

  const closeEdit = () => {
    editingEvent.value = null;
  };

  const submitUpdate = async () => {
    if (
      editForm.value.startDate &&
      editForm.value.endDate &&
      editForm.value.endDate < editForm.value.startDate
    ) {
      window.alert("End date cannot be before the start date");
      return;
    }
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