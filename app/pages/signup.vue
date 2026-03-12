<script setup lang="ts">
useHead({
  title: "Sign Up | Kiseki's Art Workshop",
});
definePageMeta({
  layout: "default",
});
</script>

<template>
  <section class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <a href="#" class="flex items-center gap-2 font-medium">
          <div
            class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
          >
            <Icon name="mdi:lead-pencil" class="size-4" />
          </div>
          Kiseki's Art Workshop
        </a>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <FormSignup />
        </div>
      </div>
    </div>
    <div class="bg-muted relative hidden lg:block">
      <img
        src="https://picsum.photos/1200"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </section>
</template>
