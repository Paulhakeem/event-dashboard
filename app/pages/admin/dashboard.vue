<template>
<div>
  <!-- ========== HEADER ========== -->
<header class="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 w-full bg-gray-700 border-b border-gray-200 text-sm py-2.5 lg:ps-65 dark:bg-neutral-800 dark:border-neutral-700">
  <nav class="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
    <div class="me-5 lg:me-0 lg:hidden flex items-center">
      <!-- Logo -->
      <a class="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" href="#" aria-label="Preline">
       <h1>Event</h1>
      </a>
      <!-- End Logo -->

      <div class="lg:hidden ms-1">
        <!-- Templates Dropdown -->
        <div class="hs-dropdown  relative  [--scope:window] [--auto-close:inside] inline-flex">
          <button id="hs-dropdown-preview-navbar" type="button" class="hs-dropdown-toggle  group relative flex justify-center items-center size-8 text-xs rounded-full text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
          	<span class="">
        	    <svg class=" size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        	  </span>

            <span class="absolute -top-0.5 -end-0.5">
              <span class="relative flex">
                <span class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 dark:bg-red-600 opacity-75"></span>
                <span class="relative inline-flex size-2 bg-red-500 rounded-full"></span>
                <span class="sr-only">Notification</span>
              </span>
            </span>
          </button>

          <!-- Dropdown -->
          <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-full min-w-90 md:w-125 transition-[opacity,margin] duration opacity-0 hidden z-61 overflow-hidden border border-gray-200 bg-white rounded-xl shadow-xl dark:bg-neutral-800 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-preview-navbar">
          	<!-- Tab -->
          	<div class="p-3 pb-0 flex flex-wrap justify-between items-center gap-3 border-b border-gray-200 dark:border-neutral-700">
            	<!-- Nav Tab -->
            	<nav  class="flex gap-1" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
            	  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden " id="hs-pmn-item-pro" aria-selected="false" data-hs-tab="#hs-pmn-pro" aria-controls="hs-pmn-pro" role="tab" >
            	    Pro
            	  </button>
            	  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden active" id="hs-pmn-item-free" aria-selected="true" data-hs-tab="#hs-pmn-free" aria-controls="hs-pmn-free" role="tab" >
            	    Free
            	  </button>
            	</nav>
            	<!-- End Nav Tab -->
            </div>
            <!-- End Tab -->

            <!-- Tab Content -->
            <div id="hs-pmn-pro" class="hidden" role="tabpanel" aria-labelledby="hs-pmn-item-pro">
        	    <!-- Header -->
        	  	<div class="p-3 flex flex-wrap justify-between items-center gap-3">
        	    	<span class="block font-semibold text-sm text-gray-800 dark:text-neutral-200">Templates (21)</span>

        	      <div class="ms-auto">
        	      	<a class="group py-2 px-2.5 rounded-md flex items-center gap-x-1 text-[13px] bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-900 dark:bg-white dark:hover:bg-neutral-200 dark:focus:bg-neutral-200 dark:text-neutral-800" href="../pro/pricing.html">
        						Purchase
        						<svg class="hidden md:inline-block shrink-0 size-3.5 group-hover:translate-x-0.5 transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Header -->

        	    <!-- Body -->
        	    <div class="px-3 max-h-64 sm:max-h-100 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        	    	<!-- Grid -->
        	      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/dashboard/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img1.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img1.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Dashboard
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/cms/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img55.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img55.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    CMS
        					  </p>

        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/ai-chat/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img58.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img58.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    AI Chat
        					  </p>

        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/video-call/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img61.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img61.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Video Call
        					  </p>

        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/startup/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img32.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img32.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Startup
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/payment/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img8.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img8.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Payment
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/chat/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img16.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img16.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Chat
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/shop/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img21.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img21.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Shop
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/ecommerce/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img4.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img4.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    E-Commerce
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/agency/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img46.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img46.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Agency
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/crm/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img11.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img11.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    CRM
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/workspace/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img18.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img18.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Workspace
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/analytics/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img9.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img9.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Analytics
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/calendars/day.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img14.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img14.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Calendars
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/smart-home/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img35.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img35.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Smart Home
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/coffee-shop/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img52.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img52.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Coffee Shop
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/inbox/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img26.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img26.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Inbox
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/project/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img10.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img10.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Project
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/shop-marketplace/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img29.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img29.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Shop Marketplace
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/personal/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img49.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img49.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Personal
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/files/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img12.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img12.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Files
        					  </p>
        					</a>
        					<!-- End Link -->
        	    	</div>
        	    	<!-- End Grid -->
        	  	</div>
        	  	<!-- Body -->

        	  	<!-- Footer -->
        	    <div class="p-3 flex flex-wrap justify-center items-center gap-0.5">
        	    	<div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../pro/index.html">
        	          Main page
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../pro/examples.html">
        	          Examples (780<!-- (780) -->)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../pro/templates.html">
        	          Templates (21)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Footer -->
        	  </div>
        	  <!-- End Tab Content -->

        	  <!-- Tab Content -->
            <div id="hs-pmn-free" class="" role="tabpanel" aria-labelledby="hs-pmn-item-free">
            	<!-- Header -->
        	  	<div class="p-3 flex flex-wrap justify-between items-center gap-3">
        	    	<span class="block font-semibold text-sm text-gray-800 dark:text-neutral-200">Templates (5)</span>

        	      <div class="ms-auto">
        	      	<a class="group py-2 px-2.5 rounded-md flex items-center gap-x-1 text-[13px] bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-900 dark:bg-white dark:hover:bg-neutral-200 dark:focus:bg-neutral-200 dark:text-neutral-800" href="../templates.html">
        						Free download
        						<svg class="hidden md:inline-block shrink-0 size-3.5 group-hover:translate-x-0.5 transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Header -->

        	    <!-- Body -->
        	    <div class="px-3 max-h-64 sm:max-h-100 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        	    	<!-- Grid -->
        	      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/agency/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img1.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img1.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Agency
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/ai-chat/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img4.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img4.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            AI Chat
        	          </p>

        	         
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/cms/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img5.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img5.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            CMS
        	          </p>

        	          <div class="absolute -top-px end-[3px]">
        	            <span class="py-0.5 px-2 inline-flex items-center gap-x-1.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full dark:bg-emerald-900 dark:text-emerald-500">New</span>
        	          </div>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/coffee-shop/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img2.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img2.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Coffee Shop
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/personal/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img3.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img3.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Personal
        	          </p>
        	        </a>
        	        <!-- End Link -->
        	    	</div>
        	    	<!-- End Grid -->
        	  	</div>
        	  	<!-- Body -->

        	  	<!-- Footer -->
        	    <div class="p-3 flex flex-wrap justify-center items-center gap-0.5">
        	    	<div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../index.html">
        	          Main page
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../examples.html">
        	          Examples (220+<!-- 222 -->)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../templates.html">
        	          Templates (5)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Footer -->
            </div>
        	  <!-- End Tab Content -->
          </div>
          <!-- End Dropdown -->
        </div>
        <!-- End Templates Dropdown -->
      </div>
    </div>

    <div class="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">

      <div class="hidden md:block">
        <!-- Search Input -->
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
            <svg class="shrink-0 size-4 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input type="text" class="py-2 ps-10 pe-16 block w-full bg-white border-gray-200 rounded-lg text-sm focus:outline-hidden focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600" placeholder="Search">
          <div class="hidden absolute inset-y-0 end-0 flex items-center z-20 pe-1">
            <button type="button" class="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" aria-label="Close">
              <span class="sr-only">Close</span>
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            </button>
          </div>
          <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
            <svg class="shrink-0 size-3 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
            <span class="mx-1">
              <svg class="shrink-0 size-3 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </span>
            <span class="text-xs">/</span>
          </div>
        </div>
        <!-- End Search Input -->
      </div>

      <div class="flex flex-row items-center justify-end gap-1">
        <button type="button" class="md:hidden size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span class="sr-only">Search</span>
        </button>

        <button type="button" class="size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="sr-only">Notifications</span>
        </button>

        <button type="button" class="size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span class="sr-only">Activity</span>
        </button>

        <!-- Dropdown -->
        <div class="hs-dropdown [--placement:bottom-right] relative inline-flex">
          <button id="hs-dropdown-account" type="button" class="size-9.5 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none dark:text-white" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
            <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
          </button>

          <div class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-account">
            <div class="py-3 px-5 bg-gray-100 rounded-t-lg dark:bg-neutral-700">
              <p class="text-sm text-gray-500 dark:text-neutral-500">Signed in as</p>
              <p class="text-sm font-medium text-gray-800 dark:text-neutral-200">james@site.com</p>
            </div>
            <div class="p-1.5 space-y-0.5">
              <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                Newsletter
              </a>
              <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Purchases
              </a>
              <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
                Downloads
              </a>
              <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" href="#">
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Team Account
              </a>
            </div>
          </div>
        </div>
        <!-- End Dropdown -->
      </div>
    </div>
  </nav>
