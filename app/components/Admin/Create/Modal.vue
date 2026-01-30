<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-10 z-50 h-full"
>
      <div>
        <button @click="$emit('close')" class="float-right bg-[#9d4e8a] rounded-full flex items-center cursor-pointer">
          <Icon name="tdesign:close" class="text-2xl mx-auto text-white" />
        </button>
        <!-- Modal content -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["close"]);
</script>
