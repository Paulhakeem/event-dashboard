<template>
  <aside
    id="top-bar-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div
      class="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default"
    >
      <a href="https://flowbite.com/" class="flex items-center ps-2.5 mb-5">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          class="h-6 me-3"
          alt="Flowbite Logo"
        />
        <span
          class="self-center text-lg text-heading font-semibold whitespace-nowrap"
          >Organiser</span
        >
      </a>
      <ul class="space-y-2 font-medium">
        <li v-for="menu in sidebar" :key="menu.title">
          <a
            href="#"
            class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
          >
            <icon
              :name="menu.icon"
              class="shrink-0 text-2xl transition duration-75 group-hover:text-fg-brand"
            />
            <span class="ms-3">{{ menu.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  <!-- body -->
  <div class="p-4 sm:ml-64 mt-14">
    <main class="flex-1 p-6 space-y-6 overflow-y-auto">
      <organiser-section />
      <OrganiserIncomeChart />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrganiserActivities />
        <OrganiserTopEvents />
      </div>
    </main>
  </div>
</template>

<script setup>
import useOrganiserSidebar from "~/composables/organiserSidebar";

const { sidebar } = useOrganiserSidebar();
</script>
