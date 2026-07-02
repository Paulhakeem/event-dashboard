import { verifyRecaptcha } from "../../utils/verifyRecaptcha.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body?.token;
  const config = useRuntimeConfig();

  return verifyRecaptcha(token, config);
});
