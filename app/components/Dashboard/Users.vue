<template>
  <!-- Card -->
  <div class="flex flex-col">
    <div
      class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div class="min-w-full inline-block align-middle">
        <div
          class="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700"
        >
          <!-- Header -->
          <div
            class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700"
          >
            <div class="flex gap-2">
              <div class="flex items-center gap-2">
                <label for="hs-at-with-checkboxes-main" class="flex">
                  <input
                    type="checkbox"
                    class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-at-with-checkboxes-main"
                  />
                  <span class="sr-only">Checkbox</span>
                </label>
                <button class="text-sm text-gray-600 dark:text-neutral-400">
                  Filter By Users
                </button>
              </div>
              <div class="flex items-center gap-2">
                <label for="hs-at-with-checkboxes-main" class="flex">
                  <input
                    type="checkbox"
                    class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    id="hs-at-with-checkboxes-main"
                  />
                  <span class="sr-only">Checkbox</span>
                </label>
                <button class="text-sm text-gray-600 dark:text-neutral-400">
                  Filter By Admins
                </button>
              </div>
            </div>

            <div>
              <div class="inline-flex gap-x-2">
                <button
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  View all
                </button>

                <button
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#9c4e8b] text-white cursor-pointer hover:bg-[#cb35a3] focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <icon name="tdesign:add" class="w-42" />
                  Add Admin
                </button>
              </div>
            </div>
          </div>
          <!-- End Header -->

          <!-- Table -->
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700"
          >
            <thead class="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th
                  scope="col"
                  class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                >
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      Name
                    </span>
                  </div>
                </th>

                <th scope="col" class="px-6 py-3 text-start">
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      role
                    </span>
                  </div>
                </th>

                <th scope="col" class="px-6 py-3 text-start">
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      events att
                    </span>
                  </div>
                </th>

                <th scope="col" class="px-6 py-3 text-start">
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      joined
                    </span>
                  </div>
                </th>

                <th scope="col" class="px-6 py-3 text-end"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
              <tr v-for="person in users" :key="person.name">
                <td class="size-px whitespace-nowrap">
                  <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                    <div class="flex items-center gap-x-3">
                      <img
                        class="inline-block size-9.5 rounded-full"
                        src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                        alt="Avatar"
                      />
                      <div class="grow">
                        <span
                          class="block text-sm font-semibold text-gray-800 dark:text-neutral-200"
                          >{{ person.firstName }} {{ person.lastName }}</span
                        >
                        <span
                          class="block text-sm text-gray-500 dark:text-neutral-500"
                          >{{ person.email }}</span
                        >
                      </div>
                    </div>
                  </div>
                </td>
                <td class="h-px w-32 whitespace-nowrap">
                  <div class="px-6 py-3">
                    <span
                      class="block text-sm font-semibold text-gray-600 dark:text-neutral-200"
                      >{{ person.role }}</span
                    >
                  </div>
                </td>
                <td class="size-px whitespace-nowrap">
                  <div class="px-6 py-3">
                    <span
                      class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500"
                    >
                      {{ person.events }}
                    </span>
                  </div>
                </td>
                <td class="size-px whitespace-nowrap">
                  <div class="px-6 py-3">
                    <span class="text-sm text-gray-500 dark:text-neutral-500">{{
                     formatDate( person.joinedAt)
                    }}</span>
                  </div>
                </td>
                <td class="size-px whitespace-nowrap">
                  <div class="px-6 py-1.5">
                    <a
                      class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                      href="#"
                    >
                      Remove
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End Table -->

          <!-- Footer -->
          <div
            class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700"
          >
            <div>
              <p class="text-sm text-gray-600 dark:text-neutral-400">
                <span
                  class="font-semibold text-gray-800 dark:text-neutral-200"
                  >{{ users.length }}</span
                >
                Total users
              </p>
            </div>
          </div>
          <!-- End Footer -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Card -->
</template>

<script setup>
const { users } = totalUsers();
// format date
const formatDate=(date)=> {
  if(!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: "long",
    day: 'numeric'
  })
}
</script>
