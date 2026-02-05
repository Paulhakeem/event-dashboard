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
        <li>
          <a
            href="#"
            class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
          >
            <svg
              class="w-5 h-5 transition duration-75 group-hover:text-fg-brand"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
              />
            </svg>
            <span class="ms-3">Dashboard</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
          >
           <Icon name="mdi:event-add"  class="shrink-0 text-2xl transition duration-75 group-hover:text-fg-brand"/>
            <span class="flex-1 ms-3 whitespace-nowrap">Create Events</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
          >
            <Icon
              name="carbon:event"
              class="shrink-0 text-2xl transition duration-75 group-hover:text-fg-brand"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Track Events</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
          >
            <Icon
              name="tdesign:notification-filled"
              class="shrink-0 text-2xl transition duration-75 group-hover:text-fg-brand"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Notifications</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
          >
            <Icon
              name="gg:insights"
              class="shrink-0 text-2xl transition duration-75 group-hover:text-fg-brand"
            />
            <span class="flex-1 ms-3 whitespace-nowrap">Insights</span>
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

<script setup></script>
