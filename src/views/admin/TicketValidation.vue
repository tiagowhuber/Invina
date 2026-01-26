<template>
  <div class="ticket-validation">
    <h1 class="text-2xl font-bold mb-6">Validación de Entradas</h1>
    
    <div class="bg-white rounded-lg shadow p-8">
      <p class="text-gray-600">
        Escanea códigos QR o ingresa números de entrada para validar entradas para el check-in del tour.
      </p>
      
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Ingresa Número de Entrada
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="Ingresa el número de entrada..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Validar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Implement ticket validation via bookings API
</script>
