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
      class="px-4 sm:px-5 py-4 flex flex-col gap-3 border-b border-gray-100 lg:flex-row lg:items-center lg:justify-between"
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
      <div class="flex items-center gap-2 flex-wrap lg:justify-end">
        <button
          v-if="selectedUsers.length"
          @click="runBulkAction('suspend')"
          class="px-3 py-2 text-xs font-semibold rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
        >
          Suspend {{ selectedUsers.length }}
        </button>
        <button
          v-if="selectedUsers.length"
          @click="runBulkAction('delete')"
          class="px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
        >
          Delete {{ selectedUsers.length }}
        </button>
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
        class="flex flex-col items-center justify-center py-14 gap-3 text-center px-4"
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
        class="flex items-start gap-3 px-4 sm:px-5 py-4 transition-colors"
        :class="
          selectedUsers.includes(person._id)
            ? 'bg-[#f5eef9]/50'
            : 'hover:bg-gray-50/60'
        "
      >
        <!-- Checkbox -->
        <input
          v-model="selectedUsers"
          :value="person._id"
          type="checkbox"
          class="mt-1.5 w-4 h-4 shrink-0 accent-[#9c4e8b] cursor-pointer"
          :aria-label="`Select ${person.firstName} ${person.lastName}`"
          @click.stop
        />

        <!-- Avatar + info -->
        <div class="flex flex-1 items-center justify-between gap-3 min-w-0">
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
            <button
              @click="openDetails(person)"
              class="text-xs font-semibold text-[#9c4e8b] hover:underline"
            >
              View details
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedRole === 'admin'"
      class="px-4 sm:px-5 py-3 bg-green-50 border-b border-green-100 text-sm text-green-800"
    >
      <span class="font-semibold">Administrator accounts:</span>
      {{ filteredUsers.length }} shown, with role, permission, status, and audit
      controls below.
    </div>

    <!-- ── DESKTOP: Table (≥ md) ─────────────────────────── -->
    <div class="hidden md:block overflow-x-auto">
      <div class="max-h-[70vh] overflow-y-auto">
        <table class="min-w-full text-sm">
          <thead class="sticky top-0 z-10 bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3.5 text-left">
                <input
                  v-model="selectAll"
                  type="checkbox"
                  class="w-4 h-4 accent-[#9c4e8b] cursor-pointer"
                  aria-label="Select all users"
                />
              </th>
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
                Status
              </th>
              <th
                class="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
              >
                Verification
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
              <th
                class="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- Empty -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="8" class="py-16 text-center">
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
              class="transition-colors duration-150"
              :class="
                selectedUsers.includes(person._id)
                  ? 'bg-[#f5eef9]/50'
                  : 'hover:bg-[#f5eef9]/30'
              "
            >
              <!-- Checkbox -->
              <td class="px-5 py-4 whitespace-nowrap">
                <input
                  v-model="selectedUsers"
                  :value="person._id"
                  type="checkbox"
                  class="w-4 h-4 accent-[#9c4e8b] cursor-pointer"
                  :aria-label="`Select ${person.firstName} ${person.lastName}`"
                />
              </td>

              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-[#9c4e8b]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#9c4e8b] uppercase"
                  >
                    {{
                      (person.firstName?.[0] || "") +
                      (person.lastName?.[0] || "")
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

              <td class="px-5 py-4 whitespace-nowrap">
                <span
                  :class="
                    person.accountStatus === 'suspended'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  "
                  class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                >
                  {{ person.accountStatus || "active" }}
                </span>
              </td>

              <td class="px-5 py-4 whitespace-nowrap">
                <button
                  @click="
                    runAction(
                      person,
                      person.isEmailVerified ? 'unverify' : 'verify',
                    )
                  "
                  :class="
                    person.isEmailVerified
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  "
                  class="px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                >
                  {{ person.isEmailVerified ? "Verified" : "Unverified" }}
                </button>
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
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <button
                    @click="openDetails(person)"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#9c4e8b] hover:bg-[#9c4e8b]/10 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    @click="
                      runAction(
                        person,
                        person.accountStatus === 'suspended'
                          ? 'activate'
                          : 'suspend',
                      )
                    "
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                  >
                    {{
                      person.accountStatus === "suspended"
                        ? "Activate"
                        : "Suspend"
                    }}
                  </button>
                  <button
                    @click="runAction(person, 'delete')"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── FOOTER ───────────────────────────────────────── -->
    <div
      class="px-4 sm:px-5 py-3.5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2"
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
      <div class="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
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

  <div
    v-if="detailsUser"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    @click.self="detailsUser = null"
  >
    <section
      class="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h2 class="text-xl font-bold text-gray-900 truncate">
            {{ detailsUser.firstName }} {{ detailsUser.lastName }}
          </h2>
          <p class="text-sm text-gray-500 truncate">{{ detailsUser.email }}</p>
        </div>
        <button
          @click="detailsUser = null"
          class="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Role</p>
          <select
            v-model="detailsUser.role"
            @change="runAction(detailsUser, 'role', detailsUser.role)"
            class="mt-2 w-full rounded-lg border border-gray-200 p-2 text-gray-900 focus:ring-2 focus:ring-[#9c4e8b]/20 focus:border-[#9c4e8b] outline-none"
          >
            <option
              v-for="role in roles.slice(1)"
              :key="role.value"
              :value="role.value"
            >
              {{ role.label }}
            </option>
          </select>
        </div>
        <div>
          <p class="text-gray-500">Account status</p>
          <select
            v-model="detailsUser.accountStatus"
            @change="
              runAction(
                detailsUser,
                detailsUser.accountStatus === 'suspended'
                  ? 'suspend'
                  : 'activate',
              )
            "
            class="mt-2 w-full rounded-lg border border-gray-200 p-2 text-gray-900"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div>
          <p class="text-gray-500">Email verification</p>
          <button
            @click="
              runAction(
                detailsUser,
                detailsUser.isEmailVerified ? 'unverify' : 'verify',
              )
            "
            class="mt-2 font-semibold text-[#9c4e8b] hover:underline"
          >
            {{
              detailsUser.isEmailVerified
                ? "Verified: revoke"
                : "Unverified: verify"
            }}
          </button>
        </div>
        <div>
          <p class="text-gray-500">Joined</p>
          <p class="mt-2 font-semibold">
            {{ formatDate(detailsUser.joinedAt) }}
          </p>
        </div>
      </div>
      <div
        v-if="detailsUser.role === 'admin'"
        class="mt-6 border-t border-gray-100 pt-4"
      >
        <h3 class="font-bold text-gray-900">Admin permissions</h3>
        <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label
            v-for="permission in adminPermissions"
            :key="permission"
            class="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-700"
          >
            <input
              v-model="detailsUser.permissions"
              :value="permission"
              type="checkbox"
              class="accent-[#9c4e8b]"
              @change="savePermissions(detailsUser)"
            />
            {{ permissionLabels[permission] }}
          </label>
        </div>
      </div>
      <div class="mt-6 border-t border-gray-100 pt-4">
        <h3 class="font-bold text-gray-900">Activity log</h3>
        <p
          v-if="!detailsUser.activityLog?.length"
          class="mt-3 text-sm text-gray-400"
        >
          No recorded activity.
        </p>
        <ul v-else class="mt-3 space-y-2">
          <li
            v-for="entry in [...detailsUser.activityLog].reverse()"
            :key="entry._id || entry.createdAt"
            class="rounded-lg bg-gray-50 p-3 text-sm"
          >
            <span class="font-semibold text-gray-700">{{ entry.action }}</span
            ><span class="ml-2 text-gray-400">{{
              formatDate(entry.createdAt)
            }}</span>
            <p v-if="entry.details" class="mt-1 text-gray-500">
              {{ entry.details }}
            </p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
const { users, fetchUsers } = totalUsers();
const { user, token } = useAuth();

const selectedRole = ref("all");
const searchQuery = ref("");
const showModal = ref(false);
const selectedUsers = ref([]);
const detailsUser = ref(null);
const adminPermissions = [
  "users",
  "events",
  "reports",
  "notifications",
  "settings",
];
const permissionLabels = {
  users: "Manage users",
  events: "Manage events",
  reports: "View reports",
  notifications: "Manage notifications",
  settings: "Manage settings",
};

const selectAll = computed({
  get: () =>
    filteredUsers.value.length > 0 &&
    filteredUsers.value.every((person) =>
      selectedUsers.value.includes(person._id),
    ),
  set: (selected) => {
    selectedUsers.value = selected
      ? [
          ...new Set([
            ...selectedUsers.value,
            ...filteredUsers.value.map((person) => person._id),
          ]),
        ]
      : selectedUsers.value.filter(
          (id) => !filteredUsers.value.some((person) => person._id === id),
        );
  },
});

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

const openDetails = (person) => {
  detailsUser.value = {
    ...person,
    permissions: [...(person.permissions || [])],
  };
};

const savePermissions = (person) => runAction(person, "permissions");

const runAction = async (person, action, role) => {
  if (
    action === "delete" &&
    !window.confirm(`Delete ${person.firstName} ${person.lastName}?`)
  )
    return;
  try {
    await $fetch("/api/admin/users", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { id: person._id, action, role, permissions: person.permissions },
    });
    await fetchUsers();
    detailsUser.value =
      action === "delete"
        ? null
        : users.value.find((item) => item._id === person._id) || null;
  } catch (error) {
    window.alert(error?.data?.statusMessage || "Unable to update user.");
  }
};

const runBulkAction = async (action) => {
  if (
    action === "delete" &&
    !window.confirm(`Delete ${selectedUsers.value.length} users?`)
  )
    return;
  try {
    await $fetch("/api/admin/users", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { ids: selectedUsers.value, action },
    });
    selectedUsers.value = [];
    await fetchUsers();
  } catch (error) {
    window.alert(error?.data?.statusMessage || "Unable to update users.");
  }
};

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
