import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { createLogger } from "../../utils/logger";

const logger = createLogger("app/(auth)/signup.tsx");

/**
 * @brief Sign Up screen component, allows new users to create an account by entering an email and password
 * 
 * @returns Sign Up screen UI
 */
export default function SignUp() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * @brief Handles the sign-up button press, currently re-uses the signIn function for demonstration purposes. 
   * WORK IN PROGRESS==========================================================
   */
  const onSignUpPress = () => {
    logger.info("Sign up button pressed.");
    
    try {
      if (!email || !password) {
        logger.warn("Sign up attempt failed: fields are empty.");
        throw new Error("Email and password are required.");
      }

      signIn(email, password); // Placeholder: REPLACE WITH ACTUAL LOGIC LATER
    } catch (error: any) { 
      logger.warn("Sign up failed:", error.message);
      Alert.alert("Sign up Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign Up & Log In" onPress={onSignUpPress} />

      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  }
});