import type { User } from "~/types/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useState<User | null>("user", () => null);
  const protectedPrefixes = ["/workshop", "/settings"];
  const isProtected = protectedPrefixes.some((prefix) =>
    to.path.startsWith(prefix),
  );

  if (!isProtected) return;

  try {
    const headers = useRequestHeaders(["cookie"]);
    const { user: authUser } = await $fetch<{ user: User }>("/api/auth/me", {
      headers,
      credentials: "include",
    });
    user.value = authUser;
  } catch {
    return navigateTo("/");
  }
});
