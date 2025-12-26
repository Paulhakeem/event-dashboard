<template>
  <!-- Team -->
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <div
      class="flex flex-wrap justify-center items-center gap-12 md:gap-14 lg:gap-20"
    >
      <div
        v-for="event in events"
        :key="event._id"
        class="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer group"
      >
        <NuxtLink :to="`/events/${event._id}`">
          <!-- IMAGE -->
          <NuxtImg
            class="rounded-xl w-full h-72 object-cover"
            :src="event.image"
            alt="Event Poster"
          />

          <!-- OVERLAY CONTENT -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-xl p-4 flex flex-col justify-end opacity-100 transition"
          >
            <!-- Title -->
            <h3
              class="text-white text-lg font-semibold first-letter:capitalize"
            >
              {{ event.title }}
            </h3>

            <!-- Location and Date -->
            <div class="flex justify-between text-gray-200 text-sm mt-1">
              <p>📍 {{ event.location }}</p>
              <p>{{ new Date(event.date).toLocaleDateString() }}</p>
            </div>

            <!-- Description -->
            <p
              class="text-gray-300 text-xs mt-1 first-letter:capitalize line-clamp-2"
            >
              {{ event.description }}
            </p>

            <!-- BUTTON -->
            <div class="flex gap-4 items-center text-center">
              <div
                class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded w-full"
              >
                <p>Regular</p>
                {{ event.regular }}/-
              </div>
              <div
                class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded w-full"
              >
                <p>VIP</p>

                {{ event.vip }}/-
              </div>
              <div
                class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded w-full"
              >
                <p>VVIP</p>
                {{ event.vvip }}/-
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- End Team -->
</template>
<script setup>
const events = ref([]);

const pendings = ref(true);

const errorMessage = ref("");

onMounted(async () => {
  try {
    const res = await $fetch("/api/events/fetch");
    if (res.success) {
      events.value = res.events || [];
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    pendings.value = false;
  }
});
</script>
