"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "./sections/Header";
import MainContent from "./sections/MainContent";
import Features from "./sections/Features";
import Plans from "./sections/Plans";
import Footer from "./sections/Footer";
import GetDemo from "./sections/GetDemo";
import Prices from "./sections/Prices";
import Graphics from "./sections/Graphics";
import CookieModal from "./components/Cookies";
import HelpChat from "./components/chat/HelpChat"

// Hook para aplicar la animación cuando el elemento entra en el viewport
const ScrollAnimationWrapper = ({ children }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.div>
  );
};

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
          <ScrollAnimationWrapper>
            <Header redirect={false} />
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper>
            <MainContent />
          </ScrollAnimationWrapper>
        </div>
        <section>
          <ScrollAnimationWrapper>
            <Plans />
          </ScrollAnimationWrapper>
        </section>
        <div className="relative bg-gradient-to-t z-10 from-lime-400 to-lime-100 h-96 max-md:h-40 flex items-start">
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
          <ScrollAnimationWrapper>
            <Graphics />
          </ScrollAnimationWrapper>
        </section>
        <section id="modulos">
          <ScrollAnimationWrapper>
            <Features />
          </ScrollAnimationWrapper>
        </section>
        <section id="planes">
          <ScrollAnimationWrapper>
            <Prices />
          </ScrollAnimationWrapper>
        </section>
        <ScrollAnimationWrapper>
          <GetDemo />
        </ScrollAnimationWrapper>
        <Footer />
        <CookieModal />
      </div>
      <HelpChat />
    </>
  );
}
