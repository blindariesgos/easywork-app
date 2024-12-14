import Image from "next/image";
export default function Plans() {
  return (
    <div className="w-screen bg-white bg-cover bg-center flex flex-col md:flex-row items-center justify-center pt-20 md:pt-48 px-6 md:px-0">
      <div
        className="bg-white px-6 md:px-14 pt-14 text-easywork-main flex items-center justify-center flex-col text-center md:text-left"
        style={{ maxWidth: 540 }}
      >
        <h1
          className="font-bold text-4xl md:text-6xl mb-4 md:mb-7"
          style={{ maxWidth: 500 }}
        >
          Imagina un espacio único
        </h1>
        <p
          className="text-md md:text-lg leading-tight"
          style={{ maxWidth: 500 }}
        >
          Que agrupe varias de tus herramientas de trabajo, que combine
          comunicación con clientes, gestión de cartera para la cobranza
          efectiva y te permita operar y gestionar en comunidad procesos de
          atención al cliente.
        </p>
      </div>
      <div className="mt-10 md:mt-0">
        <Image
          className="w-64 md:w-96"
          width={420}
          height={420}
          src="/img/landing/social.svg"
          alt="social"
        />
      </div>
    </div>
  );
}
