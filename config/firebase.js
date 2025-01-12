// config/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDLvBisrOT3N129y5ynqv9_oSF927y7fIQ',
  authDomain: 'hikelinkapp.firebaseapp.com',
  projectId: 'hikelinkapp',
  storageBucket: 'hikelinkapp.appspot.com',
  messagingSenderId: '653594983421',
  appId: '1:653594983421:android:f28f129f3fc4e83df4f794',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };

// Adăugare pentru rezolvarea warning-ului legat de New Architecture în Expo
// Se va seta manual newArchEnabled în app.json conform documentației Expo.
