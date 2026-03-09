<script setup lang="ts">
const counter = ref(0);
const increaseCounter = () => counter.value++;
</script>

<template>
  <div class="flex flex-col gap-2 w-fit">
    <span><strong>Counter:</strong> {{ counter }}</span>
    <Button type="button" @click="increaseCounter">Click me~!</Button>
  </div>
</template>
