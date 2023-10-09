import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCYnxT0bJp5-5WkMEhRK4R7P_kKeuFc6Y4',
  authDomain: 'angular-firebase-auth-41c36.firebaseapp.com',
  projectId: 'angular-firebase-auth-41c36',
  storageBucket: 'angular-firebase-auth-41c36.appspot.com',
  messagingSenderId: '307278515302',
  appId: '1:307278515302:web:665910880166a71a8131a7',
};

const firebaseClient = initializeApp(firebaseConfig);

export default firebaseClient;
