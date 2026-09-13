export default defineNitroPlugin(() => {
  const config = useRuntimeConfig();

  const secretLength = config.secretStr?.length || 0;
  if (secretLength < 32) {
    throw new Error(
      `SECRET_STR is too weak (${secretLength} chars). It must be at least 32 characters long.`,
    );
  }
});