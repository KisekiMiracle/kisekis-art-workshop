<script setup lang="ts">
import * as z from "zod";

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

type Schema = z.infer<typeof schema>;

// ── State ─────────────────────────────────────────────────────────────────────

const state = reactive<Schema>({
  email: "",
  password: "",
});

// fieldErrors holds per-field messages from Zod; formError holds a general one.
const fieldErrors = reactive<Partial<Record<keyof Schema, string>>>({});
const formError = ref<string | null>(null);
const isLoading = ref(false);

// ── Helpers ───────────────────────────────────────────────────────────────────

function clearErrors() {
  formError.value = null;
  Object.keys(fieldErrors).forEach(
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    (k) => delete fieldErrors[k as keyof Schema],
  );
}

// ── Submit ────────────────────────────────────────────────────────────────────

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  clearErrors();

  // 1. Validate with Zod
  const result = schema.safeParse(state);

  if (!result.success) {
    // Map each Zod issue to the corresponding field
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof Schema;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return;
  }

  // 2. Submit (replace with your actual API call / useFetch / $fetch)
  try {
    isLoading.value = true;
    await $fetch("/api/auth/signin", {
      method: "POST",
      body: result.data,
    });
    await navigateTo("/workshop");
  } catch (err) {
    // Nuxt's $fetch throws an FetchError with a `data` property
    if (err instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error:
      formError.value = err.data.message;
    } else {
      formError.value = "Something went wrong. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>Enter your email below to sign in.</CardDescription>
    </CardHeader>

    <CardContent>
      <form class="grid w-full items-center gap-4" @submit="handleSubmit">
        <!-- Email -->
        <div class="flex flex-col space-y-1.5">
          <Label for="email">Email</Label>
          <InputGroup>
            <InputGroupInput
              id="email"
              v-model="state.email"
              name="email"
              type="email"
              placeholder="your@email.com"
              :aria-invalid="!!fieldErrors.email"
            />
            <InputGroupAddon>
              <Icon name="mdi:email-outline" class="mt-0.5" />
            </InputGroupAddon>
          </InputGroup>
          <p v-if="fieldErrors.email" class="text-xs text-red-500">
            {{ fieldErrors.email }}
          </p>
        </div>

        <!-- Password -->
        <div class="flex flex-col space-y-1.5">
          <div class="flex justify-between">
            <Label for="password">Password</Label>
            <NuxtLink to="/forgot-password" class="text-xs underline">
              Forgot password?
            </NuxtLink>
          </div>
          <InputGroup>
            <InputGroupInput
              id="password"
              v-model="state.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="********"
              :aria-invalid="!!fieldErrors.password"
            />
            <InputGroupAddon>
              <Icon name="mdi:lock" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                class="hover:cursor-pointer"
                @click="togglePassword"
              >
                <Icon v-if="!showPassword" name="mdi:eye" />
                <Icon v-else name="mdi:eye-off" />
              </button>
            </InputGroupAddon>
          </InputGroup>
          <p v-if="fieldErrors.password" class="text-xs text-red-500">
            {{ fieldErrors.password }}
          </p>
        </div>

        <!-- General form error -->
        <p
          v-if="formError"
          class="text-sm text-red-700 bg-red-50 py-2 rounded-md flex items-center gap-2 justify-center"
        >
          <Icon name="mdi:warning" />
          {{ formError }}
        </p>

        <Button class="w-full" type="submit" :disabled="isLoading">
          {{ isLoading ? "Logging you in…" : "Sign up" }}
        </Button>
      </form>
    </CardContent>

    <CardFooter class="flex flex-col gap-2">
      <NuxtLink class="text-xs underline text-neutral-500" to="/signup">
        Don't have an account? Create one!
      </NuxtLink>
    </CardFooter>
  </Card>
</template>
