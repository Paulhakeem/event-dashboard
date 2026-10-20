<template>
  <div>
    <!-- Floating Chat Button -->
    <button
      @click="toggleChat"
      :aria-label="open ? 'Close Happitwin Assistant' : 'Open Happitwin Assistant'"
      :aria-expanded="open"
      class="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#13284b] to-[#0b1730] text-amber-300 shadow-xl shadow-[#13284b]/30 ring-1 ring-amber-300/40 transition duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <span
        v-if="!open"
        class="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400"
        aria-hidden="true"
      />
      <Icon
        :name="open ? 'material-symbols:close' : 'material-symbols:forum-outline'"
        class="text-2xl transition group-hover:scale-110"
      />
    </button>

    <!-- Chat Popup -->
    <Transition name="chat">
        <div
          v-if="open"
          class="fixed bottom-24 right-4 z-50 flex h-[min(70vh,32rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:bg-neutral-900 dark:border-neutral-700 shadow-2xl shadow-slate-900/25 dark:shadow-none sm:bottom-24 sm:right-6"
          role="dialog"
          aria-label="Happitwin Assistant chat"
        >
        <!-- Header -->
        <div
          class="relative overflow-hidden bg-gradient-to-r from-[#101d3a] via-[#172b50] to-[#213c35] px-4 py-4 text-white"
        >
          <div
            class="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-amber-300/15 blur-2xl"
            aria-hidden="true"
          />
          <div class="relative flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-[#101d3a] shadow-lg"
              >
                <Icon name="material-symbols:support-agent" class="text-2xl" />
              </span>
              <div class="min-w-0">
                <h3 class="truncate text-sm font-bold tracking-tight">
                  Happitwin Assistant
                </h3>
                <p class="flex items-center gap-1.5 text-[11px] text-white/70">
                  <span
                    class="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  Online · here to help
                </p>
              </div>
            </div>
            <button
              @click="open = false"
              aria-label="Close chat"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Icon name="material-symbols:close" class="text-xl" />
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div
          ref="scrollArea"
          class="flex-1 space-y-3 overflow-y-auto bg-[#f8f7f3] dark:bg-zinc-950 px-4 py-4"
        >
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="flex items-end gap-2"
            :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
          >
            <span
              v-if="msg.from === 'bot'"
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13284b] text-sm text-amber-300"
            >
              <Icon name="material-symbols:support-agent" />
            </span>
            <div
              class="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm dark:shadow-none"
              :class="
                msg.from === 'user'
                  ? 'rounded-br-md bg-[#13284b] text-white'
                  : 'rounded-bl-md border border-slate-200/80 bg-white text-slate-700 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300'
              "
            >
              {{ msg.text }}
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="typing" class="flex items-end gap-2 justify-start">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#13284b] text-sm text-amber-300"
            >
              <Icon name="material-symbols:support-agent" />
            </span>
            <div
              class="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-none"
            >
              <span
                v-for="d in 3"
                :key="d"
                class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                :style="{ animationDelay: `${(d - 1) * 0.15}s` }"
              />
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="border-t border-slate-100 bg-white dark:bg-neutral-900 dark:border-neutral-800 p-3">
          <div class="flex items-end gap-2">
            <input
              v-model="message"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Ask about events, tickets…"
              class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#13284b] focus:bg-white focus:ring-2 focus:ring-[#13284b]/15 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:ring-[#13284b]/30"
            />
            <button
              @click="sendMessage"
              :disabled="!message.trim() || typing"
              aria-label="Send message"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#13284b] to-[#0b1730] text-amber-300 shadow-md shadow-[#13284b]/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="material-symbols:send-rounded" class="text-xl" />
            </button>
          </div>
          <p class="mt-2 text-center text-[10px] text-slate-400 dark:text-neutral-500">
            Powered by Happitwin Assistant
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const open = ref(false);
const message = ref("");
const typing = ref(false);
const scrollArea = ref(null);
const messages = ref([
  { from: "bot", text: "👋 Hi! I'm the Happitwin Assistant. Looking for an event to book?" },
]);

const scrollToBottom = async () => {
  await nextTick();
  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  }
};

const toggleChat = () => {
  open.value = !open.value;
  if (open.value) scrollToBottom();
};

const sendMessage = async () => {
  const text = message.value.trim();
  if (!text || typing.value) return;

  messages.value.push({ from: "user", text });
  message.value = "";
  typing.value = true;
  await scrollToBottom();

  try {
    const res = await $fetch(`${config.public.chatbotApi}`, {
      method: "POST",
      body: { message: text },
    });

    const reply = res.choices[0].message.content;
    messages.value.push({ from: "bot", text: reply });
  } catch (err) {
    messages.value.push({
      from: "bot",
      text: "⚠️ Sorry, I couldn't reach the server. Please try again.",
    });
  } finally {
    typing.value = false;
    await scrollToBottom();
  }
};
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>
