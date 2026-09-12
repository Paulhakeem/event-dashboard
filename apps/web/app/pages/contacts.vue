<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[#17131c] px-4 py-8 text-slate-900 sm:px-8 sm:py-12 lg:px-12"
    style="
      background-image: url(&quot;/images/contacts.jpg&quot;);
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    "
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[#0d0a12]/75"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-linear-to-b from-[#211a2d]/35 via-[#0d0a12]/20 to-[#0d0a12]/85"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-6xl">
      <section
        class="relative overflow-hidden rounded-4xl bg-[#211a2d] px-6 py-10 text-white shadow-xl shadow-slate-900/10 sm:px-10 sm:py-14 lg:px-16"
      >
        <div
          class="absolute -right-20 -top-24 h-72 w-72 rounded-full border-40 border-[#d6a2c9]/20"
          aria-hidden="true"
        />
        <div
          class="absolute -bottom-32 left-1/2 h-64 w-64 rounded-full bg-[#9c4e8b]/20 blur-3xl"
          aria-hidden="true"
        />
        <div class="relative max-w-2xl">
          <p
            class="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#e8b8da]"
          >
            We are here to help
          </p>
          <h1
            class="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Let’s make your next event unforgettable.
          </h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Whether you have a question, need assistance, you want to be a
            partner, or want to share your feedback, we’re here to listen and
            provide the support you need.
          </p>
        </div>
      </section>

      <section
        class="grid gap-6 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:py-12"
      >
        <div>
          <div class="mb-6">
            <p
              class="text-sm font-bold uppercase tracking-[0.2em] text-gray-200"
            >
              Contact details
            </p>
            <h2
              class="mt-2 text-2xl font-bold text-gray-200 tracking-tight sm:text-3xl"
            >
              Start a conversation
            </h2>
            <p class="mt-3 max-w-md leading-7 text-slate-100">
              Reach us through any of the channels below. We usually respond
              within one business day.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a
              v-for="item in contactItems"
              :key="item.title"
              :href="item.href || undefined"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noreferrer' : undefined"
              class="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#d6a2c9] hover:shadow-md"
            >
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2e5ef] text-xl text-[#9c4e8b] transition group-hover:bg-[#9c4e8b] group-hover:text-white"
              >
                <Icon :name="item.icon" />
              </span>
              <span class="min-w-0">
                <span
                  class="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >{{ item.title }}</span
                >
                <span
                  class="mt-1 block wrap-break-word text-sm font-semibold text-slate-800"
                  >{{ item.label }}</span
                >
              </span>
            </a>
          </div>
        </div>

        <div
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8"
        >
          <template v-if="!submitted">
            <div class="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold tracking-tight">
                  Send us a message
                </h2>
                <p class="mt-2 text-sm leading-6 text-slate-100">
                  Tell us a little about what you need and we’ll take it from
                  there.
                </p>
              </div>
              <span
                class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2e5ef] text-[#9c4e8b] sm:flex"
              >
                <Icon name="material-symbols:forum-outline" class="text-xl" />
              </span>
            </div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
              <div class="grid gap-5 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-slate-700"
                    >Your name</span
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    autocomplete="name"
                    placeholder="Jane Doe"
                    class="contact-input"
                  />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-slate-700"
                    >Email address</span
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    autocomplete="email"
                    placeholder="jane@example.com"
                    class="contact-input"
                  />
                </label>
              </div>
              <label class="block">
                <span class="mb-2 block text-sm font-semibold text-slate-700"
                  >How can we help?</span
                >
                <textarea
                  v-model="form.message"
                  required
                  rows="6"
                  placeholder="Tell us about your question or event..."
                  class="contact-input resize-none"
                />
              </label>
              <button
                type="submit"
                :disabled="sending"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#9c4e8b] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#9c4e8b]/20 transition hover:bg-[#7c3a6d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Icon v-if="sending" name="svg-spinners:ring-resize" />
                <Icon v-else name="material-symbols:send-rounded" />
                {{ sending ? "Sending..." : "Send message" }}
              </button>
            </form>
          </template>

          <div
            v-else
            class="flex min-h-88 flex-col items-center justify-center text-center"
          >
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
            >
              <Icon name="material-symbols:check-circle" class="text-4xl" />
            </div>
            <h2 class="mt-5 text-2xl font-bold text-gray-700">
              Message received
            </h2>
            <p class="mt-2 max-w-sm leading-7 text-slate-600">
              Thanks for reaching out. A member of the Velora team will get back
              to you shortly.
            </p>
            <button
              type="button"
              class="mt-6 text-sm font-bold text-[#9c4e8b] hover:underline"
              @click="resetForm"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>

      <p class="pb-4 text-center text-xs text-slate-400">
        © {{ new Date().getFullYear() }} Velora Events. All rights reserved.
      </p>
    </div>
  </main>
</template>

<script setup>
const contactItems = [
  {
    title: "Email us",
    label: "support@velorabookingapp.com",
    href: "mailto:support@velorabookingapp.com",
    icon: "material-symbols:mail-outline",
  },
  {
    title: "Call us",
    label: "(+254) 759 - 732 - 432",
    href: "tel:+254759732432",
    icon: "material-symbols:call-outline",
  },
  {
    title: "WhatsApp",
    label: "(+254) 759 - 732 - 432",
    href: "https://wa.me/254759732432",
    external: true,
    icon: "ic:baseline-whatsapp",
  },
  {
    title: "Follow along",
    label: "@velorabookingapp",
    href: "https://instagram.com/velorabookingapp",
    external: true,
    icon: "mdi:instagram",
  },
];

const form = ref({ name: "", email: "", message: "" });
const sending = ref(false);
const submitted = ref(false);

const handleSubmit = async () => {
  sending.value = true;

  await new Promise((resolve) => setTimeout(resolve, 900));

  sending.value = false;
  submitted.value = true;
};

const resetForm = () => {
  form.value = { name: "", email: "", message: "" };
  submitted.value = false;
};
</script>

<style scoped>
.contact-input {
  width: 100%;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  background: rgb(248 250 252);
  padding: 0.8rem 1rem;
  color: rgb(15 23 42);
  font-size: 0.875rem;
  outline: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;
}

.contact-input::placeholder {
  color: rgb(148 163 184);
}

.contact-input:focus {
  border-color: #9c4e8b;
  background: white;
  box-shadow: 0 0 0 3px rgb(156 78 139 / 15%);
}
</style>
