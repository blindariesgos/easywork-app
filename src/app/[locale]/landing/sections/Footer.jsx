import Image from "next/image";

export default function Footer() {
  return (
    <div className="relative">
      <Image
        width={2000}
        height={2000}
        src="/img/landing/footer.svg"
        alt="social"
        className="w-full h-auto"
      />
      <div className="absolute max-lg:bottom-1 bottom-10 max-top-20 z-20 w-full flex justify-between px-4">
        <Image
          className="w-24 lg:w-36 mb-4 lg:mb-0 pr-2"
          width={400}
          height={400}
          src="/img/landing/logo.svg"
          alt="Easywork"
        />
        <ul className="text-white font-light max-md:text-xs text-sm lg:text-lg text-left mb-4 lg:mb-0">
          <li className="cursor-pointer mb-2">Comenzar</li>
          <li className="cursor-pointer mb-2">Preguntas frecuentes</li>
          <li className="cursor-pointer mb-2">Contacto</li>
          <li className="cursor-pointer mb-2">Términos y condiciones de uso</li>
          <li className="cursor-pointer mb-2">Políticas de privacidad</li>
          <li className="cursor-pointer">Políticas de cookies</li>
        </ul>
        <div className="flex justify-center items-center lg:justify-end space-x-4">
          <div className="rounded-full p-3 lg:p-5 bg-white hover:bg-[#1877F2] transition-colors duration-300">
            <Image
              className="w-6 lg:w-9 h-6 lg:h-9"
              width={400}
              height={400}
              src="/img/landing/social/facebook.svg"
              alt="Facebook"
            />
          </div>
          <div className="rounded-full p-3 lg:p-5 bg-white hover:bg-[#E4405F] transition-colors duration-300">
            <Image
              className="w-6 lg:w-9 h-6 lg:h-9"
              width={400}
              height={400}
              src="/img/landing/social/instagram.svg"
              alt="Instagram"
            />
          </div>
          <div className="rounded-full p-3 lg:p-5 bg-white hover:bg-[#0A66C2] transition-colors duration-300">
            <Image
              className="w-6 lg:w-9 h-6 lg:h-9"
              width={400}
              height={400}
              src="/img/landing/social/linkedin.svg"
              alt="LinkedIn"
            />
          </div>
          <div className="rounded-full p-3 lg:p-5 bg-white hover:bg-[#25D366] transition-colors duration-300">
            <Image
              className="w-6 lg:w-9 h-6 lg:h-9"
              width={400}
              height={400}
              src="/img/landing/social/whatsapp.svg"
              alt="WhatsApp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
