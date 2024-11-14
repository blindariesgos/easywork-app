"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

const HistoryChat = () => {
  const session = useSession();
  const [history, setHistory] = useState([
    {
      user: "support",
      message: "Ahora si deben haberse actualizado",
    },
  ]);
  const [message, setMessage] = useState("");

  return (
    <div className="w-full flex items-center flex-col">
      <div className="w-full flex justify-center bg-easywork-main rounded-t-lg text-white py-2">
        <h1>Mensajes</h1>
      </div>
      <div className="w-full flex items-start flex-col overflow-y-auto overflow-x-hidden h-72">
        {history.map((item, index) => (
          <div
            className={`p-2 flex ${item.user === "user" ? "justify-end" : "justify-start"} items-center w-full`}
            key={index}
          >
            {item.user !== "user" && (
              <div className="flex items-center">
                <div className="rounded-full bg-gray-50 w-10 h-10"></div>
              </div>
            )}
            <div
              className={` ${item.user === "user" ? "bg-easywork-main text-white" : "bg-gray-300"} ml-1 p-2 rounded-md max-w-56 break-words`}
            >
              <p className="text-xs">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full p-1 h-10">
        <input
          className="pl-1 rounded-md text-sm w-full"
          placeholder="Escribe un mensaje..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          className="ml-1 bg-easywork-main hover:bg-easywork-mainhover p-1 rounded-md text-white text-sm"
          onClick={() => {
            setHistory((prevMessages) => [
              ...prevMessages,
              {
                user: "user",
                message,
              },
            ]);
            setMessage("");
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default HistoryChat;
