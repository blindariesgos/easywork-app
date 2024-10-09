"use client"
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';

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
  const [open, setOpen] = useState(false);
  const [messaging, setMessaging] = useState(null); // Store messaging instance

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true);
      const app = initializeApp(firebaseConfig);
      setMessaging(getMessaging(app)); // Initialize and store messaging
    } else {
      console.log("This browser does not support notifications.");
    }
  }, []);

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        new Notification(payload.notification.title, {
          body: payload.notification.body,
        });
      });
    }
  }, [messaging]);

  useEffect(() => {
    // Verificar el estado del permiso de notificaciones
    if (Notification.permission === 'default') {
      setOpen(true);
    }
  }, [isSupported]);

  const handleAccept = async () => {
    setOpen(false);

    if (messaging && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          requestPermission(messaging);
        } else {
          console.log("User denied notification permission.");
        }
      });
    }
  };

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
      const response = await fetch("/api/save_token", {
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
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={() => { }}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <BellIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Activar notificaciones
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-800">
                        Queremos mantenerte informado con novedades.<br />¿Te gustaría activar las notificaciones?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={handleAccept} // Call handleAccept on button click
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    data-autofocus
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default FirebaseMessaging;