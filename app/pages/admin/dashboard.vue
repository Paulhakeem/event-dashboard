<template>
  <div>
    <!-- HEADER -->
    <header
      class="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 w-full bg-gray-200 border-b border-gray-200 text-sm py-2.5 lg:ps-65"
    >
      <nav class="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        
        <!-- Toggle Button (Mobile Only) -->
        <button 
          class="lg:hidden p-2"
          @click="toggleMenu"
        >
          <!-- Open Icon -->
          <Icon 
            v-if="!openMenu" 
            name="subway:menu" 
            class="text-2xl text-gray-700" 
          />

          <!-- Close Icon -->
          <Icon 
            v-else 
            name="zondicons:close-solid" 
            class="text-2xl text-gray-700" 
          />
        </button>

        <!-- Search -->
        <Dashboard-search />
      </nav>
    </header>

    <!-- Sidebar (Mobile) -->
    <div v-if="openMenu" class="lg:hidden">
      <Dashboard-sidebar v-model="itemSelected" @close="toggleMenu" />
    </div>

    <!-- Sidebar (Desktop) -->
    <div class="hidden lg:block">
      <Dashboard-sidebar v-model="itemSelected" />
    </div>

    <!-- Main Content -->
    <main class="w-full lg:ps-64">
      <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <component 
          v-if="itemSelected?.component"
          :is="itemSelected.component" 
        />
      </div>
    </main>
  </div>
</template>

<script setup>
const openMenu = ref(false)
const { sidebarMenu } = dashboardSidebar()
const itemSelected = ref(sidebarMenu[0])

// toggle sidebar function
const toggleMenu = () => {
  openMenu.value = !openMenu.value
}
</script>
