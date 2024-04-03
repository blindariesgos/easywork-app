"use client";
import React, { useEffect, useState } from "react";

export default function Clock() {
  const [ampmState, setAMPMState] = useState(
    new Date().toLocaleTimeString([], { hour12: true }).slice(-5).replace(/\./g, "").replace(/\s/g, "").toUpperCase()
  );

  const getConvertHour = (date) => {
    let hora12 = parseInt(date.split(":")[0]);
    hora12 = hora12 >= 12 ? hora12 - 12 : hora12;
    hora12 = hora12 === 0 ? 12 : hora12;

    return hora12 + ":" + date.split(":")[1];
  }

  const [timeState, setTimeState] = useState(
    // getConvertHour(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"}))
  );
  
  useEffect(() => {
    
    const interval = setInterval(() => {
      const date = new Date();
      // Mostrar solo horas y minutos
      setTimeState(
        getConvertHour(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"}))
      );
      // Obtener AM/PM
      setAMPMState(date.toLocaleTimeString([], { hour12: true }).slice(-5).replace(/\./g, "").replace(/\s/g, "").toUpperCase());
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Si timeState es null, mostrar un placeholder
  if (timeState === null) {
    return (
      <div className="animate-pulse bg-zinc-400 h-6 w-20 rounded-sm"></div>
    );
  }

  return (
    <div className="text-lg md:text-2xl text-black flex gap-2">
      <div>{timeState}</div>
      <p className="text-xs">{ampmState}</p>
    </div>
  )
}
