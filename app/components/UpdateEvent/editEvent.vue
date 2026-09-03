<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-2xl rounded bg-white p-6">
      <h3 class="mb-4 text-lg font-medium">Edit Event</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <input
          v-model="editForm.title"
          placeholder="Title"
          class="border p-2"
        />
        <input v-model="editForm.date" type="date" class="border p-2" />
        <input
          v-model="editForm.location"
          placeholder="Location"
          class="border p-2"
        />
        <input
          v-model.number="editForm.regular"
          placeholder="Regular price"
          class="border p-2"
        />
        <input
          v-model.number="editForm.vip"
          placeholder="VIP price"
          class="border p-2"
        />
        <input
          v-model.number="editForm.vvip"
          placeholder="VVIP price"
          class="border p-2"
        />
        <select v-model="editForm.status" class="border p-2">
          <option value="upcoming">📅 Upcoming</option>
          <option value="ongoing">🔴 Ongoing</option>
          <option value="completed">✅ Completed</option>
          <option value="cancelled">❌ Cancelled</option>
        </select>
        <select v-model="editForm.eventType" class="border p-2">
          <option value="other">Select Event Type</option>
          <option value="Entertainment">🎵 Entertainment</option>
          <option value="Arts & Culture">🛠️ Arts & Culture</option>
          <option value="Tech & Business">💻 Tech & Business</option>
          <option value="other">📌 Other</option>
        </select>
        <textarea
          v-model="editForm.description"
          placeholder="Description"
          class="col-span-2 border p-2"
        ></textarea>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <button @click="closeEdit" class="rounded border px-4 py-2">
          Cancel
        </button>
        <button
          @click="submitUpdate"
          class="rounded bg-[#9c4e8b] px-4 py-2 text-white"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  editingEvent: { type: [String, Number], default: null },
  editForm: { type: Object, default: null },
});
const emit = defineEmits(["close", "save"]);
const localEditor = updateEvent();
const editForm = props.editForm || localEditor.editForm;
const closeEdit = () =>
  props.editForm ? emit("close") : localEditor.closeEdit();
const submitUpdate = () =>
  props.editForm ? emit("save") : localEditor.submitUpdate();
</script>
