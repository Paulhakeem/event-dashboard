<template>
  <div>
    <div class="flex items-center justify-center ml-10 z-50">
      <ClientOnly>
        <Sidebar />
      </ClientOnly>
    </div>

    <slot />
  </div>
</template>
