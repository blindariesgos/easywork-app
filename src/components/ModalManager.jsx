import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ModalManager = ({ children }) => {
  const router = useRouter();
  const [modals, setModals] = useState([]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      const modalParams = searchParams.get("modal");

      const parsedModals = modalParams.map((param) => {
        const [type, id] = param.split(":");
        return { type, id };
      });

      setModals([...modals]);
    };

    handleRouteChange(router.asPath); // Inicializar con la URL actual

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const closeModal = (index) => {
    const newModals = [...modals];
    newModals.splice(index, 1);

    setModals(newModals);
  };

  return (
    <>
      {children}
      {modals.map((modal, index) => {
        // Renderizar el modal correspondiente según el tipo

        return null;
      })}
    </>
  );
};

export default ModalManager;
