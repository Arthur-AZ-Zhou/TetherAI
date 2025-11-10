import { createContext, useContext, useState, useEffect, type PropsWithChildren } from 'react';

interface User {
  id: string;
  name: string;
}

// --- 2. NEW: Define the "shape" of our Context ---
interface AuthContextType {
  user: User | null; // The user can be a User object or null
  signIn: (email: string, pass: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

// --- 3. UPDATED: Create the Auth Context ---
// We tell createContext what its "shape" is, or null
const AuthContext = createContext<AuthContextType | null>(null);

// --- 4. UPDATED: Create the AuthProvider Component ---
export function AuthProvider({ children }: PropsWithChildren) {
  
  // --- UPDATED: Tell useState its type ---
  // The state can be a User or null, starting as null
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // BEGINS AS LOADING = TRUE

  useEffect(() => {
    // In a real app, you'd check secure storage here.
    // For now, we just simulate a quick check.
    setTimeout(() => {
      setIsLoading(false); // <-- NEW: We are done checking
    }, 1); // A tiny delay ensures this runs after the initial render cycle
  }, []);

  const signIn = (email: string, pass: string) => {
    if (!email || !pass) throw new Error("Email and password are required.");
    setUser({ id: '1', name: 'Test User' });
  };

  const signOut = () => {
    console.log("Signing out...");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
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