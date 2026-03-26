<template>
  <div>
    <!-- 💬 Floating Chat Button -->
    <button
      @click="toggleChat"
      class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition flex items-center justify-center"
    >
      <!-- Chat Icon (SVG) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.8-3.6A7.5 7.5 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>

    <!-- 💬 Chat Popup -->
    <transition name="fade">
      <div
        v-if="open"
        class="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-green-500 text-white p-4 flex justify-between items-center"
        >
          <div>
            <div class="flex gap-2 items-center">
              <Icon name="mage:robot-fill" class="text-xl" />
              <h3 class="font-bold">Velora AI assistant</h3>
            </div>
            <p class="text-xs opacity-80">Online</p>
          </div>
          <button @click="open = false">✖</button>
        </div>

        <!-- Messages -->
        <div class="p-4 space-y-2 bg-gray-50 max-h-64 overflow-y-auto">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="[
              'p-2 rounded-lg text-sm max-w-[80%]',
              msg.from === 'user'
                ? 'bg-green-500 text-white ml-auto'
                : 'bg-white shadow',
            ]"
          >
            {{ msg.text }}
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 border-t flex gap-2">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            class="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            @click="sendMessage"
            class="bg-green-500 text-white px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();

const open = ref(false);
const message = ref("");
const messages = ref([{ from: "bot", text: "👋 Hi! Looking for an event🤷‍♂️?." }]);

const toggleChat = () => {
  open.value = !open.value;
};

const sendMessage = async () => {
  if (!message.value) return;

  messages.value.push({ from: "user", text: message.value });

  const userMessage = message.value;
  message.value = "";

  try {
    const res = await $fetch(`${config.public.chatbotApi}`, {
      method: "POST",
      body: { message: userMessage },
    });

    const reply = res.choices[0].message.content;

    messages.value.push({ from: "bot", text: reply });
  } catch (err) {
    messages.value.push({ from: "bot", text: "⚠️ Error getting response" });
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
