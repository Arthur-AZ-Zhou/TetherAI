import { useEffect } from 'react';
import { useAuth, AuthProvider } from '../context/AuthContext'; // <-- Note the path!
import { Slot, useRouter, useSegments } from 'expo-router';

// This is our main "gatekeeper"
function RootLayout() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // `segments` is the path array, e.g., ['(app)', 'index'] or ['(auth)', 'login']
    const inAppGroup = segments[0] === '(app)';

    if (user && !inAppGroup) {
      // User is signed in but not in the (app) group...
      // Redirect them to the (app) homepage
      // The URL for app/(app)/index.tsx is just "/"
      router.replace('/'); 
      
    } else if (!user && inAppGroup) {
      // User is signed out but is in the (app) group...
      // Redirect them to the (auth) login page
      // The URL for app/(auth)/login.tsx is "/login"
      router.replace('/login');
    }

  }, [user, segments, router]); // Re-run this effect when 'user' or 'segments' change

  // <Slot /> renders the current page (e.g., login.tsx or index.tsx)
  return <Slot />;
}

// This is the main export
export default function AppLayout() {
  return (
    // Wrap our entire app in the AuthProvider
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}