import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  if (!body.messages || !Array.isArray(body.messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Messages array is required",
    });
  }

  const openai = new OpenAI({
    apiKey: config.openAiApiKey,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // ✅ valid model
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