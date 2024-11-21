import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// Importă funcțiile necesare din Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Asigură-te că această cale este corectă

const CustomCheckBox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        { backgroundColor: value ? '#556B2F' : '#FFF' },
      ]}
      onPress={() => onValueChange(!value)}
    >
      {value && <View style={styles.checkboxInner} />}
    </TouchableOpacity>
  );
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Funcție pentru autentificare
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Succes!', 'Te-ai autentificat cu succes!');
      navigation.navigate('ExploreScreen'); // Navigare la pagina Explore
    } catch (error) {
      Alert.alert('Eroare', error.message); // Afișează eroarea
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Titlu */}
        <Text style={styles.title}>Hi, Welcome Back! 👋</Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Remember Me și Forgot Password */}
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <CustomCheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
            />
            <Text style={styles.checkboxLabel}>Remember Me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or With</Text>
          <View style={styles.line} />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.socialButtonText}>Login with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.socialButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <View style={styles.footer}>
        <Text style={styles.registerLink}>
          Don’t have an account?{' '}
          <Text
            style={styles.registerText}
            onPress={() => navigation.navigate('Register')}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: -60, // Mută textul mai sus
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
    width: '85%', // Lățime ajustată
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    height: 50,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    width: '85%', // Lățime ajustată
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#556B2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  forgotPassword: {
    color: '#FF4500',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#556B2F',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    width: '85%', // Lățime ajustată
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '85%', // Lățime ajustată
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#666',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    width: '85%', // Lățime ajustată
  },
  googleButton: {
    backgroundColor: '#DB4437',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '85%', // Lățime ajustată
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30, // Mută textul mai sus
    marginTop: 20,
  },
  registerLink: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  registerText: {
    color: '#556B2F',
    fontWeight: 'bold',
  },
});
