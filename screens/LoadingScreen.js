import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import logo from '../assets/images/logo.png';
import { onAuthStateChanged } from 'firebase/auth'; // Import pentru verificarea autentificării
import { auth } from '../config/firebase'; // Import instanța Firebase

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    // Verifică starea autentificării utilizatorului
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User logged in:', user);
        navigation.replace('Main'); // Redirecționează către MainNavigator dacă utilizatorul este logat
      } else {
        console.log('No user logged in');
        navigation.replace('Auth'); // Redirecționează către AuthNavigator dacă utilizatorul nu este logat
      }
    });

    return () => unsubscribe(); // Dezabonare de la evenimentul de autentificare
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#556B2F',
  },
  logo: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
});
