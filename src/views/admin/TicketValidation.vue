<template>
  <div class="ticket-validation">
    <h1 class="text-2xl font-bold mb-6">Ticket Validation</h1>
    
    <div class="bg-white rounded-lg shadow p-8">
      <p class="text-gray-600">
        Scan QR codes or enter ticket numbers to validate tickets for tour check-in.
      </p>
      
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Enter Ticket Number
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="Enter ticket number..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Validate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Implement ticket validation via bookings API
</script>
