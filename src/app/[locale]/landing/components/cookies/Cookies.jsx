import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ModalManage from "./ModalManage"

const CookieModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const acceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!acceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full md:w-screen bg-white p-4 md:p-6 rounded-t-lg shadow-lg flex flex-col md:flex-row justify-between items-center border-t-4 border-easywork-main">
      <div className="text-xs sm:text-sm md:text-base text-gray-700 mb-4 md:mb-0 md:mr-10">
        Usamos cookies para mejorar el sitio web. Algunos son esenciales para
        mantener el buen funcionamiento del sitio y nuestros servicios. Otras
        son opcionales y permiten personalizar tu experiencia y los anuncios,
        además de generar estadísticas. Puedes aceptar todas las cookies,
        rechazar todas las opcionales o permitir las que prefieras. Si no
        escoges nada, aplicaremos nuestra configuración de cookies
        predeterminada. Podrás cambiar tus preferencias en cualquier momento. Si
        quieres saber más, consúltanos.
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
        <button
          onClick={acceptCookies}
          className="w-full md:w-auto px-4 py-2 text-white rounded-md bg-easywork-main hover:bg-easywork-mainhover"
        >
          Aceptar
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="w-full md:w-auto px-4 py-2 text-white rounded-md bg-easywork-main hover:bg-easywork-mainhover"
        >
          Rechazar
        </button>
        <p className="text-easywork-main hover:text-easywork-mainhover underline whitespace-nowrap cursor-pointer" onClick={() => push(`${window.location.pathname}?manage-cookies=true`)}>
          Administrar cookies
        </p>
      </div>
      <ModalManage />
    </div>
  );
};

export default CookieModal;
