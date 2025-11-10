import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { createLogger } from "../../utils/logger";

const logger = createLogger("app/(auth)/login.tsx");

/**
 * @brief Login screen component, allows users to enter their email and password to authenticate
 * 
 * @returns Login screen UI
 */
export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * @brief Handles the login button press and validates input fields and calls the signIn function from AuthContext
   */
  const onLoginPress = () => {
    logger.info("Login button pressed.");

    try {
      if (!email || !password) {
        logger.warn("Login attempt failed: fields are empty.");
        throw new Error("Email and password are required.");
      }

      signIn(email, password);
    } catch (error: any) {
      logger.warn("Login failed:", error.message);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>

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
        secureTextEntry // Hides the password with asterisks
      />

      <Button title="Login" onPress={onLoginPress} />

      <Link href="/signup" style={styles.link}>
        <Text style={styles.linkText}>Don"t have an account? Sign Up</Text>
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