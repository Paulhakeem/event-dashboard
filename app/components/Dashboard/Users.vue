<template>
  <!-- Card -->
  <admin-create-modal
    :show="showModal"
    @close="showModal = false"
    class="overflow-y-auto"
    v-if="user.role === 'admin'"
  >
    <admin-create-new-admin />
  </admin-create-modal>

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
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <button :class="['px-3 py-1 rounded-full text-sm font-medium', selectedRole === 'all' ? 'bg-[#9c4e8b] text-white' : 'bg-gray-100 text-gray-700']" @click="setRole('all')">All</button>
                <button :class="['px-3 py-1 rounded-full text-sm font-medium', selectedRole === 'user' ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-700']" @click="setRole('user')">Users</button>
                <button :class="['px-3 py-1 rounded-full text-sm font-medium', selectedRole === 'organiser' ? 'bg-[#f59e0b] text-white' : 'bg-gray-100 text-gray-700']" @click="setRole('organiser')">Organisers</button>
                <button :class="['px-3 py-1 rounded-full text-sm font-medium', selectedRole === 'admin' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700']" @click="setRole('admin')">Admins</button>
              </div>

              <div class="ml-4">
                <input v-model="searchQuery" type="search" placeholder="Search by name or email" class="px-3 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#9c4e8b] focus:border-transparent" />
              </div>
            </div>

            <div>
              <div class="inline-flex gap-x-2">
                <button @click="resetFilters" class="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50">Reset</button>

                <button
                  @click="showModal = true"
                  v-if="user.role === 'admin'"
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#9c4e8b] text-white hover:bg-[#cb35a3]"
                >
                  <icon name="tdesign:add" class="w-42" />
                  Add Admin
                </button>
              </div>
            </div>
          </div>
          <!-- End Header -->

          <!-- Table -->
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 text-center justify-center items-center">
              <tr>
                <th class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-end">
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      Name
                    </span>
                  </div>
                </th>

                <th class="px-6 py-3 text-end">
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      role
                    </span>
                  </div>
                </th>

                <th class="px-6 py-3 text-start">
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      events att
                    </span>
                  </div>
                </th>

                <th class="px-6 py-3 text-start">
                  <div class="flex items-center gap-x-2">
                    <span
                      class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200"
                    >
                      joined
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                <tr v-for="person in filteredUsers" :key="person._id">
                <td class="size-px whitespace-nowrap">
                  <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                    <div class="flex items-center gap-x-3">
                      <img
                        class="inline-block size-9.5 rounded-full"
                        src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                        alt="Avatar"
                      />
                      <div class="grow">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">{{ person.firstName }} {{ person.lastName }}</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">{{ person.email }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="h-px w-32 whitespace-nowrap">
                  <div class="px-6 py-3">
                    <span v-if="person.role === 'admin'" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">Admin</span>
                    <span v-else-if="person.role === 'organiser'" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold">Organiser</span>
                    <span v-else class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">User</span>
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
                      formatDate(person.joinedAt)
                    }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End Table -->

          <!-- Footer -->
          <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
            <div>
              <p class="text-sm text-gray-600 dark:text-neutral-400">
                <span class="font-semibold text-gray-800 dark:text-neutral-200">{{ users.length }}</span>
                Total users
              </p>
            </div>
            <div class="mt-2 md:mt-0">
              <p class="text-sm text-gray-600 dark:text-neutral-400">
                <span class="font-semibold text-gray-800 dark:text-neutral-200">{{ filteredUsers.length }}</span>
                Shown
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
const { user } = useAuth();

// filters
const selectedRole = ref('all');
const searchQuery = ref('');

const setRole = (r) => {
  selectedRole.value = r;
};

const resetFilters = () => {
  selectedRole.value = 'all';
  searchQuery.value = '';
};

// format date
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const showModal = ref(false);

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return (users.value || []).filter((u) => {
    if (selectedRole.value !== 'all' && u.role !== selectedRole.value) return false;
    if (!q) return true;
    const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return name.includes(q) || (u.email || '').toLowerCase().includes(q);
  });
});
</script>
