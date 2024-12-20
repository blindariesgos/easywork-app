import React, { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { push } = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    let timer;

    const handleScroll = () => {
      // Si el scroll es mayor a 50px, activa la clase con un delay
      if (window.scrollY > 50) {
        timer = setTimeout(() => {
          setIsScrolled(true);
        }, 200); // Delay de 200ms
      } else if (window.scrollY < 50) {
        timer = setTimeout(() => {
          setIsScrolled(false);
        }, 200); // Delay de 200ms
      } else {
        clearTimeout(timer);
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer); // Limpia el timer si el componente se desmonta
    };
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 w-full flex items-center justify-between py-3 px-8 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[rgba(14,164,233,0.64)]" : "bg-transparent"
      }`}
    >
      <div>
        <Image
          className={`w-24 max-lg:w-16`}
          width={400}
          height={400}
          src="/img/landing/logo.svg"
          alt="Easywork"
        />
      </div>
      <nav className="hidden md:block">
        <ul className="flex gap-7 text-white font-semibold text-lg items-center">
          <li>
            <a href="#inicio" onClick={toggleMenu}>
              Inicio
            </a>
          </li>
          <li>
            <a href="#modulos" onClick={toggleMenu}>
              Módulos
            </a>
          </li>
          <li>
            <a href="#planes" onClick={toggleMenu}>
              Planes
            </a>
          </li>
          <li>
            <a href="#clientes" onClick={toggleMenu}>
              Clientes
            </a>
          </li>
          <li>
            <a href="#blog" onClick={toggleMenu}>
              Blog
            </a>
          </li>
          <li>
            <button className="bg-easywork-main hover:bg-easywork-mainhover py-2 px-3 rounded-md">
              ES
            </button>
          </li>
          <li>
            <a href="/auth" target="_blank" rel="noopener noreferrer">
              <div className="bg-lime-400 hover:bg-lime-500 py-2 px-3 rounded-md text-black">
                Ingresar
              </div>
            </a>
          </li>
        </ul>
      </nav>

      {/* Burger Icon */}
      <button
        className="md:hidden text-white"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-[rgba(14,164,233,0.64)] p-8 md:hidden">
          <ul className="flex flex-col gap-7 text-white font-semibold text-lg items-center">
            <li>
              <a href="#inicio" onClick={toggleMenu}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#modulos" onClick={toggleMenu}>
                Módulos
              </a>
            </li>
            <li>
              <a href="#planes" onClick={toggleMenu}>
                Planes
              </a>
            </li>
            <li>
              <a href="#clientes" onClick={toggleMenu}>
                Clientes
              </a>
            </li>
            <li>
              <a href="#blog" onClick={toggleMenu}>
                Blog
              </a>
            </li>
            <li>
              <button className="bg-easywork-main hover:bg-easywork-mainhover py-2 px-3 rounded-md">
                ES
              </button>
            </li>
            <li>
              <button className="bg-lime-400 hover:bg-lime-500 py-2 px-3 rounded-md text-black">
                Ingresar
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
