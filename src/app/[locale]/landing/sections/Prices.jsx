import { useState, useRef, useEffect } from "react";
import ModalForm from "../components/ModalForm";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Price() {
  const [showFreePlan, setShowFreePlan] = useState(false);
  const [stateTime, setStateTime] = useState(1);
  const planRef = useRef(null);
  const [planWidth, setPlanWidth] = useState(0);
  const router = useRouter();

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
      title: "EASYONLY",
      price: "",
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
      price: "899",
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
      price: "2799",
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
      price: "15999",
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
      title: "EASYPLUS",
      price: "27999",
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
      price: "99998",
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
      className="w-screen py-12 bg-white relative text-blue-700 text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/img/landing/bg-stars.png')" }}
    >
      {/* Boton para cambio de anio y mes */}
      <div className="flex justify-center">
        <div className="border-2 rounded-lg flex justify-center border-blue-700 mb-10">
          <div
            className={`px-4 py-1 cursor-pointer text-white rounded-md m-2 font-medium ${stateTime === 1 ? "bg-blue-700" : ""}`}
            onClick={() => setStateTime(1)}
          >
            Al mes
          </div>
          <div
            className={`px-4 py-1 cursor-pointer text-white rounded-md m-2 font-medium ${stateTime === 2 ? "bg-blue-700" : ""}`}
            onClick={() => setStateTime(2)}
          >
            Al año
          </div>
        </div>
      </div>

      {/* Botón absoluto para mostrar/ocultar plan free dentro de la sección */}
      {showFreePlan ? (
        <div
          onClick={toggleFreePlan}
          className="cursor-pointer p-2 md:p-4 bg-easywork-main hover:bg-easywork-mainhover text-white rounded-md absolute max-md:top-[2%] top-[10%] z-40 hidden md:block"
          style={{
            right: -135,
            transform: "translateY(-50%) rotate(-270deg)",
            transformOrigin: "left center",
          }}
        >
          Mostrar Easytotal
        </div>
      ) : (
        <div
          onClick={toggleFreePlan}
          className="cursor-pointer p-2 md:p-4 bg-lime-400 hover:bg-lime-500 text-white rounded-md absolute max-md:top-[9%] top-[30%] z-40 hidden md:block"
          style={{
            left: 15,
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "left center",
          }}
        >
          {showFreePlan ? "Ocultar Plan Free" : "Mostrar Plan Free"}
        </div>
      )}
      {/* Para desktop */}
      <div className="gap-3 w-full max-md:flex-col hidden md:flex">
        {plans.map((item, index) => (
          <motion.div
            key={index}
            className={`flex justify-center w-full ${index === 4 ? "border-2 border-blue-700 rounded-lg relative" : ""}`}
            initial={{ opacity: 0, x: -500 }}
            animate={{
              opacity: showFreePlan ? 1 : 1,
              x: showFreePlan ? 0 : -307,
            }}
            transition={{ duration: 0.5 }}
          >
            {index === 4 && <div className="popular-badge">Más Popular</div>}
            <div
              className="bg-white my-2 mx-1 rounded-md py-4 px-0.5 w-full md:w-72 flex flex-col justify-between"
              style={{ height: "auto", minHeight: "450px" }}
            >
              <div>
                <h1 className="font-bold text-2xl md:text-3xl">{item.title}</h1>
                <h2 className="font-bold text-2xl md:text-3xl">
                  {item.price == ""
                    ? "Gratis"
                    : stateTime === 1
                      ? "$" + (item.price * 1).toLocaleString("en-US")
                      : "$" + (item.price * 12).toLocaleString("en-US")}
                </h2>
                <div className="mt-3 mb-6">
                  {item.content.map((des, idx) => (
                    <ul key={idx} className="list-none px-1">
                      <li className="text-sm md:text-base">{des}</li>
                    </ul>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="border-2 rounded-md px-4 py-2 font-semibold text-blue-900 hover:bg-blue-600 transition duration-300"
                  onClick={() =>
                    router.replace(`${window.location.pathname}?show=true`)
                  }
                >
                  QUIERO UNA DEMO
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Para responsive */}
      <div className="flex gap-3 w-full max-md:flex-col overflow-x-auto md:hidden px-4">
        {plans.map((item, index) => (
          <div
            key={index}
            className={`w-full ${index === 4 ? "border-2 border-blue-700 rounded-lg relative" : ""}`}
          >
            {index === 4 && <div className="popular-badge">Más Popular</div>}
            <div
              className="bg-white my-2 mx-1 rounded-md py-4 px-0.5 flex flex-col justify-between"
              style={{ height: "auto", minHeight: "450px" }}
            >
              <div>
                <h1 className="font-bold text-2xl md:text-3xl">{item.title}</h1>
                <h2 className="font-bold text-2xl md:text-3xl">
                  {item.price == ""
                    ? "Gratis"
                    : stateTime === 1
                      ? "$" + (item.price * 1).toLocaleString("en-US")
                      : "$" + (item.price * 12).toLocaleString("en-US")}
                </h2>
                <div className="mt-3 mb-6">
                  {item.content.map((des, idx) => (
                    <ul key={idx} className="list-none px-1">
                      <li className="text-sm md:text-base">{des}</li>
                    </ul>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="border-2 rounded-md px-4 py-2 font-semibold text-blue-900 hover:bg-blue-600 transition duration-300"
                  onClick={() =>
                    router.replace(`${window.location.pathname}?show=true`)
                  }
                >
                  QUIERO UNA DEMO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2
        className="underline font-semibold text-white cursor-pointer text-xl mt-5"
        onClick={() => router.push(`/landing/prices`)}
      >
        Comparación de planes
      </h2>

      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: -200%;
          }
          100% {
            background-position: 200%;
          }
        }

        .popular-badge {
          position: absolute;
          top: -2rem;
          left: 1rem;
          background-color: #1e40af;
          color: white;
          font-weight: bold;
          padding: 0.25rem 1rem;
          border-radius: 0.5rem 0.5rem 0 0;
          background-image: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.5) 100%
          );
          background-size: 200%;
          animation: shine 5s infinite linear;
        }
      `}</style>
    </div>
  );
}
