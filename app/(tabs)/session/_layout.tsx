import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import colors from "@/constants/Color";
import { useSession } from "@/types/SessionContext";

export default function SessionLayout() {
  const { session, clearSession } = useSession();
  const router = useRouter();

  // On web, the session uses router.replace() so the whole session is a single
  // history entry. Push a sentinel state when a session starts so the
  // browser's back button can be caught and redirected to returnPath.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (typeof window === "undefined") return;
    if (!session) return;   // only act when there is an active session

    // Push a guard entry on top of the current history state.
    window.history.pushState({ sessionGuard: true }, "");

    const handlePopState = () => {
      // Only intercept when a session is actually running.
      if (!session) return;

      const dest = session.returnPath;
      clearSession();
      if (dest) {
        router.navigate(dest as any);
      } else {
        router.navigate("/(tabs)/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
    // Re-run only if returnPath changes (e.g. a new session replaces the old one).
  }, [session?.returnPath]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
      }}
    />
  );
}
