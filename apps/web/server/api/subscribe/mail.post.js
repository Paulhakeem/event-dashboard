// export default defineEventHandler(async (event) => {
//   const body = await readBody(event);
//   const email = (body.email || "").trim();

//     if (!email || !email.includes("@")) throw createError({ statusCode: 400, message: "Valid email is required" });

//     // verify email before subscribing
//     try {
//       const response = await $fetch("https://api.mailgun.net/v3/address/validate", {
//         method: "GET",
//         headers: {
//           Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}`,
//         },
//         params: { address: email },
//       });

//         if (!response.is_valid) {
//             throw createError({ statusCode: 400, message: "Invalid email address" });
//         }

//     })
