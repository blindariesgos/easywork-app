"use client";
import Header from "../sections/Header";
import plansData from "../plans.json";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"; // Importamos los íconos de Heroicons

export default function Page() {
  const plans = plansData.plans;

  // List of features for display (keys from content object)
  const features = [
    "Usuarios",
    "Pólizas Vigentes",
    "Contratantes y prospectos",
    "Calendario de pendientes",
    "Pendientes y tareas",
    "Lector de Pólizas Pro",
    "Generador de Reportes Pro",
    "Envios vía Correos",
    "Notificaciones de cobranza",
    "Notificación de pendientes",
    "Drive",
    "Asesoría Gratuita",
    "Envios vía WhatsApp",
    "Vinculación Google Calendar/Office 365",
    "Cobranza",
    "Cobranza PLUS",
    "Embudo de Ventas",
    "Embudos de Ventas ilimitados",
    "Reportes estratégicos",
    "Reportes estratégicos / personalizados",
    "Operaciones",
    "Automatizaciones",
    "Automatizaciones / personalizadas",
    "Conexión con DA's",
    "Gestión de Agentes",
    "Soporte Personalizado",
  ];

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="from-sky-500 to-blue-300 bg-gradient-to-t">
        <div id="inicio" className="h-20"></div> {/* Sección de Inicio */}
        <Header redirect={true} />
      </div>
      <div className="w-screen pt-10 pl-10 mb-10 flex items-center">
        <h1 className="text-4xl font-medium text-easywork-main mb-10">
          Comparativa de Planes
        </h1>
      </div>

      <div className="container mx-auto px-4">
        <table className="min-w-full bg-white border-separate border-spacing-x-3">
          {" "}
          {/* Added border-separate and border-spacing-4 */}
          <thead>
            <tr>
              <th className="py-4 px-8 text-left">
                {/* Left-align title column */}
              </th>
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
              <td className="py-4 px-8 text-left">Precio</td>
              {plans.map((plan, index) => (
                <td key={index} className="py-4 px-8 text-center">
                  ${plan.price}/Mes
                </td>
              ))}
            </tr>
            {/* Loop over the features */}
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
    </div>
  );
}
