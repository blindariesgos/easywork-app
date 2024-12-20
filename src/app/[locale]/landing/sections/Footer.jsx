import Image from "next/image";

export default function Footer() {
  return (
    <div className="relative max-md:h-96">
      <Image
        width={2000}
        height={2000}
        src="/img/landing/footer.svg"
        alt="social"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 pt-60 max-md:pt-6 pb-10 z-20 w-full flex flex-col md:flex-row items-center justify-between px-24 max-lg:px-2 bg-[url('/img/landing/bg-stars.png')] md:bg-none">
        <Image
          className="w-36 max-md:w-20 mb-4 lg:mb-0 pr-2"
          width={400}
          height={400}
          src="/img/landing/logo.svg"
          alt="Easywork"
        />
        <ul className="text-white font-light max-md:text-sm max-md:text-center text-sm lg:text-lg text-left mb-4 lg:mb-0">
          <li className="cursor-pointer mb-2">Comenzar</li>
          <li className="cursor-pointer mb-2">Preguntas frecuentes</li>
          <li className="cursor-pointer mb-2">Contacto</li>
          <li className="cursor-pointer mb-2">Términos y condiciones de uso</li>
          <li className="cursor-pointer mb-2">Políticas de privacidad</li>
          <li className="cursor-pointer">Políticas de cookies</li>
        </ul>
        <div className="flex justify-center items-center lg:justify-end space-x-4 lg:space-x-4 max-lg:space-x-2">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rounded-full p-4 max-md:p-2 bg-white hover:bg-[#1877F2] transition-colors duration-300">
              <Image
                className="w-6 lg:w-9 h-6 lg:h-9"
                width={400}
                height={400}
                src="/img/landing/social/facebook.svg"
                alt="Facebook"
              />
            </div>
          </a>

          <a
            href="https://www.instagram.com/easy.workapp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rounded-full p-4 max-md:p-2 bg-white hover:bg-[#E4405F] transition-colors duration-300">
              <Image
                className="w-6 lg:w-9 h-6 lg:h-9"
                width={400}
                height={400}
                src="/img/landing/social/instagram.svg"
                alt="Instagram"
              />
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/easy-work-4602b133b"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rounded-full p-4 max-md:p-2 bg-white hover:bg-[#0A66C2] transition-colors duration-300">
              <Image
                className="w-6 lg:w-9 h-6 lg:h-9"
                width={400}
                height={400}
                src="/img/landing/social/linkedin.svg"
                alt="LinkedIn"
              />
            </div>
          </a>

          <a
            href="https://www.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rounded-full p-4 max-md:p-2 bg-white hover:bg-[#25D366] transition-colors duration-300">
              <Image
                className="w-6 lg:w-9 h-6 lg:h-9"
                width={400}
                height={400}
                src="/img/landing/social/whatsapp.svg"
                alt="WhatsApp"
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
