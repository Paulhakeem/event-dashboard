<template>
  <!-- Card Group -->
  <div class="relative z-1 bg-white dark:bg-neutral-800">
    <!-- Heading -->
    <div class="p-4 pb-0">
      <div
        class="pb-2 flex flex-wrap justify-between items-center gap-2 border-b border-dashed border-gray-200 dark:border-neutral-700"
      >
        <h2 class="font-medium text-sm text-gray-800 dark:text-neutral-200">
          Top authors
        </h2>

        <!-- Avatar Media -->
        <button
          type="button"
          class="group inline-flex items-center text-[13px] text-start text-gray-500 dark:text-neutral-500"
        >
          <span class="block me-1"> Next: </span>
          <span
            class="block text-gray-800 underline-offset-2 decoration-2 group-hover:underline group-hover:text-indigo-700 group-focus:underline group-focus:text-indigo-700 dark:text-neutral-200 group-hover:text-indigo-400 group-focus:text-indigo-400"
          >
            Niki Kray
          </span>
          <svg
            class="shrink-0 size-4 ms-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
        <!-- End Avatar Media -->
      </div>
    </div>
    <!-- End Heading -->

    <!-- Body -->
    <div class="p-4">
      <!-- Profile -->
      <div class="flex items-center gap-x-3">
        <span
          class="relative size-14 shrink-0 bg-gray-100 rounded-full dark:bg-neutral-700"
        >
          <img
            class="absolute inset-0 size-full object-cover rounded-full"
            src="https://images.unsplash.com/photo-1719937206140-c4b208c78aa7?q=80&w=160&h=160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Post Image"
          />
        </span>
        <div class="grow">
          <h3 class="font-medium text-lg text-gray-800 dark:text-neutral-200">
            Brian Williams
          </h3>
        </div>
      </div>
      <!-- End Profile -->

      <!-- Grid List -->
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
        <!-- Item -->
        <div class="flex flex-col gap-y-1">
          <span class="text-[13px] text-gray-500 dark:text-neutral-500">
            Published posts:
          </span>

          <div class="flex items-center gap-x-1.5">
            <svg
              class="shrink-0 size-4 text-gray-800 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"
              />
              <path d="M2 6h4" />
              <path d="M2 10h4" />
              <path d="M2 14h4" />
              <path d="M2 18h4" />
              <path
                d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
              />
            </svg>

            <span
              class="font-medium text-sm text-gray-800 dark:text-neutral-200"
            >
              48
            </span>
          </div>
        </div>
        <!-- End Item -->

        <!-- Item -->
        <div class="flex flex-col gap-y-1">
          <span class="text-[13px] text-gray-500 dark:text-neutral-500">
            Avg. post views:
          </span>

          <div class="flex items-center gap-x-1.5">
            <svg
              class="shrink-0 size-4 text-gray-800 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>

            <span
              class="font-medium text-sm text-gray-800 dark:text-neutral-200"
            >
              285
            </span>
          </div>
        </div>
        <!-- End Item -->

        <!-- Item -->
        <div class="flex flex-col gap-y-1">
          <span class="text-[13px] text-gray-500 dark:text-neutral-500">
            Total comments:
          </span>

          <div class="flex items-center gap-x-1.5">
            <svg
              class="shrink-0 size-4 text-gray-800 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>

            <span
              class="font-medium text-sm text-gray-800 dark:text-neutral-200"
            >
              18
            </span>
          </div>
        </div>
        <!-- End Item -->

        <!-- Item -->
        <div class="flex flex-col gap-y-1">
          <span class="text-[13px] text-gray-500 dark:text-neutral-500">
            Posts referred:
          </span>

          <div class="flex items-center gap-x-1.5">
            <svg
              class="shrink-0 size-4 text-gray-800 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"
              />
              <path d="m21 3-9 9" />
              <path d="M15 3h6v6" />
            </svg>

            <span
              class="font-medium text-sm text-gray-800 dark:text-neutral-200"
            >
              62
            </span>
          </div>
        </div>
        <!-- End Item -->
      </div>
      <!-- End Grid List -->

      <!-- Card -->
      <div class="pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
        <!-- Header -->
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col">
            <!-- Avatar Group -->
            <div class="my-3 flex -space-x-3">
              <img
                class="shrink-0 size-6 relative z-2 ring-2 ring-white rounded-full dark:ring-neutral-800"
                src="https://images.unsplash.com/photo-1708443683276-8a3eb30faef2?q=80&w=160&h=160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Avatar"
              />
              <img
                class="shrink-0 size-6 relative z-1 -mt-3 ring-2 ring-white rounded-full dark:ring-neutral-800"
                src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                alt="Avatar"
              />
              <img
                class="shrink-0 size-6 relative ring-2 ring-white rounded-full dark:ring-neutral-800"
                src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                alt="Avatar"
              />
            </div>
            <!-- End Avatar Group -->

            <h3 class="text-sm text-gray-500 dark:text-neutral-500">
              Total views
            </h3>

            <p class="text-xl text-gray-800 dark:text-neutral-200">1,420</p>
          </div>
          <!-- End Col -->

          <!-- Apex Chart -->
          <div id="hs-pro-atatpvch" class="min-h-22.5"></div>
        </div>
        <!-- End Header -->

        <div class="mt-3">
          <a
            class="inline-flex items-center gap-x-0.5 text-[13px] text-indigo-700 underline underline-offset-2 hover:decoration-2 focus:outline-hidden focus:decoration-2 disabled:opacity-50 disabled:pointer-events-none dark:text-indigo-400"
            href="#"
          >
            View all
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
        </div>
      </div>
      <!-- End Card -->

      <!-- Card -->
      <div class="pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
        <!-- Progress Content -->
        <div class="relative flex items-center gap-1">
          <!-- Circular Progress -->
          <svg
            class="shrink-0 size-12"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(32,32)">
              <g>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(0)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(30)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(60)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(90)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(120)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(150)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(180)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(210)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(240)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(270)"
                  class="text-indigo-700 dark:text-indigo-400"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(300)"
                  class="text-white dark:text-neutral-800"
                ></rect>
                <rect
                  x="-3"
                  y="-28"
                  width="6"
                  height="14"
                  rx="3"
                  fill="currentColor"
                  transform="rotate(330)"
                  class="text-white dark:text-neutral-800"
                ></rect>
              </g>
            </g>
          </svg>
          <!-- End Circular Progress -->

          <div class="grow pe-20">
            <div class="flex flex-col">
              <span
                class="block text-[13px] text-gray-500 dark:text-neutral-500"
              >
                Content quality score
              </span>
              <div class="flex items-center gap-2">
                <span
                  class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
                >
                  76%
                </span>
                <span
                  class="flex justify-center items-center gap-x-1 text-sm text-green-600 dark:text-green-500"
                >
                  <svg
                    class="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m5 12 7-7 7 7"></path>
                    <path d="M12 19V5"></path>
                  </svg>
                  3.4%
                </span>
              </div>
            </div>
          </div>

          <!-- Button -->
          <div class="absolute top-1/2 end-0 -translate-y-1/2">
            <button
              type="button"
              class="group size-7 lg:size-auto lg:py-1.5 lg:px-2 flex items-center justify-center border border-gray-200 text-gray-600 text-xs rounded-full py-1 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 focus:outline-none focus:bg-indigo-50 focus:border-indigo-100 focus:text-indigo-700 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-indigo-500/20 dark:hover:border-indigo-500/20 dark:hover:text-indigo-400 dark:focus:bg-indigo-500/20 dark:focus:border-indigo-500/20 dark:focus:text-indigo-400"
            >
              <span
                class="lg:block hidden max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:me-1 group-hover:max-w-25 group-hover:opacity-100 group-focus:me-1 group-focus:max-w-25 group-focus:opacity-100"
              >
                View all
              </span>
              <svg
                class="shrink-0 size-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 3h6v6" />
                <path d="m21 3-7 7" />
                <path d="m3 21 7-7" />
                <path d="M9 21H3v-6" />
              </svg>
            </button>
          </div>
          <!-- End Button -->
        </div>
        <!-- End Progress Content -->

        <!-- List Group -->
        <ul class="mt-5 flex flex-col gap-y-3">
          <!-- List Item -->
          <li class="flex justify-between items-center gap-x-2">
            <div class="flex flex-col gap-y-1">
              <span
                class="block text-[13px] text-gray-500 dark:text-neutral-500"
              >
                Title/subject length
              </span>
              <span
                class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
              >
                50-60
              </span>
            </div>
            <!-- End Col -->

            <div class="flex flex-col justify-end items-end gap-1">
              <div class="flex justify-end items-center gap-1">
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
              </div>

              <p class="text-[13px] text-indigo-700 dark:text-indigo-400">
                Good
              </p>
            </div>
            <!-- End Col -->
          </li>
          <!-- End List Item -->

          <!-- List Item -->
          <li class="flex justify-between items-center gap-x-2">
            <div class="flex flex-col gap-y-1">
              <span
                class="block text-[13px] text-gray-500 dark:text-neutral-500"
              >
                Body word count
              </span>
              <span
                class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
              >
                300–800
              </span>
            </div>
            <!-- End Col -->

            <div class="flex flex-col justify-end items-end gap-1">
              <div class="flex justify-end items-center gap-1">
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
              </div>

              <p class="text-[13px] text-indigo-700 dark:text-indigo-400">
                Good
              </p>
            </div>
            <!-- End Col -->
          </li>
          <!-- End List Item -->

          <!-- List Item -->
          <li class="flex justify-between items-center gap-x-2">
            <div class="flex flex-col gap-y-1">
              <span
                class="block text-[13px] text-gray-500 dark:text-neutral-500"
              >
                Tags/keywords
              </span>
              <span
                class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
              >
                3-8
              </span>
            </div>
            <!-- End Col -->

            <div class="flex flex-col justify-end items-end gap-1">
              <div class="flex justify-end items-center gap-1">
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
              </div>

              <p class="text-[13px] text-indigo-700 dark:text-indigo-400">
                Good
              </p>
            </div>
            <!-- End Col -->
          </li>
          <!-- End List Item -->

          <!-- List Item -->
          <li class="flex justify-between items-center gap-x-2">
            <div class="flex flex-col gap-y-1">
              <span
                class="block text-[13px] text-gray-500 dark:text-neutral-500"
              >
                Broken links
              </span>
              <span
                class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
              >
                2
              </span>
            </div>
            <!-- End Col -->

            <div class="flex flex-col justify-end items-end gap-1">
              <div class="flex justify-end items-center gap-1">
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-orange-500 rounded-full dark:bg-orange-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-orange-500 rounded-full dark:bg-orange-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"
                ></span>
              </div>

              <p class="text-sm text-orange-500 dark:text-orange-400">Poor</p>
            </div>
            <!-- End Col -->
          </li>
          <!-- End List Item -->

          <!-- List Item -->
          <li class="flex justify-between items-center gap-x-2">
            <div class="flex flex-col gap-y-1">
              <span
                class="block text-[13px] text-gray-500 dark:text-neutral-500"
              >
                Spelling & grammar
              </span>
              <span
                class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
              >
                100%
              </span>
            </div>
            <!-- End Col -->

            <div class="flex flex-col justify-end items-end gap-1">
              <div class="flex justify-end items-center gap-1">
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
                <span
                  class="shrink-0 w-1 h-3.5 inline-block bg-indigo-700 rounded-full dark:bg-indigo-400"
                ></span>
              </div>

              <p class="text-[13px] text-indigo-700 dark:text-indigo-400">
                Good
              </p>
            </div>
            <!-- End Col -->
          </li>
          <!-- End List Item -->
        </ul>
        <!-- End List Group -->
      </div>
      <!-- End Card -->
    </div>
    <!-- End Body -->
  </div>
  <!-- End Card Group -->
</template>

<script setup></script>
