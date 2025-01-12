import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import logo from '../assets/images/logo.png';
import { onAuthStateChanged } from 'firebase/auth'; // Import pentru verificarea autentificării
import { auth } from '../config/firebase'; // Import instanța Firebase

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Dacă utilizatorul este autentificat, redirecționează către MainNavigator (Explore este în MainNavigator)
        navigation.navigate('Main');
      } else {
        // Dacă utilizatorul nu este autentificat, redirecționează către AuthNavigator (Login este în AuthNavigator)
        navigation.navigate('Auth');
      }
    });

    return () => unsubscribe(); // Dezabonare de la evenimentul de autentificare
  }, []);

  return (
    <View style={styles.container}>
      {/* Afișează doar logo-ul */}
      <Image source={logo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centrare pe axa verticală
    alignItems: 'center', // Centrare pe axa orizontală
    backgroundColor: '#556B2F', // Fundal verde
  },
  logo: {
    width: 500, // Dimensiunea logo-ului
    height: 500,
    resizeMode: 'contain', // Păstrează proporțiile imaginii
  },
});
