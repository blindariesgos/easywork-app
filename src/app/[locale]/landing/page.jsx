"use client";
import React from "react";
import Image from "next/image";
import Header from "./sections/Header";
import MainContent from "./sections/MainContent";
import Features from "./sections/Features";
import Plans from "./sections/Plans";
import Footer from "./sections/Footer";
import GetDemo from "./sections/GetDemo";
import Prices from "./sections/Prices";
import Graphics from "./sections/Graphics";

export default function Page() {
  return (
    <>
      {/* Estilos globales para smooth scroll */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="overflow-x-hidden bg-white overflow-y-hidden">
        <div className="from-sky-500 to-blue-300 bg-gradient-to-t min-h-screen w-screen">
          <div id="inicio" className="h-24"></div> {/* Sección de Inicio */}
          <Header />
          <MainContent />
        </div>
        <section>
          <Plans />
        </section>
        <div className="relative bg-gradient-to-t z-10 from-lime-400 to-lime-100 h-96 flex items-start">
          <Image
            className="absolute top-"
            width={900}
            height={900}
            src="/img/landing/ball-4.png"
            alt="ball"
          />
          <Image
            className="w-screen absolute"
            width={4000}
            height={4000}
            src="/img/landing/maskgreen.svg"
            alt="white"
          />
          <Image
            className="w-screen absolute -top-1"
            width={4000}
            height={4000}
            src="/img/landing/maskwhite2.svg"
            alt="white"
          />
        </div>
        <section>
          <Graphics />
        </section>
        <section id="modulos">
          <Features />
        </section>
        <section id="planes">
          <Prices />
        </section>
        <GetDemo />
        <Footer />
      </div>
    </>
  );
}