</header>
<!-- ========== END HEADER ========== -->

<!-- ========== MAIN CONTENT ========== -->
<!-- Breadcrumb -->
<div class="sticky top-0 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
  <div class="flex items-center py-2">
    <!-- Navigation Toggle -->
    <button type="button" class="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-application-sidebar" aria-label="Toggle navigation" data-hs-overlay="#hs-application-sidebar">
      <span class="sr-only">Toggle Navigation</span>
      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
    </button>
    <!-- End Navigation Toggle -->

    <!-- Breadcrumb -->
    <ol class="ms-3 flex items-center whitespace-nowrap">
      <li class="flex items-center text-sm text-gray-800 dark:text-neutral-400">
        Application Layout
        <svg class="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </li>
      <li class="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400" aria-current="page">
        Dashboard
      </li>
    </ol>
    <!-- End Breadcrumb -->
  </div>
</div>
<!-- End Breadcrumb -->

<!-- Sidebar -->
<div id="hs-application-sidebar" class="hs-overlay  [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-65 h-full
  hidden
  fixed inset-y-0 start-0 z-60
  bg-white border-e border-gray-200
  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
  dark:bg-neutral-800 dark:border-neutral-700" role="dialog" tabindex="-1" aria-label="Sidebar">
  <div class="relative flex flex-col h-full max-h-full">
    <div class="px-6 pt-4 flex items-center">
      <!-- Logo -->
      <a class="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" href="#" aria-label="Preline">
        <h1>Events</h1>
      </a>
      <!-- End Logo -->

      <div class="hidden lg:block ms-2">
        <!-- Templates Dropdown -->
        <div class="hs-dropdown  relative  [--scope:window] [--auto-close:inside] inline-flex">
          <button id="hs-dropdown-preview-sidebar" type="button" class="hs-dropdown-toggle  group relative flex justify-center items-center size-8 text-xs rounded-lg text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
          	<span class="">
        	    <svg class=" size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        	  </span>

            <span class="absolute -top-0.5 -end-0.5">
              <span class="relative flex">
                <span class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 dark:bg-red-600 opacity-75"></span>
                <span class="relative inline-flex size-2 bg-red-500 rounded-full"></span>
                <span class="sr-only">Notification</span>
              </span>
            </span>
          </button>

          <!-- Dropdown -->
          <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-full min-w-90 md:w-125 transition-[opacity,margin] duration opacity-0 hidden z-61 overflow-hidden border border-gray-200 bg-white rounded-xl shadow-xl dark:bg-neutral-800 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-preview-sidebar">
          	<!-- Tab -->
          	<div class="p-3 pb-0 flex flex-wrap justify-between items-center gap-3 border-b border-gray-200 dark:border-neutral-700">
            	<!-- Nav Tab -->
            	<nav  class="flex gap-1" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
            	  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden " id="hs-pms-item-pro" aria-selected="false" data-hs-tab="#hs-pms-pro" aria-controls="hs-pms-pro" role="tab" >
            	    Pro
            	  </button>
            	  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden active" id="hs-pms-item-free" aria-selected="true" data-hs-tab="#hs-pms-free" aria-controls="hs-pms-free" role="tab" >
            	    Free
            	  </button>
            	</nav>
            	<!-- End Nav Tab -->

        	    <!-- Switch/Toggle -->
              <div class="mb-2 flex items-center gap-x-0.5">
                <button type="button" class="hs-dark-mode hs-dark-mode-active:hidden flex shrink-0 justify-center items-center gap-x-1 text-xs text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" data-hs-theme-click-value="dark">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
                  Switch to Dark
                </button>
                <button type="button" class="hs-dark-mode hs-dark-mode-active:flex hidden shrink-0 justify-center items-center gap-x-1 text-xs text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" data-hs-theme-click-value="light">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
                  Switch to Light
                </button>
              </div>
              <!-- End Switch/Toggle -->
            </div>
            <!-- End Tab -->

            <!-- Tab Content -->
            <div id="hs-pms-pro" class="hidden" role="tabpanel" aria-labelledby="hs-pms-item-pro">
        	    <!-- Header -->
        	  	<div class="p-3 flex flex-wrap justify-between items-center gap-3">
        	    	<span class="block font-semibold text-sm text-gray-800 dark:text-neutral-200">Templates (21)</span>

        	      <div class="ms-auto">
        	      	<a class="group py-2 px-2.5 rounded-md flex items-center gap-x-1 text-[13px] bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-900 dark:bg-white dark:hover:bg-neutral-200 dark:focus:bg-neutral-200 dark:text-neutral-800" href="../pro/pricing.html">
        						Purchase
        						<svg class="hidden md:inline-block shrink-0 size-3.5 group-hover:translate-x-0.5 transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Header -->

        	    <!-- Body -->
        	    <div class="px-3 max-h-64 sm:max-h-100 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        	    	<!-- Grid -->
        	      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/dashboard/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img1.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img1.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Dashboard
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/cms/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img55.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img55.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    CMS
        					  </p>

        				
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/ai-chat/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img58.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img58.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    AI Chat
        					  </p>

        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/video-call/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img61.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img61.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Video Call
        					  </p>

        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/startup/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img32.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img32.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Startup
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/payment/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img8.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img8.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Payment
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/chat/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img16.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img16.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Chat
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/shop/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img21.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img21.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Shop
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/ecommerce/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img4.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img4.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    E-Commerce
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/agency/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img46.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img46.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Agency
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/crm/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img11.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img11.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    CRM
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/workspace/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img18.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img18.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Workspace
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/analytics/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img9.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img9.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Analytics
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/calendars/day.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img14.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img14.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Calendars
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/smart-home/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img35.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img35.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Smart Home
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/coffee-shop/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img52.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img52.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Coffee Shop
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/inbox/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img26.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img26.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Inbox
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/project/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img10.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img10.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Project
        					  </p>
        					</a>
        					<!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/shop-marketplace/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img29.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img29.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Shop Marketplace
        	          </p>
        	        </a>
        	        <!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/personal/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img49.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img49.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Personal
        					  </p>
        					</a>
        					<!-- End Link -->

        					<!-- Link -->
        					<a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../pro/files/index.html">
        					  <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews/img12.webp" alt="Main Page">
        					  <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/demo-previews-dark/img12.webp" alt="Main Page">

        					  <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        					    Files
        					  </p>
        					</a>
        					<!-- End Link -->
        	    	</div>
        	    	<!-- End Grid -->
        	  	</div>
        	  	<!-- Body -->

        	  	<!-- Footer -->
        	    <div class="p-3 flex flex-wrap justify-center items-center gap-0.5">
        	    	<div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../pro/index.html">
        	          Main page
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../pro/examples.html">
        	          Examples (780<!-- (780) -->)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../pro/templates.html">
        	          Templates (21)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Footer -->
        	  </div>
        	  <!-- End Tab Content -->

        	  <!-- Tab Content -->
            <div id="hs-pms-free" class="" role="tabpanel" aria-labelledby="hs-pms-item-free">
            	<!-- Header -->
        	  	<div class="p-3 flex flex-wrap justify-between items-center gap-3">
        	    	<span class="block font-semibold text-sm text-gray-800 dark:text-neutral-200">Templates (5)</span>

        	      <div class="ms-auto">
        	      	<a class="group py-2 px-2.5 rounded-md flex items-center gap-x-1 text-[13px] bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-900 dark:bg-white dark:hover:bg-neutral-200 dark:focus:bg-neutral-200 dark:text-neutral-800" href="../templates.html">
        						Free download
        						<svg class="hidden md:inline-block shrink-0 size-3.5 group-hover:translate-x-0.5 transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Header -->

        	    <!-- Body -->
        	    <div class="px-3 max-h-64 sm:max-h-100 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        	    	<!-- Grid -->
        	      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/agency/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img1.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img1.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Agency
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/ai-chat/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img4.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img4.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            AI Chat
        	          </p>

        	     
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/cms/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img5.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img5.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            CMS
        	          </p>

        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/coffee-shop/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img2.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img2.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Coffee Shop
        	          </p>
        	        </a>
        	        <!-- End Link -->

        	        <!-- Link -->
        	        <a class="p-3 relative flex flex-col justify-center items-center gap-y-3 rounded-xl hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  transition" href="../templates/personal/index.html">
        	          <img class="dark:hidden w-28 rounded-lg shadow-xs" src="../assets/img/template-previews/img3.webp" alt="Main Page">
        	          <img class="hidden dark:block w-28 rounded-lg shadow-xs" src="../assets/img/template-previews-dark/img3.webp" alt="Main Page">

        	          <p class="text-sm text-center text-gray-800 dark:text-neutral-400">
        	            Personal
        	          </p>
        	        </a>
        	        <!-- End Link -->
        	    	</div>
        	    	<!-- End Grid -->
        	  	</div>
        	  	<!-- Body -->

        	  	<!-- Footer -->
        	    <div class="p-3 flex flex-wrap justify-center items-center gap-0.5">
        	    	<div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../index.html">
        	          Main page
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../examples.html">
        	          Examples (220+<!-- 222 -->)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	      <div class="relative ps-2 ms-1 first:ps-0 first:ms-0 first:before:hidden before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2 dark:before:bg-neutral-700">
        	        <a class="group flex items-center gap-x-1.5 py-1.5 px-2 rounded-md text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="../templates.html">
        	          Templates (5)
        	          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:transition" d="M5 12h14"/><path class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:transition" d="m12 5 7 7-7 7"/></svg>
        	        </a>
        	      </div>
        	    </div>
        	    <!-- End Footer -->
            </div>
        	  <!-- End Tab Content -->
          </div>
          <!-- End Dropdown -->
        </div>
        <!-- End Templates Dropdown -->
      </div>
    </div>

    <!-- Content -->
    <div class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <nav class="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
        <ul class="flex flex-col space-y-1">
          <li>
            <a class="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-white" href="#">
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Dashboard
            </a>
          </li>

          <li class="hs-accordion" id="users-accordion">
            <button type="button" class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" aria-expanded="true" aria-controls="users-accordion-child">
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Users

              <svg class="hs-accordion-active:block ms-auto hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>

              <svg class="hs-accordion-active:hidden ms-auto block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div id="users-accordion-child" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="users-accordion">
              <ul class="hs-accordion-group ps-8 pt-1 space-y-1" data-hs-accordion-always-open>
                <li class="hs-accordion" id="users-accordion-sub-1">
                  <button type="button" class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" aria-expanded="true" aria-controls="users-accordion-sub-1-child">
                    Sub Menu 1

                    <svg class="hs-accordion-active:block ms-auto hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>

                    <svg class="hs-accordion-active:hidden ms-auto block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </button>

                  <div id="users-accordion-sub-1-child" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="users-accordion-sub-1">
                    <ul class="pt-1 space-y-1">
                      <li>
                        <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                          Link 1
                        </a>
                      </li>
                      <li>
                        <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                          Link 2
                        </a>
                      </li>
                      <li>
                        <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                          Link 3
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li class="hs-accordion" id="users-accordion-sub-2">
                  <button type="button" class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" aria-expanded="true" aria-controls="users-accordion-sub-2-child">
                    Sub Menu 2

                    <svg class="hs-accordion-active:block ms-auto hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>

                    <svg class="hs-accordion-active:hidden ms-auto block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </button>

                  <div id="users-accordion-sub-2-child" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="users-accordion-sub-2">
                    <ul class="pt-1 space-y-1">
                      <li>
                        <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                          Link 1
                        </a>
                      </li>
                      <li>
                        <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                          Link 2
                        </a>
                      </li>
                      <li>
                        <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                          Link 3
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>

          <li class="hs-accordion" id="account-accordion">
            <button type="button" class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" aria-expanded="true" aria-controls="account-accordion-child">
              <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>
              Account

              <svg class="hs-accordion-active:block ms-auto hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>

              <svg class="hs-accordion-active:hidden ms-auto block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div id="account-accordion-child" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="account-accordion">
              <ul class="ps-8 pt-1 space-y-1">
                <li>
                  <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                    Link 1
                  </a>
                </li>
                <li>
                  <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                    Link 2
                  </a>
                </li>
                <li>
                  <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                    Link 3
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <li class="hs-accordion" id="projects-accordion">
            <button type="button" class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" aria-expanded="true" aria-controls="projects-accordion-child">
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Projects

              <svg class="hs-accordion-active:block ms-auto hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>

              <svg class="hs-accordion-active:hidden ms-auto block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div id="projects-accordion-child" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="projects-accordion">
              <ul class="ps-8 pt-1 space-y-1">
                <li>
                  <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                    Link 1
                  </a>
                </li>
                <li>
                  <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                    Link 2
                  </a>
                </li>
                <li>
                  <a class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
                    Link 3
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <li><a class="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            Calendar
          </a></li>
          <li><a class="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200" href="#">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Documentation
          </a></li>
        </ul>
      </nav>
    </div>
    <!-- End Content -->
  </div>
