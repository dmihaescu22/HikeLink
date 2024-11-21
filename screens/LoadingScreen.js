import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import logo from '../assets/images/logo.png';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000); // Redirecționare după 3 secunde
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
