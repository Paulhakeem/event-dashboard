<template>
  <!-- Chat Icon -->
  <!-- Chat Icon -->
  <div ref="chatIcon" class="fixed bottom-5 right-5 cursor-pointer z-50">
    <div class="relative">
      <Icon
        name="mdi:chat"
        class="text-4xl text-[#16c851] drop-shadow-lg transition-transform duration-300 hover:scale-110"
      />
      <!-- Notification Badge -->
      <span
        ref="chatBadge"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
      >
        1
      </span>
    </div>
  </div>

  <!-- Chat Window -->
  <div
    ref="chatWindow"
    class="fixed bottom-20 right-5 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden"
  >
    <!-- Header -->
    <div
      class="bg-linear-to-r from-[#16c851] to-[#0ea44f] text-white p-3 font-semibold text-lg flex items-center justify-between"
    >
      <span class="items-center flex">
        <Icon name="mdi:chat" class="text-lg mr-2" />
        Chatbot</span>
      <button class="text-sm opacity-80 hover:opacity-100">
        <Icon name="mdi:close" class="text-lg" />
      </button>
    </div>

    <!-- Body -->
    <div class="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
      <!-- Incoming message -->
      <div class="flex justify-start">
        <div
          class="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg max-w-xs shadow-sm"
        >
          Welcome! How can I help you?
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex p-3 border-t border-gray-200 bg-white">
      <input
        type="text"
        placeholder="Type a message..."
        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9d4e8a] transition-shadow"
      />
      <button
        class="ml-2 px-4 py-2 bg-[#9d4e8a] text-white rounded-lg shadow-md hover:bg-[#7c3f6f] transition-colors"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
const chatIcon = ref(null);
const chatWindow = ref(null);
const chatBadge = ref(null);

onMounted(() => {
  chatIcon.value = addEventListener("click", () => {
    chatWindow.value.classList.toggle("hidden");
    // Hide badge when chat window is opened
    if (!chatWindow.value.classList.contains("hidden")) {
      chatBadge.value.classList.add("hidden");
    }
  });
});
</script>
