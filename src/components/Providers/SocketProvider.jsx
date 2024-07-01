"use client";
import { useEffect } from "react";
import { useSocketConnection } from "@/src/socket";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import { useSWRConfig } from "swr";

export default function SocketProvider({ children }) {
  const socket = useSocketConnection();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!socket) return;

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Socket conectado");
    }

    function onDisconnect() {
      console.log("Socket desconectado");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("notification", (data) => {
      try {
        console.log("Notification received", data);

        mutate("/notify/");

        toast.info(<>{parse(data)}</>);
      } catch (error) {
        console.error("Error parsing notification", error);
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return <div>{children}</div>;
}
