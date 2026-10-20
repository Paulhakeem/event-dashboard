<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[#f8f7f3] dark:bg-zinc-950 px-4 py-8 text-slate-900 dark:text-white sm:px-6 sm:py-10 lg:px-8 lg:py-14"
  >
    <div
      class="pointer-events-none absolute -right-28 top-40 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-[#13284b]/10 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-6xl">
      <section
        class="relative isolate overflow-hidden rounded-3xl bg-[#101d3a] text-white shadow-2xl shadow-slate-900/20 sm:rounded-4xl"
        style="
          background-image: url(&quot;/images/contacts.jpg&quot;);
          background-size: cover;
          background-position: center;
        "
      >
        <div
          class="absolute inset-0 -z-10 bg-linear-to-r from-[#081226]/95 via-[#101d3a]/85 to-[#101d3a]/35"
          aria-hidden="true"
        />
        <div
          class="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border-[32px] border-amber-300/15"
          aria-hidden="true"
        />
        <div
          class="relative grid min-h-[23rem] items-center gap-8 px-6 py-10 sm:min-h-[27rem] sm:px-10 sm:py-14 md:grid-cols-[1.2fr_0.8fr] md:px-14 lg:px-16"
        >
          <div class="max-w-2xl">
            <p
              class="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 backdrop-blur"
            >
              <Icon name="mdi:message-text-outline" class="text-base" />
              We are here to help
            </p>
            <h1
              class="max-w-xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Let’s make your next event
              <span class="text-amber-300">unforgettable.</span>
            </h1>
            <p
              class="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base"
            >
              Questions, feedback, or planning a partnership? Reach out and the
              Happitwin team will help you find the right next step.
            </p>
            <a
              href="mailto:paulnyamawi18@gmail.com"
              class="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-[#101d3a] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#101d3a]"
            >
              <Icon name="material-symbols:mail-outline" class="text-lg" />
              Get in touch
            </a>
          </div>

          <div class="hidden justify-center md:flex">
            <div
              class="relative flex h-56 w-56 items-center justify-center rounded-3xl border border-amber-300/30 bg-white/5 shadow-2xl backdrop-blur-sm lg:h-64 lg:w-64"
              aria-hidden="true"
            >
              <div
                class="absolute inset-3 rounded-2xl border border-white/10"
              />
              <Icon
                name="mdi:ticket-confirmation-outline"
                class="text-8xl text-amber-300 drop-shadow-lg lg:text-9xl"
              />
              <span
                class="absolute -bottom-4 -right-5 rounded-xl border border-white/10 bg-[#101d3a]/90 px-4 py-3 text-xs font-semibold text-white shadow-xl"
              >
                Here for every moment
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        class="grid gap-6 py-8 sm:py-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8 lg:py-12"
      >
        <div>
          <div class="mb-6">
            <p
              class="text-xs font-bold uppercase tracking-[0.2em] text-amber-700"
            >
              Contact details
            </p>
            <h2
              class="mt-2 text-2xl font-bold tracking-tight text-[#101d3a] dark:text-white sm:text-3xl"
            >
              Start a conversation
            </h2>
            <p
              class="mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-neutral-400 sm:text-base"
            >
              Reach us through any of the channels below. We usually respond
              within one business day.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <a
              v-for="item in contactItems"
              :key="item.title"
              :href="item.href || undefined"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noreferrer' : undefined"
              class="group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 p-4 shadow-sm dark:shadow-none transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-slate-900/5"
            >
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl text-[#13284b] transition group-hover:bg-amber-300"
              >
                <Icon :name="item.icon" />
              </span>
              <span class="min-w-0">
                <span
                  class="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >{{ item.title }}</span
                >
                <span
                  class="mt-1 block wrap-break-word text-sm font-semibold text-slate-800 dark:text-white"
                  >{{ item.label }}</span
                >
              </span>
            </a>
          </div>
        </div>

        <div
          class="rounded-3xl border border-slate-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 shadow-xl dark:shadow-none shadow-slate-900/5 sm:p-8"
        >
          <template v-if="!submitted">
            <div class="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold tracking-tight">
                  Send us a message
                </h2>
                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-400">
                  Tell us a little about what you need and we’ll take it from
                  there.
                </p>
              </div>
              <span
                class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[#13284b] sm:flex"
              >
                <Icon name="material-symbols:forum-outline" class="text-xl" />
              </span>
            </div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
              <div class="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
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
                  <span class="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
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
                <span class="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                  >How can we help?</span
                >
                <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  placeholder="Tell us about your question or event..."
                  class="contact-input resize-none"
                />
              </label>
              <button
                type="submit"
                :disabled="sending"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#13284b] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#13284b]/20 transition hover:bg-[#0b1730] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
            <h2 class="mt-5 text-2xl font-bold text-gray-700 dark:text-neutral-300">
              Message received
            </h2>
            <p class="mt-2 max-w-sm leading-7 text-slate-600 dark:text-neutral-400">
              Thanks for reaching out. A member of the Happitwin team will get
              back to you shortly.
            </p>
            <button
              type="button"
              class="mt-6 text-sm font-bold text-[#13284b] dark:text-white hover:underline"
              @click="resetForm"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>

      <p class="pb-4 text-center text-xs text-slate-400">
        © {{ new Date().getFullYear() }} Happitwin events. All rights reserved.
      </p>
    </div>
  </main>
</template>

<script setup>
useHead({
  title: "Contact Happitwin Events",
  meta: [
    {
      name: "description",
      content:
        "Get in touch with the Happitwin Events team for booking support, event partnerships, or general enquiries.",
    },
  ],
});

const contactItems = [
  {
    title: "Email us",
    label: "support@happitwineventsltd.co.ke",
    href: "mailto:support@happitwineventsltd.co.ke",
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
    label: "@happitwineventsltd",
    href: "https://instagram.com/happitwineventsltd",
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
  border-color: #13284b;
  background: white;
  box-shadow: 0 0 0 3px rgb(156 78 139 / 15%);
}

.dark .contact-input {
  border-color: rgb(63 63 70);
  background: rgb(24 24 27);
  color: rgb(228 228 231);
}

.dark .contact-input::placeholder {
  color: rgb(113 113 122);
}

.dark .contact-input:focus {
  border-color: rgb(251 191 36);
  background: rgb(24 24 27);
}
</style>
