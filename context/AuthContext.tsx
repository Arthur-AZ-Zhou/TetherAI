import { createContext, useContext, useState, useEffect, type PropsWithChildren } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null; // The user can be a User object or null
  signIn: (email: string, pass: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

// --- 3. UPDATED: Create the Auth Context ---
// We tell createContext what its "shape" is, or null
const AuthContext = createContext<AuthContextType | null>(null);
const USER_DATA_KEY = 'user_data';

// --- 4. UPDATED: Create the AuthProvider Component ---
export function AuthProvider({ children }: PropsWithChildren) {
  
  // --- UPDATED: Tell useState its type ---
  // The state can be a User or null, starting as null
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // BEGINS AS LOADING = TRUE

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        // Try to get the user data from secure storage
        const storedUserData = await SecureStore.getItemAsync(USER_DATA_KEY);

        if (storedUserData) {
          // If we found data, parse it and set it as the user
          setUser(JSON.parse(storedUserData));
        }
      } catch (e) {
        console.error("Failed to load user data from storage", e);
      } finally {
        // We're done loading, whether we found a user or not
        setIsLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  const signIn = (email: string, pass: string) => {
    if (!email || !pass) throw new Error("Email and password are required.");
    const newUser: User = { id: '1', name: 'Test User' };
    setUser(newUser);
    SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(newUser));
  };

  const signOut = () => {
    console.log("Signing out...");
    setUser(null);
    SecureStore.deleteItemAsync(USER_DATA_KEY);
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