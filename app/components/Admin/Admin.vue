<template>
  <!-- component -->
  <div
    class="h-screen flex flex-wrap items-center justify-center w-full"
  >
    <div
      class="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white shadow-lg transform duration-200 easy-in-out"
    >
      <div class="h-32 overflow-hidden">
        <img class="w-full" src="/images/club.jpg" alt="" />

        <!-- close profile -->
      </div>
      <div class="flex justify-center px-5 -mt-12">
        <img
          class="h-32 w-32 bg-white p-2 rounded-full"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt=""
        />
      </div>
      <div class=" ">
        <div class="text-center px-14">
          <h2 class="text-gray-800 text-3xl font-bold">
            {{ user.firstName }} {{ user.lastName }}
          </h2>
          <p class="text-gray-500 mt-2">
            {{ user.email }}
          </p>
          <p class="font-semibold text-[#9c4e8b]">
            <span>Role: </span>
            {{ user.role }}
          </p>
        </div>
        <!-- Profile Information -->
        <div class="mt-4 flex justify-between px-8">
          <div class="text-gray-200 border bg-[#9c4e8b] px-5 py-2 rounded">
            <p>Phone No:</p>
            <span class="font-semibold"> +254 712345678 </span>
          </div>
          <div class="text-gray-200 border bg-[#9c4e8b] px-5 py-2 rounded">
            <p>Total Event Booked</p>
            <span class="font-semibold"> 220 </span>
          </div>
        </div>

        <hr class="mt-6" />
        <div class="flex bg-gray-50">
          <div class="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
            <p><span class="font-semibold">2.5 k </span> Events</p>
          </div>
          <div class="border"></div>
          <div class="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
            <p><span class="font-semibold">2.0 k </span>Users</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();
onMounted(() => {
  console.log(user);
});
const { profile, openProfile } = useAdminMenu();
</script>
