<template>
  <!-- Chat Icon -->
  <div class="fixed bottom-5 right-5 cursor-pointer z-50" @click="toggleChat">
    <div class="relative">
      <Icon
        name="mdi:chat"
        class="text-4xl text-[#16c851] drop-shadow-lg transition-transform duration-300 hover:scale-110"
      />
      <!-- Notification Badge -->
      <span
        v-if="showBadge"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
      >
        1
      </span>
    </div>
  </div>

  <!-- Chat Window -->
  <transition name="fade-scale">
    <div
      v-if="isOpen"
      class="fixed bottom-20 right-5 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50"
    >
      <!-- Header -->
      <div
        class="bg-linear-to-r from-[#16c851] to-[#0ea44f] text-white p-3 font-semibold text-lg flex items-center justify-between"
      >
        <span class="flex items-center">
          <Icon name="mdi:robot" class="mr-2" />
          Velora Chatbot
        </span>
        <button @click="closeChat">
          <Icon name="mdi:close" class="text-xl opacity-80 hover:opacity-100" />
        </button>
      </div>

      <!-- Body -->
      <div
        ref="chatBody"
        class="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50"
      >
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex"
          :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="px-3 py-2 rounded-lg max-w-xs shadow-sm text-sm"
            :class="
              msg.sender === 'user'
                ? 'bg-[#9d4e8a] text-white'
                : 'bg-gray-200 text-gray-800'
            "
          >
            <p class="text-lg font-semibold text-[#16c851]">{{ msg.sender === "user" ? "You " : "Bot " }}</p>
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex p-3 border-t bg-white">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#16c851]"
        />
        <button
          @click="sendMessage"
          class="ml-2 px-4 py-2 bg-[#9d4e8a] text-white rounded-lg hover:bg-[#7c3f6f]"
        >
          Send
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
const {
  isOpen,
  showBadge,
  newMessage,
  chatBody,
  messages,
  toggleChat,
  closeChat,
  sendMessage,
} = useChatBot();
</script>

<style>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
