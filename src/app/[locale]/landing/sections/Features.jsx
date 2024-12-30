export default function Features() {
  return (
    <div className="w-screen bg-white flex flex-col items-center justify-center text-blue-700 text-center bg-cover bg-center mb-5 px-10">
      <div className="flex flex-col items-center justify-center mb-5 mt-1">
        <h1 className="font-bold text-3xl md:text-5xl mb-5 md:mb-7">
          ¡Dale más facilidad a tu equipo con EASYWORK!
        </h1>
        <h2 className="text-lg md:text-xl leading-tight mb-2 text-center">
          Imagina una herramienta que no sólo almacena los datos de tu cartera
          de clientes, sino que impulsa el crecimiento de la gestión de tu
          agencia.
        </h2>
        <h2 className="text-lg md:text-xl leading-tight mb-2 text-center">
          EASYWORK no es sólo un sistema inteligente, es tu aliado ideal, tu
          asistente virtual que va más allá.{" "}
          <b>
            ¿Por qué conformarte con lo común cuando puedes tener lo
            excepcional?
          </b>
        </h2>
        <h2 className="text-lg md:text-xl leading-tight mb-2 text-center">
          Estas son las razones irresistibles para enamorarte de easywork
        </h2>
      </div>

      <div className="text-black">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {[
            {
              title: "Eficiencia y productividad",
              content:
                "Despídete de las tareas complicadas. <b>EASYWORK</b> simplifica cada paso, ahorra tiempo y libera tiempo para ti y tu equipo.",
            },
            {
              title: "Prospecta más e incrementa tus ventas",
              content:
                "No es solo un sistema, es una herramienta en constante innovación. Con <b>EASYWORK</b>, siempre estarás a la vanguadia de las soluciones inteligentes conecta tus canales y conversa con tus clientes.",
            },
            {
              title: "Asistente virtual, pero con alma",
              content:
                "Más que herramientas y organización, <b>EASYWORK</b> comprende tus necesidades. Es como tener a tu propio asistente personal, listo para hacerte la vida más fácil. No olvides nada. Automatiza tareas repetitivas.",
            },
          ].map((item, index) => (
            <div
              className="p-8 bg-slate-200 w-full md:w-80 h-72 flex flex-col justify-center mb-5 md:mb-0 md:ml-5 rounded-md hover:text-white hover:bg-blue-700 transition duration-500 cursor-pointer"
              key={index}
            >
              <h1 className="font-bold text-xl mb-3">{item.title}</h1>
              <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center max-md:mt-0 mt-5">
          {[
            {
              title: "Gestiona mejor tu operación",
              content:
                "Con <b>EASYWORK</b>, podrás atender siniestros, brindarle a tus clientes mejor servicio y enviar notificaciones directas al titular desde el inicio hasta la resolución.",
            },
            {
              title: "Pronostica ventas y cobranzas",
              content:
                "Con nuestra herramienta, es más que rápido, fácil y preciso tener en tiempo real las renovaciones para toda tu cartera y la gestión de cierre de ventas.",
            },
          ].map((item, index) => (
            <div
              className="p-8 bg-slate-200 w-full md:w-80 h-72 flex flex-col justify-center mb-5 md:mb-0 md:ml-5 rounded-md hover:text-white hover:bg-blue-700 transition duration-500 cursor-pointer"
              key={index}
            >
              <h1 className="font-bold text-xl mb-3">{item.title}</h1>
              <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
