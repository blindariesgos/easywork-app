"use client"
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCds8g01XKql94ARwrc8PRCcWlXpBSP1rQ",
  authDomain: "easywork-423220.firebaseapp.com",
  projectId: "easywork-423220",
  storageBucket: "easywork-423220.appspot.com",
  messagingSenderId: "252638396991",
  appId: "1:252638396991:web:b1617760e2a8bbdc22ae8a",
  measurementId: "G-S80J4NHTYM",
};


function FirebaseMessaging() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar si el navegador soporta notificaciones
    if ('Notification' in window) {
      setIsSupported(true);

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // Permission granted, proceed with getting token and setting up listener
            requestPermission(messaging);
          } else {
            console.log('User denied notification permission.');
          }
        });
      }

      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        // Mostrar la notificación (puedes usar una librería o el API de notificaciones)
        new Notification(payload.notification.title, { body: payload.notification.body });
      });
    } else {
      console.log('This browser does not support notifications.');
    }
  }, []);

  async function requestPermission(messaging) {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BNxUR54NRbeInXKzWz3RKVW9lEz7F1ugLkbKMKyI4xiDZUjE2RnCKeLQvhFMnZYq7oxy3rutfjDJBFZvHjvibRg",
      });
      if (currentToken) {
        console.log("Got FCM device token:", currentToken);
        // Enviar el token al servidor para suscribirse a las notificaciones push
        await sendTokenToServer(currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one.",
        );
      }
    } catch (error) {
      console.log("An error occurred while retrieving token. ", error);
    }
  }

  const sendTokenToServer = async (token) => {
    try {
      const response = await fetch("/api/save-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error("Failed to send token to server");
      }
      console.log("Token sent to server successfully");
    } catch (error) {
      console.error("Error sending token:", error);
    }
  };

  return (
    <></>
  );
}

export default FirebaseMessaging;