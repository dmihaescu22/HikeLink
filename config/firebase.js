import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDLvBisrOT3N129y5ynqv9_oSF927y7fIQ',
  authDomain: 'hikelinkapp.firebaseapp.com',
  projectId: 'hikelinkapp',
  storageBucket: 'hikelinkapp.appspot.com',
  messagingSenderId: '653594983421',
  appId: '1:653594983421:android:f28f129f3fc4e83df4f794',
};

// Previne inițializarea multiplă a aplicației Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
