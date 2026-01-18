import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  if (!body.message || !Array.isArray(body.message)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is required",
    });
  }

  const openai = new OpenAI({
    apiKey: config.openAiApiKey,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },

      ...body.messages,
    ],
  });

  const reply =
    completion.choices?.[0]?.message?.content?.trim() ||
    "Sorry, I couldn’t generate a response.";

  return { reply };
});
