import { createContext, useContext, useState, type PropsWithChildren } from 'react';

// --- 1. NEW: Define the "shape" of a User ---
interface User {
  id: string;
  name: string;
}

// --- 2. NEW: Define the "shape" of our Context ---
interface AuthContextType {
  user: User | null; // The user can be a User object or null
  signIn: () => void;
  signOut: () => void;
}

// --- 3. UPDATED: Create the Auth Context ---
// We tell createContext what its "shape" is, or null
const AuthContext = createContext<AuthContextType | null>(null);

// --- 4. UPDATED: Create the AuthProvider Component ---
export function AuthProvider({ children }: PropsWithChildren) {
  
  // --- UPDATED: Tell useState its type ---
  // The state can be a User or null, starting as null
  const [user, setUser] = useState<User | null>(null);

  const signIn = () => {
    // This is a fake login. In a real app, you'd call an API
    console.log("Signing in...");
    // This is now VALID because TypeScript knows it matches the 'User' type
    setUser({ id: '1', name: 'Test User' });
  };

  const signOut = () => {
    console.log("Signing out...");
    setUser(null); // This is also valid
  };

  // We can even type this value for extra safety
  const authContextValue: AuthContextType = {
    user,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// --- 5. Create the "hook" (No changes needed here) ---
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // TypeScript now knows this context is of type 'AuthContextType'
  return context;
}