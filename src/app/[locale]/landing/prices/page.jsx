"use client";
import ModalForm from "../components/ModalForm";

export default function page() {
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
    <div className="min-h-screen w-full bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Comparativa de Precios
      </h1>
      <div className="container mx-auto px-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="text-left py-4 px-6 bg-blue-600 text-white font-bold">Plan</th>
              {plans.map((plan, index) => (
                <th key={index} className="py-4 px-6 bg-blue-600 text-white font-bold">
                  {plan.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-6 border">Precio</td>
              {plans.map((plan, index) => (
                <td key={index} className="py-4 px-6 border">
                  ${plan.price}/Mes
                </td>
              ))}
            </tr>
            {["Usuarios", "Pólizas Vigentes", "Drive"].map((feature, featureIndex) => (
              <tr key={featureIndex}>
                <td className="py-4 px-6 border">{feature}</td>
                {plans.map((plan, index) => (
                  <td key={index} className="py-4 px-6 border">
                    {plan.content[featureIndex]}
                  </td>
                ))}
              </tr>
            ))}
            {plans[0].content.slice(3).map((_, featureIndex) => (
              <tr key={featureIndex}>
                <td className="py-4 px-6 border">{plans[0].content[featureIndex + 3]}</td>
                {plans.map((plan, index) => (
                  <td key={index} className="py-4 px-6 border">
                    {plan.content[featureIndex + 3]}
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

