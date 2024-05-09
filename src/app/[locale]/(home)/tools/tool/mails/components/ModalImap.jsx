import Tag from "../../../../../../components/Tag";
import SliderOverShort from "../../../../../../components/SliderOverShort";

export default function ModalImap() {
  return (
    <SliderOverShort openModal={modalG}>
      <Tag onclick={() => setModalG(false)} className="bg-green-500" />
      <div className="bg-gray-300 rounded-l-2xl max-md:w-screen w-96 overflow-y-auto h-screen">
        <div className="m-3 font-medium text-lg">
          <h1>Gestionar buzón</h1>
        </div>
        <div className="m-3 p-5 pr-8 bg-gray-100 rounded-2xl">
          <div>
            <h1 className="font-medium">IMAP</h1>
            <h2 className="font-semibold">E-mail</h2>
            <h3>Armandoalbb@gmail.com</h3>
            <p className="text-xs">Último revisado Hace 10 minutos Éxito</p>
          </div>
          <div className="text-xs">
            <div className="mt-2">
              <p className="ml-2">Dirección del servidor IMAP</p>
              <input
                type="text"
                className="rounded-md border-0 w-full"
                onChange={(e) =>
                  setImapData((prevState) => ({
                    ...prevState,
                    host: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex mt-3">
              <div className="w-20">
                <p className="ml-2">Puerto</p>
                <input
                  type="number"
                  className="w-full rounded-md border-0"
                  onChange={(e) =>
                    setImapData((prevState) => ({
                      ...prevState,
                      port: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex mt-4 ml-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setImapData((prevState) => ({
                      ...prevState,
                      tls: e.target.checked,
                    }))
                  }
                />
                <p className="ml-1">Usar SSL</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="ml-2">Iniciar Sesión</p>
              <input
                type="text"
                onChange={(e) =>
                  setImapData((prevState) => ({
                    ...prevState,
                    user: e.target.value,
                  }))
                }
                className="rounded-md border-0 w-full"
              />
            </div>
            <div className="mt-2">
              <p className="ml-2">Contraseña</p>
              <input
                type="password"
                onChange={(e) =>
                  setImapData((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
                className="rounded-md border-0 w-full"
              />
            </div>
            <p className="mt-2 underline text-violet-800">
              Configurar carpetas para la sincronización
            </p>
            <div className="mt-2">
              <p className="ml-2">Nombre del buzón</p>
              <input
                type="text"
                onChange={(e) =>
                  setImapData((prevState) => ({
                    ...prevState,
                    mailName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-2">
              <p className="ml-2">Nombre del remitente</p>
              <input
                type="text"
                onChange={(e) =>
                  setImapData((prevState) => ({
                    ...prevState,
                    senderName: e.target.value,
                  }))
                }
                className="rounded-md border-0 w-full"
              />
            </div>
            <div className="mt-2">
              <p className="ml-2">
                URL de la interfaz web del servidor de correo electrónico
              </p>
              <input
                type="text"
                value="www.gmail.com"
                className="rounded-md border-0 w-full"
                disabled
              />
            </div>
            <div className="m-3 text-xs my-4 w-full">
              <h1 className="font-bold text-lg">Acceso al buzón</h1>
              <p className="bg-gray-300 p-2">
                Dé a los empleados permiso de acceso a este buzón para que
                puedan recibir y responder mensajes de correo electrónico. Es
                una forma sencilla de crear un entorno de colaboración para su
                departamento de ventas o servicio de asistencia.
              </p>
            </div>
            <div className="flex justify-around">
              <button
                type="button"
                className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
                onClick={() => saveIMAP()}
              >
                Guardar
              </button>
              <button
                type="button"
                className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Inhabilitar
              </button>
              <button
                type="button"
                className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                onClick={() => setModalG(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
}
