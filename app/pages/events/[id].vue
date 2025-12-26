<template>
  <div class="bg-gray-200 select-none">
    <div
      class="max-w-5xl px-4 xl:px-0 lg:pt-10 lg:pb-10 mx-auto place-content-center"
    >
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
      <!-- <div class="flex justify-center items-center"> -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-12 items-center lg:items-center mx-auto"
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
          <!-- Ticket selection -->
           <p>Ticket selection</p>
          <select v-model="ticketType" class="w-72 p-2 border border-gray-400 rounded-md bg-[#9c4e8b] text-gray-200">
            <option value="regular" class="hover:bg-whte">Regular - KES {{ event?.regular }}</option>
            <option value="vip">VIP - KES {{ event?.vip }}</option>
            <option value="vvip">VVIP - KES {{ event?.vvip }}</option>
          </select>

          <!-- payment infor -->
          <div class="mt-4 pt-4 border-t border-gray-300">
            <h3 class="text-lg font-medium text-gray-800 dark:text-neutral-200">
              Mpesa Payment Information
            </h3>
          </div>

          <!-- user information eg name and email -->
          <dl class="flex sm:flex-row gap-1">
            <p>{{ error }}</p>
            <dt class="min-w-40">
              <span class="block text-sm text-gray-500 dark:text-neutral-500"
                >Name:</span
              >
            </dt>
            <dd>
              <ul>
                <li
                  class="me-1 after:content-[','] inline-flex items-center text-sm text-gray-800 dark:text-neutral-200"
                >
                  {{ user.firstName }} {{ user.lastName }}
                </li>
              </ul>
            </dd>
          </dl>
          <dl class="flex sm:flex-row gap-1">
            <dt class="min-w-40">
              <span class="block text-sm text-gray-500 dark:text-neutral-500"
                >Email:</span
              >
            </dt>
            <dd>
              <ul>
                <li
                  class="me-1 after:content-[','] inline-flex items-center text-sm text-gray-800 dark:text-neutral-200"
                >
                  <span>{{ user.email }}</span>
                </li>
              </ul>
            </dd>
          </dl>
          <!-- amount to pay -->

          <!-- choose different method of payment -->
          <div class="mt-6">
            <h4
              class="text-md font-medium text-gray-800 dark:text-neutral-200 mb-2"
            >
              Payment Method:
            </h4>
            <div class="flex gap-4 items-center">
              <!-- mpesa payment -->
              <div
                @click="bookAndPay"
                class="border border-gray-300 w-42 p-5 text-center items-center rounded-md cursor-pointer"
              >
                <Icon name="mingcute:phone-fill" class="text-3xl" />
                <p class="text-gray-500">M-Pesa</p>
              </div>
              <!-- card payment-->
              <div
                class="border border-gray-300 w-42 p-5 text-center items-center rounded-md cursor-pointer"
              >
                <Icon name="solar:card-linear" class="text-3xl" />
                <p class="text-gray-500">Card</p>
              </div>
            </div>
            <p v-if="error" class="text-red-500">{{ error }}</p>
            <p v-if="successMessage" class="text-green-500">
              {{ successMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useEventBooking from "~/composables/bookingEvent";

// import booking composable
const { event, phone, loading, error, successMessage, bookAndPay, ticketType } =
  useEventBooking();

const { user } = useAuth();
console.log("user info", event);
</script>
