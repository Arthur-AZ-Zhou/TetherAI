import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>

      <Button title="Login (Pretend)" onPress={() => signIn()} />

      <Link href="/signup" style={styles.link}>
        <Text>Don't have an account? Sign Up</Text>
      </Link>
    </View>
  );
}

// I've added the styles from your signup page to make it look better
// and to ensure all our code is clean.
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