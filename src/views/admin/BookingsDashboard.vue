<template>
  <div class="bookings-dashboard">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Bookings Dashboard</h1>
      <p class="text-gray-600">View and manage all tour bookings</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Total Bookings</div>
        <div class="text-2xl font-bold">0</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Confirmed</div>
        <div class="text-2xl font-bold text-green-600">0</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Pending</div>
        <div class="text-2xl font-bold text-yellow-600">0</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Total Revenue</div>
        <div class="text-2xl font-bold text-blue-600">$0</div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <p class="p-8 text-center text-gray-600">
        Bookings dashboard - connect to API to load bookings
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Implement bookings fetching and management
</script>
