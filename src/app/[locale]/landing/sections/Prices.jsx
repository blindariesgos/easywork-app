export default function Price() {
  return (
    <div
      className="min-h-screen w-screen bg-white flex flex-col md:flex-row flex-wrap items-center justify-center text-blue-700 text-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/img/landing/bg-stars.png')" }}
    >
      {[
        {
          title: "Free",
          price: 0,
          content: [
            "¡Disfruta de todo el poder de la herramienta, mientras decides quedarte con ella!",
          ],
        },
        {
          title: "Basic",
          price: 697,
          content: [
            "2 usuarios",
            "250 clientes",
            "App agente basic",
            "Soporte basic",
            "Correo electrónico",
          ],
        },
        {
          title: "Professional",
          price: 1897,
          content: [
            "5 usuarios",
            "1000 clientes",
            "App agente profesional",
            "Correo electrónico",
            "WhatsApp",
            "Soporte pro",
            "Acceso a comunidad para 1 usuario",
            "Acceso a la academia",
          ],
        },
        {
          title: "Business",
          price: 3897,
          content: [
            "+5 usuarios",
            "Clientes ilimitados",
            "App agente profesional",
            "Correo electrónico",
            "WhatsApp",
            "Soporte dedicado",
            "Acceso a comunidad para 1 usuario",
            "Acceso a la academia",
          ],
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white m-2 rounded-md p-4 w-full md:w-72 flex flex-col justify-between"
          style={{ height: "auto", minHeight: "450px" }}
        >
          <h1 className="font-bold text-2xl md:text-3xl">{item.title}</h1>
          <h2 className="font-bold text-2xl md:text-3xl">
            {item.price}
            <span className="text-lg md:text-2xl font-medium">/Mes</span>
          </h2>
          <div className="mt-3 mb-6">
            {item.content.map((des, idx) => (
              <p key={idx} className="text-sm md:text-base">
                {des}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <button className="border-2 rounded-md px-4 py-2 font-semibold text-blue-900 hover:bg-blue-600 transition duration-300">
              QUIERO UNA DEMO <br />
              {index === 0 ? "15 DÍAS" : ""}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
