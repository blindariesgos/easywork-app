import Image from "next/image";
export default function Graphics() {
  return (
    <div className="w-screen bg-lime-400 flex flex-col justify-center relative pb-20 pt-20 max-md:pt-10 overflow-hidden skew-bottom-div px-4">
      <div className="flex flex-col items-center justify-center text-easywork-main">
        <h1 className="font-bold text-4xl md:text-6xl mb-3 md:mb-7 text-center max-w-full md:max-w-md">
          EASYWORK
        </h1>
        <p className="text-md md:text-lg leading-tight text-center">
          Lo tiene todo. <br /> Todo el poder de nuestra herramienta a tu favor.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center mt-10 text-center md:text-left">
        <Image
          className="w-64 md:w-96"
          width={400}
          height={400}
          src="/img/landing/graphics.svg"
          alt="white"
        />
        <h1 className="font-medium text-xl md:text-3xl mt-5 md:mt-0 md:ml-3 text-easywork-main max-w-full md:max-w-lg">
          Los usuarios que implementan EASYWORK{" "}
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
  );
}
