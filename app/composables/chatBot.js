// composables/useChatBot.js
import { ref, nextTick } from "vue";

export const useChatBot = () => {
  const isOpen = ref(false);
  const showBadge = ref(true);
  const newMessage = ref("");
  const chatBody = ref(null);

  const messages = ref([
    { sender: "bot", text: "Welcome! How can I help you?" },
  ]);

  const toggleChat = () => {
    isOpen.value = !isOpen.value;
    showBadge.value = false;
  };

  const closeChat = () => {
    isOpen.value = false;
  };

  const scrollToBottom = async () => {
    await nextTick();
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    const userText = newMessage.value;
    messages.value.push({ sender: "user", text: userText });
    newMessage.value = "";
    await scrollToBottom();

    // Add typing indicator
    const typingIndex =
      messages.value.push({ sender: "bot", text: "Typing..." }) - 1;

    try {
      const res = await $fetch("/api/chat/chat", {
        method: "POST",
        body: {
          messages: messages.value
            .filter((msg) => msg.text !== "Typing...")
            .map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
        },
      });

      messages.value.splice(typingIndex, 1, {
        sender: "bot",
        text: res?.reply || "No response from bot.",
      });
    } catch (err) {
      messages.value.splice(typingIndex, 1, {
        sender: "bot",
        text: "⚠️ Sorry, something went wrong.",
      });
    }

    await scrollToBottom();
  };

  return {
    isOpen,
    showBadge,
    newMessage,
    chatBody,
    messages,
    toggleChat,
    closeChat,
    sendMessage,
  };
};