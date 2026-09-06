<template>
  <main class="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <section
      class="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12"
    >
      <p class="text-sm font-bold uppercase tracking-[0.24em] text-[#9c4e8b]">
        Velora Events
      </p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        Contact us
      </h1>
      <p class="mt-4 max-w-xl text-slate-600">
        Have a question about an event or your booking? Our team is ready to
        help.
      </p>
      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hello@velora.events"
          class="rounded-2xl bg-slate-950 p-5 text-white transition hover:bg-[#9c4e8b]"
        >
          <Icon name="material-symbols:mail-outline" class="text-2xl" />
          <span class="mt-4 block text-sm font-bold">Email support</span>
          <span class="mt-1 block text-sm text-white/70"
            >hello@velora.events</span
          >
        </a>
        <div
          class="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900"
        >
          <Icon
            name="material-symbols:schedule-outline"
            class="text-2xl text-[#9c4e8b]"
          />
          <span class="mt-4 block text-sm font-bold">Support hours</span>
          <span class="mt-1 block text-sm text-slate-500"
            >Monday to Friday, 9am to 5pm</span
          >
        </div>
      </div>
    </section>
  </main>
</template>
