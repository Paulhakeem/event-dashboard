<template>
  <!-- Create admin modal -->
  <admin-create-modal
    :show="showModal"
    @close="showModal = false"
    class="overflow-y-auto"
    v-if="user.role === 'admin'"
  >
    <admin-create-new-admin />
  </admin-create-modal>

  <div
    class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
  >
    <!-- ── HEADER ───────────────────────────────────────── -->
    <div
      class="px-5 py-4 flex flex-col gap-3 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between"
    >
      <!-- Left: role filters + search -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <!-- Role filter pills -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="r in roles"
            :key="r.value"
            @click="setRole(r.value)"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
              selectedRole === r.value
                ? r.active
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            ]"
          >
            {{ r.label }}
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <Icon
            name="material-symbols:search"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search name or email…"
            class="pl-8 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none transition-all w-full sm:w-52"
          />
        </div>
      </div>

      <!-- Right: reset + add admin -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <button
          @click="resetFilters"
          class="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          v-if="user.role === 'admin'"
          @click="showModal = true"
          class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#9c4e8b] text-white hover:bg-[#7c3a6d] transition-colors shadow-sm"
        >
          <Icon name="tdesign:add" class="text-sm" />
          Add Admin
        </button>
      </div>
    </div>

    <!-- ── MOBILE: Card list (< md) ─────────────────────── -->
    <div class="block md:hidden divide-y divide-gray-50">
      <!-- Empty -->
      <div
        v-if="filteredUsers.length === 0"
        class="flex flex-col items-center justify-center py-14 gap-3 text-center"
      >
        <div
          class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center"
        >
          <Icon
            name="material-symbols:person-off"
            class="text-xl text-[#9c4e8b]"
          />
        </div>
        <p class="text-sm font-medium text-gray-600">No users found</p>
        <p class="text-xs text-gray-400">
          Try adjusting your filters or search query.
        </p>
      </div>

      <!-- Cards -->
      <div
        v-else
        v-for="person in filteredUsers"
        :key="person._id"
        class="flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50/60 transition-colors"
      >
        <!-- Avatar + info -->
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-full bg-[#9c4e8b]/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#9c4e8b] uppercase"
          >
            {{ (person.firstName?.[0] || "") + (person.lastName?.[0] || "") }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ person.firstName }} {{ person.lastName }}
            </p>
            <p class="text-xs text-gray-400 truncate">{{ person.email }}</p>
          </div>
        </div>

        <!-- Right: role + joined -->
        <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            :class="roleBadge(person.role)"
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          >
            {{ person.role }}
          </span>
          <span class="text-xs text-gray-400">{{
            formatDate(person.joinedAt)
          }}</span>
        </div>
      </div>
    </div>

    <!-- ── DESKTOP: Table (≥ md) ─────────────────────────── -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th
              class="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
            >
              User
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
            >
              Role
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
            >
              Events
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
            >
              Joined
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <!-- Empty -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4" class="py-16 text-center">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols:person-off"
                    class="text-xl text-[#9c4e8b]/60"
                  />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-600">
                    No users found
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Try adjusting your filters.
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-else
            v-for="person in filteredUsers"
            :key="person._id"
            class="hover:bg-[#f5eef9]/30 transition-colors duration-150"
          >
            <!-- Name + email + avatar initials -->
            <td class="px-5 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-[#9c4e8b]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#9c4e8b] uppercase"
                >
                  {{
                    (person.firstName?.[0] || "") + (person.lastName?.[0] || "")
                  }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ person.firstName }} {{ person.lastName }}
                  </p>
                  <p class="text-xs text-gray-400">{{ person.email }}</p>
                </div>
              </div>
            </td>

            <!-- Role badge -->
            <td class="px-5 py-4 whitespace-nowrap">
              <span
                :class="roleBadge(person.role)"
                class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
              >
                {{ person.role }}
              </span>
            </td>

            <!-- Events attended -->
            <td class="px-5 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold"
              >
                <Icon name="material-symbols:event" class="text-xs" />
                {{ person.events || 0 }}
              </span>
            </td>

            <!-- Joined date -->
            <td class="px-5 py-4 whitespace-nowrap text-xs text-gray-400">
              {{ formatDate(person.joinedAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── FOOTER ───────────────────────────────────────── -->
    <div
      class="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2"
    >
      <p class="text-xs text-gray-400">
        Showing
        <span class="font-semibold text-gray-700">{{
          filteredUsers.length
        }}</span>
        of
        <span class="font-semibold text-gray-700">{{
          users?.length || 0
        }}</span>
        users
      </p>

      <!-- Role counts -->
      <div class="flex items-center gap-3 text-xs text-gray-400">
        <span class="flex items-center gap-1">
          <span
            class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"
          ></span>
          {{ roleCount("admin") }} admins
        </span>
        <span class="flex items-center gap-1">
          <span
            class="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block"
          ></span>
          {{ roleCount("organiser") }} organisers
        </span>
        <span class="flex items-center gap-1">
          <span
            class="w-1.5 h-1.5 rounded-full bg-[#9c4e8b] inline-block"
          ></span>
          {{ roleCount("user") }} users
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { users } = totalUsers();
const { user } = useAuth();

const selectedRole = ref("all");
const searchQuery = ref("");
const showModal = ref(false);

const roles = [
  { value: "all", label: "All", active: "bg-[#9c4e8b] text-white" },
  { value: "user", label: "Users", active: "bg-blue-500 text-white" },
  {
    value: "organiser",
    label: "Organisers",
    active: "bg-yellow-500 text-white",
  },
  { value: "admin", label: "Admins", active: "bg-green-500 text-white" },
];

const setRole = (r) => {
  selectedRole.value = r;
};
const resetFilters = () => {
  selectedRole.value = "all";
  searchQuery.value = "";
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const roleBadge = (role) =>
  ({
    admin: "bg-green-100 text-green-700",
    organiser: "bg-yellow-100 text-yellow-700",
    user: "bg-purple-100 text-[#9c4e8b]",
  })[role] ?? "bg-gray-100 text-gray-600";

const roleCount = (r) => (users.value || []).filter((u) => u.role === r).length;

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return (users.value || []).filter((u) => {
    if (selectedRole.value !== "all" && u.role !== selectedRole.value)
      return false;
    if (!q) return true;
    const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    return name.includes(q) || (u.email || "").toLowerCase().includes(q);
  });
});
</script>