</div>
<!-- End Sidebar -->

<!-- Content -->
<div class="w-full lg:ps-64">
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Card -->
      <div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
              Total users
            </p>
            <div class="hs-tooltip">
              <div class="hs-tooltip-toggle">
                <svg class="shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs dark:bg-neutral-700" role="tooltip">
                  The number of daily users
                </span>
              </div>
            </div>
          </div>

          <div class="mt-1 flex items-center gap-x-2">
            <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
              72,540
            </h3>
            <span class="flex items-center gap-x-1 text-green-600">
              <svg class="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              <span class="inline-block text-sm">
                1.7%
              </span>
            </span>
          </div>
        </div>
      </div>
      <!-- End Card -->

      <!-- Card -->
      <div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
              Sessions
            </p>
          </div>

          <div class="mt-1 flex items-center gap-x-2">
            <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
              29.4%
            </h3>
          </div>
        </div>
      </div>
      <!-- End Card -->

      <!-- Card -->
      <div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
              Avg. Click Rate
            </p>
          </div>

          <div class="mt-1 flex items-center gap-x-2">
            <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
              56.8%
            </h3>
            <span class="flex items-center gap-x-1 text-red-600">
              <svg class="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
              <span class="inline-block text-sm">
                1.7%
              </span>
            </span>
          </div>
        </div>
      </div>
      <!-- End Card -->

      <!-- Card -->
      <div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <div class="p-4 md:p-5">
          <div class="flex items-center gap-x-2">
            <p class="text-xs uppercase text-gray-500 dark:text-neutral-500">
              Pageviews
            </p>
          </div>

          <div class="mt-1 flex items-center gap-x-2">
            <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
              92,913
            </h3>
          </div>
        </div>
      </div>
      <!-- End Card -->
    </div>
    <!-- End Grid -->

    <div class="grid lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Card -->
      <div class="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <!-- Header -->
        <div class="flex flex-wrap justify-between items-center gap-2">
          <div>
            <h2 class="text-sm text-gray-500 dark:text-neutral-500">
              Income
            </h2>
            <p class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
              $126,238.49
            </p>
          </div>

          <div>
            <span class="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500">
              <svg class="inline-block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
              25%
            </span>
          </div>
        </div>
        <!-- End Header -->

        <div id="hs-multiple-bar-charts"></div>
      </div>
      <!-- End Card -->

        <!-- Card -->
        <div class="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <!-- Header -->
          <div class="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 class="text-sm text-gray-500 dark:text-neutral-500">
                Visitors
              </h2>
              <p class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                80.3k
              </p>
            </div>

            <div>
              <span class="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500">
                <svg class="inline-block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                2%
              </span>
            </div>
          </div>
          <!-- End Header -->

          <div id="hs-single-area-chart"></div>
        </div>
        <!-- End Card -->
      </div>

      <!-- Card -->
      <div class="flex flex-col">
        <div class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <div class="min-w-full inline-block align-middle">
            <div class="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
              <!-- Header -->
              <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <div>
                  <h2 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Users
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-neutral-400">
                    Add users, edit and more.
                  </p>
                </div>

                <div>
                  <div class="inline-flex gap-x-2">
                    <a class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                      View all
                    </a>

                    <a class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#">
                      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      Add user
                    </a>
                  </div>
                </div>
              </div>
              <!-- End Header -->

              <!-- Table -->
              <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead class="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th scope="col" class="ps-6 py-3 text-start">
                      <label for="hs-at-with-checkboxes-main" class="flex">
                        <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-main">
                        <span class="sr-only">Checkbox</span>
                      </label>
                    </th>

                    <th scope="col" class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Name
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Position
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Status
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Portfolio
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                      <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Created
                        </span>
                      </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-end"></th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-1" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-1">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Christina Bersh</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">christina@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Director</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Human resources</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">1/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">28 Dec, 12:12</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-2" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-2">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">David Harrison</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">david@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Seller</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Branding products</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                          Warning
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">3/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 78%" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">20 Dec, 09:27</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-3" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-3">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="inline-flex items-center justify-center size-9.5 rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                            <span class="font-medium text-sm text-gray-800 dark:text-neutral-200">A</span>
                          </span>
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Anne Richard</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">anne@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Designer</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">IT department</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">5/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">18 Dec, 15:20</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-4" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-4">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Samia Kartoon</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">samia@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Executive director</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Marketing</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">0/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 1%" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">18 Dec, 15:20</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-5" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-5">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="inline-flex items-center justify-center size-9.5 rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                            <span class="font-medium text-sm text-gray-800 dark:text-neutral-200">D</span>
                          </span>
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">David Harrison</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">david@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Developer</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Mobile app</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                          Danger
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">3/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 78%" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">15 Dec, 14:41</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-6" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-6">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Brian Halligan</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">brian@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Accountant</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Finance</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">2/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">11 Dec, 18:51</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-7" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-7">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Andy Clerk</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">andy@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Director</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Human resources</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">1/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">28 Dec, 12:12</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-8" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-8">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Bart Simpson</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">Bart@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Seller</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Branding products</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                          Warning
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">3/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 78%" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">20 Dec, 09:27</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-9" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-9">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="inline-flex items-center justify-center size-9.5 rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                            <span class="font-medium text-sm text-gray-800 dark:text-neutral-200">C</span>
                          </span>
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Camila Welters</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">cwelt@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Designer</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">IT department</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">5/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">18 Dec, 15:20</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-10" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-10">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Oliver Schevich</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">oliver@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Seller</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Branding products</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                          Warning
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">3/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 78%" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">20 Dec, 09:27</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-11" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-11">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="inline-flex items-center justify-center size-9.5 rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                            <span class="font-medium text-sm text-gray-800 dark:text-neutral-200">I</span>
                          </span>
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Inna Ivy</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">invy@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Designer</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">IT department</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">5/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">18 Dec, 15:20</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 py-3">
                        <label for="hs-at-with-checkboxes-12" class="flex">
                          <input type="checkbox" class="shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-12">
                          <span class="sr-only">Checkbox</span>
                        </label>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <img class="inline-block size-9.5 rounded-full" src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
                          <div class="grow">
                            <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Jessica Williams</span>
                            <span class="block text-sm text-gray-500 dark:text-neutral-500">myhairisred@site.com</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="h-px w-72 whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="block text-sm font-semibold text-gray-800 dark:text-neutral-200">Executive director</span>
                        <span class="block text-sm text-gray-500 dark:text-neutral-500">Marketing</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                          <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          Active
                        </span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <div class="flex items-center gap-x-3">
                          <span class="text-xs text-gray-500 dark:text-neutral-500">0/5</span>
                          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                            <div class="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200" role="progressbar" style="width: 1%" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-3">
                        <span class="text-sm text-gray-500 dark:text-neutral-500">18 Dec, 15:20</span>
                      </div>
                    </td>
                    <td class="size-px whitespace-nowrap">
                      <div class="px-6 py-1.5">
                        <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">
                          Edit
                        </a>
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
                    <span class="font-semibold text-gray-800 dark:text-neutral-200">12</span> results
                  </p>
                </div>

                <div>
                  <div class="inline-flex gap-x-2">
                    <button type="button" class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Prev
                    </button>

                    <button type="button" class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                      Next
                      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <!-- End Footer -->
            </div>
          </div>
        </div>
      </div>
      <!-- End Card -->
    </div>
  </div>
  <!-- End Content -->
</div>

 
</template>

