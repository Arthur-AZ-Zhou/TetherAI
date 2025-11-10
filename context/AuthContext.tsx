import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import * as SecureStore from "expo-secure-store";
import { createLogger } from "../utils/logger";

const logger = createLogger("context/AuthContext.tsx");

/**
 * @brief Defines the structure of a user object in the application
 * 
 * @property id: Unique ID of the user from the database
 * @property name: User"s full display name
 * @property email: (Optional) User"s email address
 */
interface User {
  id: string;
  name: string;
  email?: string | null;
}

/**
 * @brief Defines the shape of the authentication context, specifies what data and functions are available
 * to components that consume this context.
 * 
 * @property user: The currently authenticated user or null if not logged in
 * @property signIn: Function to sign in a user with email and password
 * @property signOut: Function to sign out the current user
 * @property isLoading: Boolean indicating if the auth state is still loading
 */
interface AuthContextType {
  user: User | null;
  /**
   * Function to log a user in.
   * @param email The user"s email address.
   * @param pass The user"s password.
   */
  signIn: (email: string, pass: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const USER_DATA_KEY = "user_data"; // Key for SecureStore

/**
 * @brief Provider component that wraps the app and makes auth state available to any child component.
 *
 * Handles:
 * - Loading persisted user state from SecureStore on app launch
 * - Providing signIn() and signOut() functions
 * - Managing the user and isLoading state
 *
 * @param props.children Child components that will have access to the auth context
 * @returns AuthContext.Provider wrapping the children
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null); // Begins as null
  const [isLoading, setIsLoading] = useState(true); // Loading state set to true to prevent flicker

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedUserData = await SecureStore.getItemAsync(USER_DATA_KEY);

        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser);

          logger.info("User loaded from secure storage", parsedUser.name);

        } else {
          logger.info("No user found in secure storage");
        }

      } catch (e) {
        logger.error("Failed to load user data from storage", e);
        
      } finally {
        setIsLoading(false); // Set loading to false once we found a user or confirmed none exists
      }
    }

    loadUserFromStorage();
  }, []);

  const signIn = (email: string, pass: string) => {
    logger.info(`Attempting sign-in for: ${email}`);

    if (!email || !pass) {
      logger.warn("Sign-in failed: missing email or password");
      throw new Error("Email and password are required.");
    }

    const newUser: User = { id: "1", name: "Test User" };
    setUser(newUser);
    SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(newUser));
    logger.info("User signed in successfully");
  };

  const signOut = () => {
    logger.info("Signing out...");
    setUser(null);
    SecureStore.deleteItemAsync(USER_DATA_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * @brief Custom hook to easily access the AuthContext.
 *
 * @throws {Error} If used outside of an AuthProvider
 * @returns {AuthContextType} The authentication context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // TS now knows this context is of type "AuthContextType"
}