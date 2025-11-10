import { useEffect } from 'react';
import { useAuth, AuthProvider } from '../context/AuthContext'; // <-- Note the path!
import { Slot, useRouter, useSegments } from 'expo-router';

// This is our main "gatekeeper"
function RootLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    // `segments` is the path array, e.g., ['(app)', 'index'] or ['(auth)', 'login']
    const inAuthGroup = segments[0] === '(auth)';
    console.log("Segments:", segments);
    console.log("User:", user);

    if (user && inAuthGroup) {
      router.replace('/'); 
    } else if (!user && !inAuthGroup) {
      router.replace('/login');
    }

  }, [user, segments, router, isLoading]); // Re-run this effect when 'user' or 'segments' change

  if (isLoading) {
    return null;
  }

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