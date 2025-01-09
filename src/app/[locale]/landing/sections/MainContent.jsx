import Image from "next/image";
import { useRouter } from "next/navigation";
import ModalVideo from "../components/ModalVideo";
export default function MainContent() {
  const { push } = useRouter();
  return (
    <div className="w-full relative mt-10">
      <div className="flex flex-col md:flex-row w-full h-full items-center justify-evenly">
        <Image
          className="w-64 md:w-80"
          width={600}
          height={600}
          src="/img/landing/cellphone.svg"
          alt="cellphone"
        />
        <div
          className="text-white mt-6 md:mt-0 md:ml-8 text-center md:text-left z-20"
          style={{ maxWidth: 590 }}
        >
          <h2
            className="font-semibold text-lg md:text-xl"
            style={{ textAlign: "justify" }}
          >
            ¡Descubre la Revolución en Gestión de Pólizas!
          </h2>
          <h1
            className="font-bold text-4xl md:text-6xl mb-5 md:mb-7"
            style={{ textAlign: "justify" }}
          >
            CON EASYWORK
          </h1>
          <h2
            className="font-semibold text-lg md:text-xl leading-tight mb-2 mx-auto md:mx-0"
            style={{ maxWidth: 510, textAlign: "justify" }}
          >
            ¿Por qué conformarse con lo convencional cuando puedes contar con lo
            excepcional?
          </h2>
          <p
            className="text-md md:text-lg leading-tight mx-auto md:mx-0"
            style={{ maxWidth: 510, textAlign: "justify" }}
          >
            Visualiza una herramienta que no solo organiza pólizas, sino que
            impulsa tus ventas, fortalece relaciones y transforma clientes
            ocasionales en devotos seguidores.
          </p>
          <div className="flex flex-col md:flex-row mt-4 space-y-3 md:space-y-0 md:space-x-3 mb-10">
            <a href="/auth" target="_blank" rel="noopener noreferrer">
              <div className="bg-lime-400 hover:bg-lime-500 cursor-pointer py-2 px-3 rounded-md text-black">
                Ingresar
              </div>
            </a>
            <ModalVideo
              buttonOpen={
                <button className="bg-blue-300 w-full hover:bg-blue-400 cursor-pointer py-2 px-3 rounded-md text-easywork-main font-medium">
                  Video
                </button>
              }
            />
          </div>
        </div>
      </div>

      <Image
        width={180}
        height={180}
        src="/img/landing/maskgroup.svg"
        alt="ball"
        className="w-screen absolute top-36 max-lg:hidden"
      />
      <Image
        className="absolute -top-16 left-1/3 w-12 md:w-16 "
        width={100}
        height={100}
        src="/img/landing/ball-2.png"
        alt="ball"
      />
      <Image
        className="absolute top-16 left-10 w-16 md:w-20"
        width={120}
        height={120}
        src="/img/landing/ball-2.png"
        alt="ball"
      />
      <Image
        className="absolute -bottom-60 left-1 w-24 md:w-32 max-lg:hidden"
        width={180}
        height={180}
        src="/img/landing/ball-2.png"
        alt="ball"
      />
    </div>
  );
}
