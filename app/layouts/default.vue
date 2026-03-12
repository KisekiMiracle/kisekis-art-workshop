<script setup lang="ts">
import type { User } from "~/types/user";

const user = useState<User>("user");
if (user) {
  await navigateTo("/workshop");
}
</script>

<template>
  <main>
    <slot />
  </main>
</template>
