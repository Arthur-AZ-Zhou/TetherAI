// --- This is the correct code for app/(auth)/signup.tsx ---

import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Note the path: ../../

export default function SignUp() {
  // We'll just re-use the 'signIn' function for our fake auth
  const { signIn } = useAuth(); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {/*
        In a real app, this would call a 'signUp' function.
        For our test, we'll just call 'signIn'.
      */}
      <Button title="Sign Up & Log In" onPress={() => signIn()} />

      {/* This links back to the login page. */}
      <Link href="/login" style={styles.link}>
        <Text>Already have an account? Log In</Text>
      </Link>
    </View>
  );
}

// You can add some styles to make it look nice
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  link: {
    marginTop: 15,
  }
});