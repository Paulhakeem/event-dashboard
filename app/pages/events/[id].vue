

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
          <!-- number input for payment -->
          <label
            class="block text-sm font-medium text-gray-700 dark:text-neutral-300"
            >Phone Number:</label
          >
          <input
            v-model="phone"
            type="text"
            placeholder="1234 5678 9012 3456"
            class="mt-1 block w-72 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#9c4e8b] focus:border-[#9c4e8b] sm:text-sm"
          />
          <!-- button for price tag -->
          <div class="flex gap-4 items-center text-center">
            <div
              @click="submitBooking"
              class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded w-full cursor-pointer"
            >
              <p>Regular</p>
              {{ event?.regular }}/-
            </div>
            <div
              @click="bookAndPay"
              class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded w-full cursor-pointer"
            >
              <p>VIP</p>

              {{ event?.vip }}/-
            </div>
            <div
              @click="handleSubmit"
              class="mt-3 px-4 py-2 bg-[#9c4e8b] text-white text-sm font-medium rounded w-full cursor-pointer"
            >
              <p>VVIP</p>
              {{ event?.vvip }}/-
            </div>
          </div>
          <!-- choose different method of payment -->
          <div class="mt-6">
            <h4
              class="text-md font-medium text-gray-800 dark:text-neutral-200 mb-2"
            >
              Choose Payment Method:
            </h4>
            <div class="flex gap-4 items-center">
              <div>
                <Icon name="flowbite:visa-solid" class="text-5xl" />
              </div>
              <!-- paypal -->
              <div>
                <Icon name="fontisto:paypal" class="text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useEventBooking from "~/composables/bookingEvent";

// import booking composable
const { event, phone, loading, error, successMessage, bookAndPay } =
  useEventBooking();

const { user } = useAuth();
console.log("user info", event);
</script>
