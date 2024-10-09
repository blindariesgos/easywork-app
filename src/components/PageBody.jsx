"use client";
import Footer from "./Footer";
import useAppContext from "../context/app/index";
import clsx from "clsx";

const PageBody = ({ children }) => {
  const { sidebarOpenDesktop1, sidebarOpenDesktop2 } = useAppContext();
  return (
    <div
      className={clsx("flex flex-col flex-grow w-full p-0.5 sm:p-0 md:p-4 ", {
        "lg:pl-80": sidebarOpenDesktop1,
        "lg:pl-28": !sidebarOpenDesktop1,
      })}
    >
      {/* Contenedor principal flexible */}
      <main className="flex-grow">
        {/* Contenido creciente */}
        {children}
      </main>
      <Footer /> {/* Footer fuera del main */}
    </div>
  );
};

export default PageBody;
