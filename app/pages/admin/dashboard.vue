<template>
  <div>
    <!-- ========== HEADER ========== -->

    <header
      class="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 w-full bg-gray-200 border-b border-gray-200 text-sm py-2.5 lg:ps-65"
    >
      <nav class="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div class="me-5 lg:me-0 lg:hidden flex items-center">
          <!-- Logo -->
          <div
            class="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
          >
            <h1>Admin</h1>
          </div>
          <!-- End Logo -->

          <div class="lg:hidden ms-1">
            <!-- Templates Dropdown -->
            <div
              class="hs-dropdown relative [--scope:window] [--auto-close:inside] inline-flex"
            >
              <button
                id="hs-dropdown-preview-navbar"
                type="button"
                class="hs-dropdown-toggle group relative flex justify-center items-center size-8 text-xs rounded-full text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                <span class="">
                  <Icon name="meteor-icons:chevron-down" class="text-xl" />
                </span>

                <span class="absolute -top-0.5 -end-0.5">
                  <span class="relative flex">
                    <span
                      class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 dark:bg-red-600 opacity-75"
                    ></span>
                    <span
                      class="relative inline-flex size-2 bg-red-500 rounded-full"
                    ></span>
                    <span class="sr-only">Notification</span>
                  </span>
                </span>
              </button>
            </div>
            <!-- End Templates Dropdown -->
          </div>
        </div>

        <!-- search bar -->
        <Dashboard-search />
        <!-- end of search -->
      </nav>
    </header>

    <!-- Sidebar -->
    <Dashboard-sidebar v-model="itemSelected" />
    <!-- End Sidebar -->

    <!-- Content -->
    <div class="w-full lg:ps-64">
      <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <component v-if="itemSelected?.component" :is="itemSelected.component" />
      </div>
    </div>
    <!-- End Content -->
  </div>
</template>

<script setup>
const { sidebarMenu } = dashboardSidebar();
const itemSelected = ref(sidebarMenu[0]);
</script>
