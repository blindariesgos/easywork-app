"use client";
import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="overflow-x-hidden bg-white">
      <div className="from-sky-500 to-blue-300 bg-gradient-to-t h-screen w-screen">
        <header className="flex items-center justify-between pt-7 px-8">
          <div>
            <Image
              className="w-28"
              width={400}
              height={400}
              src="/img/Layer_3.png"
              alt="Easywork"
            />
          </div>
          <nav>
            <ul className="flex gap-7 text-white font-semibold text-lg items-center">
              <li>Inicio</li>
              <li>Módulos</li>
              <li>Planes</li>
              <li>Clientes</li>
              <li>blog</li>
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
          </nav>
        </header>
        <div className="w-full relative mt-24 px-8">
          <div className="flex w-full h-full items-center justify-center">
            <Image
              style={{ width: 590 }}
              width={1000}
              height={1000}
              src="/img/landing/cellphone.png"
              alt="cellphone"
            />
            <div className="text-white ml-8" style={{ width: 590 }}>
              <h2 className="font-semibold text-xl">
                ¡Descubre la Revolución en Gestión de Pólizas!
              </h2>
              <h1 className="font-bold text-6xl mb-7">CON EASYWORK</h1>
              <h2
                className="font-semibold text-xl leading-tight mb-2"
                style={{ width: 400 }}
              >
                ¿Por qué conformarse con lo convencional cuando puedes contar
                con lo excepcional?
              </h2>
              <p className="text-lg leading-tight" style={{ width: 400 }}>
                Visualiza una herramienta que no solo organiza pólizas, sino que
                impulsa tus ventas, fortalece relaciones y transforma clientes
                ocasionales en devotos seguidores.
              </p>
              <div className="flex mt-3">
                <button className="bg-lime-400 hover:bg-lime-500 py-2 px-3 rounded-md text-black">
                  Ingresar
                </button>
                <button className="bg-blue-300 hover:bg-blue-400 ml-3 py-2 px-3 rounded-md text-easywork-main font-medium">
                  Video
                </button>
              </div>
            </div>
          </div>
          <Image
            style={{ width: 50 }}
            width={100}
            height={100}
            src="/img/landing/ball-2.png"
            alt="ball"
            className="absolute -top-16 left-1/3"
          />
          <Image
            style={{ width: 100 }}
            width={120}
            height={120}
            src="/img/landing/ball-2.png"
            alt="ball"
            className="absolute top-16 left-10"
          />
          <Image
            style={{ width: 150 }}
            width={180}
            height={180}
            src="/img/landing/ball-2.png"
            alt="ball"
            className="absolute -bottom-60 left-1"
          />
          <Image
            style={{ width: 150 }}
            width={180}
            height={180}
            src="/img/landing/ball-1.png"
            alt="ball"
            className="absolute -bottom-20 right-0"
          />
        </div>
        <div className="relative h-96 flex items-end">
          <Image
            className="w-screen absolute"
            width={4000}
            height={4000}
            src="/img/landing/maskblue.svg"
            alt="white"
          />
          <Image
            className="w-screen absolute"
            width={4000}
            height={4000}
            src="/img/landing/maskwhite.svg"
            alt="white"
          />
          <Image
            className="w-1/3 absolute -top-6"
            width={4000}
            height={4000}
            src="/img/landing/play.png"
            alt="ball"
          />
        </div>
      </div>
      <div
        className="h-screen w-screen bg-white bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/img/landing/floor.png')" }}
      >
        <div
          className="bg-white p-14 text-easywork-main mb-52"
          style={{ width: 540 }}
        >
          <h1 className="font-bold text-6xl mb-7" style={{ width: 500 }}>
            Imagina un espacio único
          </h1>
          <p className="text-lg leading-tight" style={{ width: 400 }}>
            que agrupe varias de tus herramientas de trabajo, que combine
            comunicación con clientes, gestión de cartera para la cobranza
            efectiva y te permita operar y gestionar en comunidad procesos de
            atención al cliente.
          </p>
        </div>
        <div>
          <Image
            // style={{ width: 150 }}
            width={650}
            height={650}
            src="/img/landing/social.png"
            alt="social"
          />
        </div>
      </div>
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
      <div className="h-screen w-screen bg-lime-400 flex-col items-center justify-center relative overflow-hidden skew-bottom-div">
        <div className="flex flex-col items-center justify-center text-easywork-main">
          <h1
            className="font-bold text-6xl mb-7 text-center"
            style={{ width: 500 }}
          >
            EASYWORK
          </h1>
          <p className="text-lg leading-tight text-center">
            Lo tiene todo. <br /> Todo el poder de nuestra herramienta a tu
            favor.
          </p>
        </div>
        <div className="flex items-center justify-center mt-20">
          <Image
            className=""
            width={400}
            height={400}
            src="/img/landing/graphics.png"
            alt="white"
          />
          <h1
            className="font-medium text-3xl mb-7 text-easywork-main"
            style={{ width: 650 }}
          >
            Los usuarios que implementan EASYWORK
            <b>incrementan su cartera en promedio un 28%</b> más, después de su
            primer año.
          </h1>
        </div>
        <style jsx>{`
          .skew-bottom-div {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 90%);
          }
        `}</style>
      </div>
      <div
        className="h-screen w-screen bg-white flex-col flex items-center justify-center text-blue-700 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/img/landing/floor.png')" }}
      >
        <div className="flex items-center justify-center flex-col mb-5 mt-1">
          <h1 className="font-bold text-5xl mb-7">
            ¡Dale más facilidad a tu equipo con easywork!
          </h1>
          <h2 className="text-xl leading-tight mb-2" style={{ width: "70%" }}>
            Imagina una herramienta que no sólo almacena los datos de tu cartera
            de clientes, sino que impulsa el crecimiento de la gestión de tu
            agencia.
          </h2>
          <h2 className="text-xl leading-tight mb-2" style={{ width: "60%" }}>
            easywork no es sólo un sistema inteligente, es tu aliado ideal, tu
            asistente virtual que va más allá.{" "}
            <b>
              ¿Por qué conformarte con lo común cuando puedes tener lo
              excepcional?
            </b>
          </h2>
          <h2 className="text-xl leading-tight mb-2" style={{ width: "70%" }}>
            Estas son las razones irresistibles para enamorarte de easywork
          </h2>
        </div>
        <div className="text-black">
          <div className="flex flex-row">
            {[
              {
                title: "Eficiencia y productividad",
                content:
                  "Despídete de las tareas complicadas. <b>EASYWORK</b> simplifica cada paso, ahorra tiempo y libera tiempo para ti y tu equipo.",
              },
              {
                title: "Eficiencia y productividad",
                content:
                  "Despídete de las tareas complicadas. <b>EASYWORK</b> simplifica cada paso, ahorra tiempo y libera tiempo para ti y tu equipo.",
              },
              {
                title: "Eficiencia y productividad",
                content:
                  "Despídete de las tareas complicadas. <b>EASYWORK</b> simplifica cada paso, ahorra tiempo y libera tiempo para ti y tu equipo.",
              },
            ].map((item, index) => (
              <div
                className="p-8 bg-slate-200 w-80 ml-5 rounded-md hover:text-white hover:bg-blue-700 transition duration-500 cursor-pointer"
                key={index}
              >
                <h1 className="font-bold text-xl mb-3">{item.title}</h1>
                <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-5 ml-5">
            {[
              {
                title: "Eficiencia y productividad",
                content:
                  "Despídete de las tareas complicadas. <b>EASYWORK</b> simplifica cada paso, ahorra tiempo y libera tiempo para ti y tu equipo.",
              },
              {
                title: "Eficiencia y productividad",
                content:
                  "Despídete de las tareas complicadas. <b>EASYWORK</b> simplifica cada paso, ahorra tiempo y libera tiempo para ti y tu equipo.",
              },
            ].map((item, index) => (
              <div
                className="p-8 bg-slate-200 w-80 ml-5 rounded-md hover:text-white hover:bg-blue-700 transition duration-500 cursor-pointer"
                key={index}
              >
                <h1 className="font-bold text-xl mb-3">{item.title}</h1>
                <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="h-screen w-screen bg-white flex items-center justify-center text-blue-700 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/img/landing/bg-stars.png')" }}
      >
        {[
          {
            title: "Free",
            price: 0,
            content: [
              "¡Disfruta de todo el poder de la herramienta, mientras decides quedarte con ella!",
            ],
          },
          {
            title: "Basic",
            price: 697,
            content: [
              "2 usuarios",
              "250 clientes",
              "App agente basic",
              "Soporte basic",
              "Correo electrónico",
            ],
          },
          {
            title: "Professional",
            price: 1897,
            content: [
              "5 usuarios",
              "1000 clientes",
              "App agente profesional",
              "Correo electrónico",
              "WhatsApp",
              "Soporte pro",
              "Acceso a comunidad para 1 usuario",
              "Acceso a la academia",
            ],
          },
          {
            title: "Business",
            price: 3897,
            content: [
              "+5 usuarios",
              "Clientes ilimitados",
              "App agente profesional",
              "Correo electrónico",
              "WhatsApp",
              "Soporte dedicado",
              "Acceso a comunidad para 1 usuario",
              "Acceso a la academia",
            ],
          },
        ].map((item, index) => (
          <div key={index} className="bg-white ml-2 rounded-md p-3 w-72">
            <h1 className="font-bold text-3xl">{item.title}</h1>
            <h2 className="font-bold text-3xl">
              {item.price}
              <span className="text-2xl font-medium">/Mes</span>
            </h2>
            {item.content.map((des, index) => (
              <p key={index}>{des}</p>
            ))}
            <button className="border-2 rounded-md px-2 py-1 font-semibold hover:bg-sky-500">Quiero una demo</button>
          </div>
        ))}
      </div>
    </div>
  );
}
