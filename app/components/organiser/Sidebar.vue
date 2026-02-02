<template>
  <aside class="w-64 text-white h-screen flex flex-col shadow-lg top-0 sticky pt-[-200]">
    <!-- Logo -->
    <div class="p-6 flex items-center justify-center border-b border-white/20">
      <h1 class="text-3xl font-extrabold tracking-wide text-[#9d4e8a]">Organiser</h1>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-6 space-y-2">
      <OrganiserSidebarLink icon="🏠" label="Home" active />
      <OrganiserSidebarLink icon="📄" label="Create Events" />
      <OrganiserSidebarLink icon="👥" label="Track Events" />
      <OrganiserSidebarLink icon="📦" label="Notifications" />
      <OrganiserSidebarLink icon="💬" label="Messages" />
    </nav>

    <!-- User Info -->
    <div class="p-6 border-t border-gray-700">
      <div class="flex items-center gap-3">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          class="w-10 h-10 rounded-full border-2 border-gray-500"
        />
        <div>
          <p class="font-semibold text-gray-600 ">John Doe</p>
          <p class="text-sm text-gray-400">SOrganiser</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>

</script>
