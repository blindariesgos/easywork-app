import { useState, useRef, useEffect } from "react";
import ModalForm from "../components/ModalForm";
import { useRouter } from 'next/navigation';

export default function Price() {
  const [showFreePlan, setShowFreePlan] = useState(false);
  const planRef = useRef(null); // Ref para el contenedor del plan
  const [planWidth, setPlanWidth] = useState(0); // Para almacenar el ancho del plan
  const router = useRouter();

  // Función para cambiar el tamaño dinámicamente
  useEffect(() => {
    if (planRef.current) {
      setPlanWidth(planRef.current.offsetWidth); // Establece el ancho del plan
    }

    const handleResize = () => {
      if (planRef.current) {
        setPlanWidth(planRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showFreePlan]);

  const toggleFreePlan = () => {
    setShowFreePlan(!showFreePlan);
  };

  const [expandedPlan, setExpandedPlan] = useState(null);

  const togglePlanDetails = (index) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  const plans = [
    {
      title: "EASY ONLY",
      price: 299,
      content: [
        "1 Usuario.",
        "500 Pólizas Vigentes.",
        "Contratantes y prospectos.",
        "Calendario de pendientes.",
        "Pendientes y tareas.",
        "Lector de Pólizas Pro.",
        "Generador de Reportes Pro.",
        "Envios vía Correos.",
        "Notificaciones de cobranza.",
        "Notificación de pendientes.",
        "5GB Drive.",
        "Asesoría Gratuita.",
      ],
    },
    {
      title: "EASYBASIC",
      price: 899,
      content: [
        "3 Usuarios.",
        "1,500 Pólizas Vigentes.",
        "Contratantes y prospectos.",
        "Calendario de pendientes.",
        "Pendientes y tareas.",
        "Lector de Pólizas Pro.",
        "Generador de Reportes Pro.",
        "Envios vía Correos.",
        "Notificaciones de cobranza.",
        "Notificación de pendientes.",
        "Vinculación Google Calendar/Office 365.",
        "Cobranza.",
        "Embudo de Ventas.",
        "10GB Drive.",
        "Asesoría Gratuita.",
      ],
    },
    {
      title: "EASYPRO",
      price: 2799,
      content: [
        "10 Usuarios.",
        "5,000 Pólizas Vigentes.",
        "Contratantes y prospectos.",
        "Calendario de pendientes.",
        "Pendientes y tareas.",
        "Lector de Pólizas Pro.",
        "Generador de Reportes Pro.",
        "Envios vía Correos.",
        "Envios vía WhatsApp (500 conversaciones).",
        "Notificaciones de cobranza.",
        "Notificación de pendientes.",
        "Vinculación Google Calendar/Office 365.",
        "Cobranza.",
        "Embudo de Ventas.",
        "Reportes estratégicos.",
        "Operaciones.",
        "Automatizaciones.",
        "100GB Drive.",
        "Asesoría Gratuita.",
      ],
    },
    {
      title: "EASYPREMIUM",
      price: 15999,
      content: [
        "Dirección de agencia y despachos.",
        "80 Usuarios.",
        "40,000 Pólizas Vigentes.",
        "Contratantes y prospectos.",
        "Calendario de pendientes.",
        "Pendientes y tareas.",
        "Lector de Pólizas Pro.",
        "Generador de Reportes Pro.",
        "Envios vía Correos.",
        "Envios vía WhatsApp (1,000 conversaciones).",
        "Notificaciones de cobranza.",
        "Notificación de pendientes.",
        "Vinculación Google Calendar/Office 365.",
        "Cobranza.",
        "Embudo de Ventas.",
        "Reportes estratégicos.",
        "Operaciones.",
        "Automatizaciones.",
        "Conexión con DAIS.",
        "Gestión de Agentes.",
        "1024 GB Drive.",
        "Asesoría Gratuita.",
      ],
    },
    {
      title: "EASY PLUS",
      price: 27999,
      content: [
        "250 Usuarios.",
        "80,000 Pólizas Vigentes.",
        "Contratantes y prospectos.",
        "Calendario de pendientes.",
        "Pendientes y tareas.",
        "Lector de Pólizas Pro.",
        "Generador de Reportes Pro.",
        "Envios vía Correos.",
        "Envios vía WhatsApp (ilimitado).",
        "Notificaciones de cobranza.",
        "Notificación de pendientes.",
        "Vinculación Google Calendar/Office 365.",
        "Cobranza.",
        "Embudo de Ventas.",
        "Reportes estratégicos.",
        "Operaciones.",
        "Automatizaciones.",
        "Conexión con DAIS.",
        "Gestión de Agentes.",
        "2TB Drive.",
        "Asesoría Gratuita.",
      ],
    },
    {
      title: "EASYTOTAL",
      price: 99998,
      content: [
        "Más de 1000 Usuarios.",
        "Más de 500,000 Pólizas Vigentes.",
        "Contratantes y prospectos.",
        "Calendario de pendientes.",
        "Pendientes y tareas.",
        "Lector de Pólizas Pro.",
        "Generador de Reportes Pro.",
        "Envios vía Correos.",
        "Envios vía WhatsApp (ilimitado).",
        "Notificaciones de cobranza.",
        "Notificación de pendientes.",
        "Vinculación Google Calendar/Office 365.",
        "Cobranza PLUS.",
        "Embudos de Ventas ilimitados.",
        "Reportes estratégicos / personalizados.",
        "Operaciones.",
        "Automatizaciones / personalizadas.",
        "Conexión con DA's.",
        "Gestión de Agentes.",
        "20TB Drive.",
        "Asesoría Gratuita.",
        "Soporte Personalizado.",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen w-screen bg-white relative text-blue-700 text-center bg-cover bg-center px-10 py-5 overflow-x-auto"
      style={{ backgroundImage: "url('/img/landing/bg-stars.png')" }}
    >
      {/* Botón absoluto para mostrar/ocultar plan free dentro de la sección */}
      <div
        onClick={toggleFreePlan}
        className="cursor-pointer p-2 md:p-4 bg-lime-400 hover:bg-lime-500 text-white rounded-md absolute max-md:top-[9%] top-[50%] z-50"
        style={{
          left: 15,
          transform: "translateY(-50%) rotate(-90deg)",
          transformOrigin: "left center",
        }}
      >
        {showFreePlan ? "Ocultar Plan Free" : "Mostrar Plan Free"}
      </div>

      <div className="flex gap-4 w-full max-md:flex-col">
        {plans
          .filter((item, index) => (index === 0 ? showFreePlan : true))
          .map((item, index) => (
            <div
              key={index}
              ref={index === 1 ? planRef : null}
              className="relative flex justify-center w-full"
            >
              <div
                className="bg-white m-2 rounded-md p-4 w-full md:w-72 flex flex-col justify-between"
                style={{ height: "auto", minHeight: "450px" }}
              >
                <div>
                  <h1 className="font-bold text-2xl md:text-3xl">
                    {item.title}
                  </h1>
                  <h2 className="font-bold text-2xl md:text-3xl">
                    ${item.price}
                    <span className="text-lg md:text-2xl font-medium">
                      /Mes
                    </span>
                  </h2>
                  <div className="mt-3 mb-6">
                    {item.content.map(
                      (
                        des,
                        idx // Mostrar todas las características con puntos al final
                      ) => (
                        <ul key={idx} className="list-none pl-5">
                          <li className="text-sm md:text-base">{des}</li>
                        </ul>
                      )
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <ModalForm
                    buttonOpen={
                      <button className="border-2 rounded-md px-4 py-2 font-semibold text-blue-900 hover:bg-blue-600 transition duration-300">
                        QUIERO UNA DEMO
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      <h2 className="underline font-semibold text-white cursor-pointer text-xl mt-5" onClick={() => router.push(`/landing/prices`)}>
        Comparación de planes
      </h2>
    </div>
  );
}
