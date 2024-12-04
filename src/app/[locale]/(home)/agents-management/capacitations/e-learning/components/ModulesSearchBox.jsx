import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ModulesSearchBox() {
  return (
    <form className="relative flex w-full" action="#" method="GET">
      <input
        id="search-field"
        className=" w-full h-16 my-auto rounded-xl border-0 py-0 pl-2 pr-8 text-black placeholder:text-primary focus:ring-0 sm:text-sm bg-gray-200 font-medium"
        type="search"
        name="search"
        placeholder="Buscar tema o subtema / Palabras clave"
      />
      <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 right-2 h-full w-5 text-primary" aria-hidden="true" />
    </form>
  );
}
