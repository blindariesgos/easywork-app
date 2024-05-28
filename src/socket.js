"use client";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSocketConnection() {
  const session = useSession();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (session.status === "authenticated") {
      const newSocket = io(process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL, {
        query: {
          recipientId: session.data.user.id,
        },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session.status, session.data?.user?.id]);

  return socket;
}
