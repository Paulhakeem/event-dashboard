<template>
  <div class="bg-gray-200 select-none">
    <div class="max-w-5xl px-4 xl:px-0 lg:pt-10 lg:pb-10 mx-auto">
      <!-- Title -->
      <div class="max-w-3xl mb-5 md:pt-10 lg:mb-10">
        <h2
          class="text-[#9c4e8b] font-semibold text-2xl md:text-4xl md:leading-tight"
        >
            Event Details
        </h2>
      </div>
      <!-- End Title -->

      <!-- Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-12 items-center justify-center lg:items-center"
      >
        <div class="aspect-w-16 aspect-h-9 lg:aspect-none">
          <img
            class="size-96 object-cover rounded-xl"
            :src="event?.image"
            alt="Features Image"
          />
        </div>
        <!-- End Col -->
        <!-- List -->
        <div class="space-y-3 sm:items-center">
          <dl class="flex gap-1">
            <dt class="min-w-40">
              <span class="block text-sm text-gray-500 dark:text-neutral-500"
                >Title:</span
              >
            </dt>
            <dd>
              <ul>
                <li
                  class="first-letter:uppercase me-1 inline-flex items-center text-sm text-gray-800 dark:text-neutral-200"
                >
                  {{ event?.title }}
                </li>
              </ul>
            </dd>
          </dl>

          <dl class="flex sm:flex-row gap-1">
            <dt class="min-w-40">
              <span class="block text-sm text-gray-500 dark:text-neutral-500"
                >Description:</span
              >
            </dt>
            <dd>
              <ul>
                <li
                  class="me-1 after:content-[','] inline-flex items-center text-sm text-gray-800 dark:text-neutral-200"
                >
                  {{ event?.description }}
                </li>
              </ul>
            </dd>
          </dl>

          <dl class="flex sm:flex-row gap-1">
            <dt class="min-w-40">
              <span class="block text-sm text-gray-500 dark:text-neutral-500"
                >Location:</span
              >
            </dt>
            <dd>
              <ul>
                <li
                  class="me-1 after:content-[','] inline-flex items-center text-sm text-gray-800 dark:text-neutral-200"
                >
                  {{ event?.location }}
                </li>
              </ul>
            </dd>
          </dl>

          <dl class="flex sm:flex-row gap-1">
            <dt class="min-w-40">
              <span class="block text-sm text-gray-500 dark:text-neutral-500"
                >Date:</span
              >
            </dt>
            <dd>
              <ul>
                <li
                  class="me-1 after:content-[','] inline-flex items-center text-sm text-gray-800 dark:text-neutral-200"
                >
                  {{ new Date(event?.date).toLocaleDateString() }}
                </li>
              </ul>
            </dd>
          </dl>
          <!-- button for price tag -->
          <div>
            <button
              class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded cursor-pointer transition"
            >
              Buy Ticket - ksh{{ event?.price }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const event = ref([]);

// fetch event data based on id
onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await $fetch(`/api/events/${id}`, {
      method: "GET",
      params: { id },
    });
    console.log("Fetched event data:", res);
    event.value = res.eventData;
  } catch (error) {
    console.log("Error fetching event data:", error);
  }
});
</script>
