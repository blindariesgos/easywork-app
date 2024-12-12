importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCds8g01XKql94ARwrc8PRCcWlXpBSP1rQ",
  authDomain: "easywork-423220.firebaseapp.com",
  projectId: "easywork-423220",
  storageBucket: "easywork-423220.appspot.com",
  messagingSenderId: "252638396991",
  appId: "1:252638396991:web:b1617760e2a8bbdc22ae8a",
  measurementId: "G-S80J4NHTYM",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
