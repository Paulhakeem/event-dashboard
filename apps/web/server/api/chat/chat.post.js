import { requireAuth } from "../../utils/requireAuth.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authUser = await requireAuth(event);
  const body = await readBody(event);

  if (typeof body?.message !== "string" || !body.message.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "A message is required",
    });
  }
  if (body.message.length > 2000) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is too long",
    });
  }
  if (authUser.role !== "user" && authUser.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Chat assistant is available to customers and admins",
    });
  }

  try {
    const response = await $fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.deepseekApiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful event-booking assistant for Velora Events. Only answer questions about events, bookings, tickets and the platform. Refuse anything else politely.",
          },
          {
            role: "user",
            content: body.message.slice(0, 2000),
          },
        ],
        max_tokens: 500,
      },
      timeout: 20000,
    });

    return {
      success: true,
      content: response?.choices?.[0]?.message?.content,
    };
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to get response from AI assistant",
    });
  }
});