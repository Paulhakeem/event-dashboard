export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

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
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: body.message
          }
        ]
      }
    });

    return response;
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to get response from AI assistant",
    });
  }
});