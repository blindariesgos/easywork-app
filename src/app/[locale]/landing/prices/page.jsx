"use client";
import Header from "../sections/Header";
import plansData from "../plans.json";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import HelpChat from "../components/chat/HelpChat";
import Footer from "../sections/Footer";

export default function Page() {
  const plans = plansData.plans;

  // const features = [
  //   "Usuarios",
  //   "Pólizas Vigentes",
  //   "Contratantes y prospectos",
  //   "Calendario de pendientes",
  //   "Pendientes y tareas",
  //   "Lector de Pólizas Pro",
  //   "Generador de Reportes Pro",
  //   "Envios vía Correos",
  //   "Notificaciones de cobranza",
  //   "Notificación de pendientes",
  //   "Drive",
  //   "Asesoría Gratuita",
  //   "Envios vía WhatsApp",
  //   "Vinculación Google Calendar/Office 365",
  //   "Cobranza",
  //   "Cobranza PLUS",
  //   "Embudo de Ventas",
  //   "Embudos de Ventas ilimitados",
  //   "Reportes estratégicos",
  //   "Reportes estratégicos / personalizados",
  //   "Operaciones",
  //   "Automatizaciones",
  //   "Automatizaciones / personalizadas",
  //   "Conexión con DA's",
  //   "Gestión de Agentes",
  //   "Soporte Personalizado",
  // ];

  const features = [
    "USUARIOS",
    "PÓLIZAS VIGENTES",
    "CONTRATANTES Y PROSPECTOS",
    "CALENDARIO DE PENDIENTES",
    "PENDIENTES Y TAREAS",
    "LECTOR DE PÓLIZAS PRO",
    "GENERADOR DE REPORTES PRO",
    "ENVIOS VÍA CORREOS",
    "NOTIFICACIONES DE COBRANZA",
    "NOTIFICACIÓN DE PENDIENTES",
    "DRIVE",
    "ASESORÍA GRATUITA",
    "ENVIOS VÍA WHATSAPP",
    "VINCULACIÓN GOOGLE CALENDAR/OFFICE 365",
    "COBRANZA",
    "COBRANZA PLUS",
    "EMBUDO DE VENTAS",
    "EMBUDOS DE VENTAS ILIMITADOS",
    "REPORTES ESTRATÉGICOS",
    "REPORTES ESTRATÉGICOS / PERSONALIZADOS",
    "OPERACIONES",
    "AUTOMATIZACIONES",
    "AUTOMATIZACIONES / PERSONALIZADAS",
    "CONEXIÓN CON DA'S",
    "GESTIÓN DE AGENTES",
    "SOPORTE PERSONALIZADO",
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <div className="from-sky-500 to-blue-300 bg-gradient-to-t">
        <div id="inicio" className="h-20"></div>
        <Header redirect={true} />
      </div>
      <div className="w-screen pt-10 pl-10 mb-10 flex items-center">
        <h1 className="text-4xl font-medium text-easywork-main mb-10">
          Comparativa de Planes
        </h1>
      </div>

      <div className="container mx-auto px-4">
        {/* Pantalla grande: tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full bg-white border-separate border-spacing-x-3">
            <thead>
              <tr>
                <th className="py-4 px-8 text-left"></th>
                {plans.map((plan, index) => (
                  <th
                    key={index}
                    className="py-4 px-8 bg-easywork-main text-white font-bold rounded-t-lg text-center"
                  >
                    {plan.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 px-8 text-left">PRECIO</td>
                {plans.map((plan, index) => (
                  <td key={index} className="py-4 px-8 text-center">
                    {plan.price === 0 ? "Gratis" : `${plan.price}/Mes`}
                  </td>
                ))}
              </tr>
              {features.map((feature, featureIndex) => (
                <tr key={featureIndex}>
                  <td className="py-4 px-8 text-left">{feature}</td>
                  {plans.map((plan, index) => (
                    <td key={index} className="py-4 px-8 text-center">
                      {plan.content[feature] !== undefined ? (
                        plan.content[feature] === true ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" />
                        ) : plan.content[feature] === false ? (
                          <XCircleIcon className="w-6 h-6 text-gray-400 bg-gray-100 rounded-full mx-auto" />
                        ) : (
                          plan.content[feature].toString()
                        )
                      ) : (
                        "N/A"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pantallas móviles: comparación vertical */}
        <div className="lg:hidden">
          {features.map((feature, featureIndex) => (
            <div
              key={featureIndex}
              className="border border-gray-300 rounded-lg shadow-sm mb-6 p-4"
            >
              <h3 className="text-xl font-bold text-center mb-4">{feature}</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 text-center">
                {plans.map((plan, planIndex) => (
                  <div key={planIndex}>
                    <h4 className="font-semibold mb-2">{plan.title}</h4>
                    {plan.content[feature] !== undefined ? (
                      plan.content[feature] === true ? (
                        <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto" />
                      ) : plan.content[feature] === false ? (
                        <XCircleIcon className="w-6 h-6 text-gray-400 bg-gray-100 rounded-full mx-auto" />
                      ) : (
                        plan.content[feature].toString()
                      )
                    ) : (
                      "N/A"
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <HelpChat />
    </div>
  );
}
