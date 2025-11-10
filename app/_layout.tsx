import { useEffect } from "react";
import { useAuth, AuthProvider } from "../context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { createLogger } from "../utils/logger";

const logger = createLogger("app/_layout.tsx");

/**
 * @brief Root layout component that acts as the main "gatekeeper" for the app
 *
 * Monitors the user"s authentication state and current navigation segment
 * - If logged out and trying to access a protected route -> redirects to /login
 * - If logged in and trying to access a public auth route -> redirects to /
 * 
 * @returns Render of page based on auth state and route
 */
function RootLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) { // If auth state is still loading, do nothing yet
      logger.info("Auth state is loading...");
      return;
    }
    
    const inAuthGroup = segments[0] === "(auth)"; // segments is path array, ex: ["(app)", "index"]
    logger.info("Segments:", segments);
    logger.info("User:", user);

    if (user && inAuthGroup) {
      logger.info("Redirecting logged-in user to home screen"); // User is logged in but on an auth page, redirect to home
      router.replace("/"); 

    } else if (!user && !inAuthGroup) {
      logger.warn("Unauthorized access attempt. Redirecting to login."); // User is logged out but trying to access a protected page, redirect to login
      router.replace("/login");
    }

  }, [user, segments, router, isLoading]); // Rerun when "user" or "segments" change

  if (isLoading) {
    return null;
  }

  return <Slot />; // renders the current page (ex: login.tsx or index.tsx)
}

/**
 * @brief The main entry point for the application"s layout. Wraps the entire app in the AuthProvider to ensure 
 * authentication state is globally available
 * 
 * @returns App layout wrapped in AuthProvider
 */
export default function AppLayout() {
  return (
    // Wrap entire app in the AuthProvider
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}