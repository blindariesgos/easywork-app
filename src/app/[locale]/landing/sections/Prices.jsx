import { useState, useRef, useEffect } from "react";
import ModalForm from "../components/ModalForm";

export default function Price() {
  const [showFreePlan, setShowFreePlan] = useState(false);
  const planRef = useRef(null); // Ref para el contenedor del plan
  const [planWidth, setPlanWidth] = useState(0); // Para almacenar el ancho del plan

  // Función para cambiar el tamaño dinámicamente
  useEffect(() => {
    if (planRef.current) {
      setPlanWidth(planRef.current.offsetWidth); // Establece el ancho del plan
    }

    // Opcional: para recalcular el ancho si cambia el tamaño de la ventana
    const handleResize = () => {
      if (planRef.current) {
        setPlanWidth(planRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    // Limpieza del event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showFreePlan]); // Solo se recalcula cuando el estado de 'showFreePlan' cambia

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
        "1 Usuario",
        "500 Pólizas Vigentes",
        "Contratantes y prospectos",
        "Calendario de pendientes",
        "Pendientes y tareas",
        "Lector de Pólizas Pro",
        "Generador de Reportes Pro",
        "Envios vía Correos",
        "Notificaciones de cobranza",
        "Notificación de pendientes",
        "5GB Drive",
        "Asesoría Gratuita",
      ],
    },
    {
      title: "EASYBASIC",
      price: 899,
      content: [
        "3 Usuarios",
        "1,500 Pólizas Vigentes",
        "Contratantes y prospectos",
        "Calendario de pendientes",
        "Pendientes y tareas",
        "Lector de Pólizas Pro",
        "Generador de Reportes Pro",
        "Envios vía Correos",
        "Notificaciones de cobranza",
        "Notificación de pendientes",
        "Vinculación Google Calendar/Office 365",
        "Cobranza",
        "Embudo de Ventas",
        "10GB Drive",
        "Asesoría Gratuita",
      ],
    },
    {
      title: "EASYPRO",
      price: 2799,
      content: [
        "10 Usuarios",
        "5,000 Pólizas Vigentes",
        "Contratantes y prospectos",
        "Calendario de pendientes",
        "Pendientes y tareas",
        "Lector de Pólizas Pro",
        "Generador de Reportes Pro",
        "Envios vía Correos",
        "Envios vía WhatsApp (500 conversaciones)",
        "Notificaciones de cobranza",
        "Notificación de pendientes",
        "Vinculación Google Calendar/Office 365",
        "Cobranza",
        "Embudo de Ventas",
        "Reportes estratégicos",
        "Operaciones",
        "Automatizaciones",
        "100GB Drive",
        "Asesoría Gratuita",
      ],
    },
    {
      title: "EASYPREMIUM",
      price: 15999,
      content: [
        "Dirección de agencia y despachos",
        "80 Usuarios",
        "40,000 Pólizas Vigentes",
        "Contratantes y prospectos",
        "Calendario de pendientes",
        "Pendientes y tareas",
        "Lector de Pólizas Pro",
        "Generador de Reportes Pro",
        "Envios vía Correos",
        "Envios vía WhatsApp (1,000 conversaciones)",
        "Notificaciones de cobranza",
        "Notificación de pendientes",
        "Vinculación Google Calendar/Office 365",
        "Cobranza",
        "Embudo de Ventas",
        "Reportes estratégicos",
        "Operaciones",
        "Automatizaciones",
        "Conexión con DAIS",
        "Gestión de Agentes",
        "1024 GB Drive",
        "Asesoría Gratuita",
      ],
    },
    {
      title: "EASY PLUS",
      price: 27999,
      content: [
        "250 Usuarios",
        "80,000 Pólizas Vigentes",
        "Contratantes y prospectos",
        "Calendario de pendientes",
        "Pendientes y tareas",
        "Lector de Pólizas Pro",
        "Generador de Reportes Pro",
        "Envios vía Correos",
        "Envios vía WhatsApp (ilimitado)",
        "Notificaciones de cobranza",
        "Notificación de pendientes",
        "Vinculación Google Calendar/Office 365",
        "Cobranza",
        "Embudo de Ventas",
        "Reportes estratégicos",
        "Operaciones",
        "Automatizaciones",
        "Conexión con DAIS",
        "Gestión de Agentes",
        "2TB Drive",
        "Asesoría Gratuita",
      ],
    },
    {
      title: "EASYTOTAL",
      price: 99998,
      content: [
        "MÁS de 1000 Usuarios",
        "Más de 500,000 Pólizas Vigentes",
        "Contratantes y prospectos",
        "Calendario de pendientes",
        "Pendientes y tareas",
        "Lector de Pólizas Pro",
        "Generador de Reportes Pro",
        "Envios vía Correos",
        "Envios vía WhatsApp (ilimitado)",
        "Notificaciones de cobranza",
        "Notificación de pendientes",
        "Vinculación Google Calendar/Office 365",
        "Cobranza PLUS",
        "Embudos de Ventas ilimitados",
        "Reportes estratégicos / personalizados",
        "Operaciones",
        "Automatizaciones / personalizadas",
        "Conexión con DA's",
        "Gestión de Agentes",
        "20TB Drive",
        "Asesoría Gratuita",
        "Soporte Personalizado",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen w-screen bg-white flex flex-col items-center justify-center text-blue-700 text-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/img/landing/bg-stars.png')" }}
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full`}
      >
        {plans
          .filter((item, index) => (index === 0 ? showFreePlan : true)) // Ocultar el plan Free si no está activado
          .map((item, index) => (
            <div
              key={index}
              ref={index === 1 ? planRef : null} // Asignamos la ref solo al plan EASYBASIC
              className="relative flex items-center justify-center w-full"
            >
              {index === 1 && ( // Mostrar el botón solo al lado del plan EASYBASIC
                <div
                  onClick={toggleFreePlan}
                  className="cursor-pointer p-2 md:p-4 bg-lime-400 hover:bg-lime-500 text-white rounded-md absolute"
                  style={{
                    left: `calc(-${planWidth + 20}px)`, // Ajusta el valor a la izquierda dinámicamente
                    top: "50%",
                    transform: "translateY(-50%) rotate(-90deg)",
                    transformOrigin: "left center",
                  }}
                >
                  {showFreePlan ? "Ocultar Plan Free" : "Mostrar Plan Free"}
                </div>
              )}

              <div
                className="bg-white m-2 rounded-md p-4 w-full md:w-72 flex flex-col justify-between"
                style={{ height: "auto", minHeight: "450px" }}
              >
                <h1 className="font-bold text-2xl md:text-3xl">{item.title}</h1>
                <h2 className="font-bold text-2xl md:text-3xl">
                  ${item.price}
                  <span className="text-lg md:text-2xl font-medium">/Mes</span>
                </h2>
                <div className="mt-3 mb-6">
                  {item.content.slice(0, 3).map(
                    (
                      des,
                      idx // Limitar a las primeras 3 filas visibles
                    ) => (
                      <ul key={idx} className="list-disc pl-5">
                        <li className="text-sm md:text-base">{des}</li>
                      </ul>
                    )
                  )}
                  {expandedPlan === index &&
                    item.content.slice(3).map(
                      (
                        des,
                        idx // Mostrar el resto si el plan está expandido
                      ) => (
                        <ul key={idx} className="list-disc pl-5">
                          <li className="text-sm md:text-base">{des}</li>
                        </ul>
                      )
                    )}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={() => togglePlanDetails(index)}
                    className="rounded-md px-4 py-2 mb-1 font-semibold text-blue-900 hover:bg-blue-600 hover:text-white transition duration-300"
                  >
                    {expandedPlan === index ? "Ver Menos" : "Ver Más"}
                  </button>
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
    </div>
  );
}
