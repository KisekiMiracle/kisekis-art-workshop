<script setup lang="ts">
import type { User } from "~/types/user";

useHead({
  title: "Workshop | Kiseki's Art Workshop",
});
definePageMeta({
  layout: "workshop",
});

const user = useState<User>("user");
</script>

<template>
  <div>Hi, {{ user!.username }}</div>
</template>
