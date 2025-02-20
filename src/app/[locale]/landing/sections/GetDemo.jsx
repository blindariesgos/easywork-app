import Image from "next/image";
import { useRouter } from "next/navigation";
export default function GetDemo() {
  const router = useRouter();
  return (
    <div className="w-screen bg-white bg-cover bg-center flex flex-col lg:flex-row items-center justify-center max-md:pt-5 pt-10 p-5">
      <div className="w-full lg:w-auto mb-8 lg:mb-0">
        <Image
          className="w-full lg:w-auto"
          width={2000}
          height={2000}
          src="/img/landing/time.png"
          alt="time"
        />
      </div>
      <div className="bg-white px-6 pb-6 lg:p-14 text-easywork-main flex flex-col lg:items-end justify-center w-full lg:w-1/2">
        <h1 className="font-bold text-3xl lg:text-6xl mb-5 text-center lg:text-right">
          El tiempo corre no te quedes atrás
        </h1>
        <p className="text-base lg:text-lg leading-tight text-center lg:text-right mb-4">
          La innovación <b>no espera, y tu éxito tampoco debería.</b> Regístrate
          ahora y únete a la comunidad de agentes que han transformado su forma
          de trabajar con <b>EASYWORK</b>.
        </p>
        <p className="text-base lg:text-lg leading-tight text-center lg:text-right mb-4">
          <b>¡No pierdas la oportunidad de impulsar tu éxito!</b>
        </p>
        <p className="text-base lg:text-lg leading-tight text-center lg:text-right mb-4">
          Regístrate para tu prueba gratuita ahora y descubre por qué{" "}
          <b>EASYWORK</b> está cambiando el juego para agentes como tú.
        </p>
        <div className="flex justify-center lg:justify-end mt-5">
          <button
            type="button"
            className="rounded-md bg-primary p-2 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => router.push(`${window.location.pathname}?show=true`)}
          >
            Contacto
          </button>
        </div>
      </div>
    </div>
  );
}
