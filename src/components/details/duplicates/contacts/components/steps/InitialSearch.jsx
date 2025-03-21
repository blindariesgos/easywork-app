import Button from "@/src/components/form/Button";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiCheckSquare } from "react-icons/fi";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";

const InitialSearch = ({ handleNext }) => {
  const params = [
    { name: "Nombre Completo", id: "fullName" },
    { name: "Teléfono", id: "phone" },
    { name: "E-mail", id: "email" },
    { name: "RFC", id: "rfc" },
  ];
  const [values, setValues] = useState(params);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();

  const handleSelect = (option) => {
    const index = values.findIndex((res) => res.id === option.id);
    if (index === -1) {
      setValues([...values, option]);
    } else {
      const newValues = values.filter((res) => res.id !== option.id);
      setValues(newValues);
    }
  };

  const selectAll = () => {
    setValues(params);
  };

  const handleInit = () => {
    setLoading(true);
    setTimeout(() => {
      setResponse("prueba");
      setLoading(false);
    }, 10000);
  };

  return (
    <div className="rounded-lg bg-[#F9F9F9] max-h-[calc(100vh_-_100px)] h-full flex justify-center items-center gap-6 flex-col">
      {!response ? (
        <Fragment>
          <div className="flex gap-2 items-center">
            <Menu>
              <div className="border-[#E0E0E0] border bg-white rounded-lg max-w-[580px] w-full p-2 flex gap-2 items-center">
                <CiSearch className="w-6 h-6 text-[#828282]" />
                <p className="text-sm text-[#828282]">
                  Buscar duplicados por campo:
                </p>
                <p className="border-b border-primary text-primary text-sm">
                  {values.map((value) => value.name).join(", ")}
                </p>
              </div>
              <MenuButton className="text-sm">Cambiar</MenuButton>
              <MenuItems
                anchor="bottom end"
                className=" mt-1 w-[340px] rounded-md bg-white shadow-lg z-50 py-2"
              >
                <div
                  className="py-1 flex flex-col gap-1 px-2 overflow-y-auto"
                  aria-labelledby="options-menu"
                >
                  <p className="text-sm">Seleccionar campos para comparar</p>
                  <p
                    className="text-sm underline cursor-pointer pl-6"
                    onClick={selectAll}
                  >
                    Seleccionar todo
                  </p>

                  {params.map((option) => (
                    <MenuItem
                      as="div"
                      key={option.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-1 text-sm px-2 data-[disabled]:opacity-50 data-[focus]:text-primary`
                      }
                      onClick={() => handleSelect(option)}
                    >
                      <span
                        className={`block truncate pl-6 ${
                          values.some((res) => res.id === option.id)
                            ? "font-medium"
                            : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-2 text-primary`}
                      >
                        {values.some((res) => res.id === option.id) ? (
                          <FiCheckSquare
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <MdOutlineCheckBoxOutlineBlank
                            className="h-[18px] w-[18px]"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
          </div>
          <Image
            className="h-[230px] w-[230px] rounded-full"
            width={230}
            height={230}
            src={"/img/search-duplicates.svg"}
            alt=""
          />
          {loading && (
            <div className="h-[60px]">
              <LoadingSpinnerSmall />
            </div>
          )}
          <Button
            className="w-[200px] py-2"
            buttonStyle="primary"
            label={loading ? "Escaneando..." : "Iniciar escaneo"}
            onclick={handleInit}
          />
          <div>
            <p className="text-center text-sm">
              El tiempo de escaneo depende del tamaño de su base de datos.
            </p>
            <p className="text-center text-sm">Puede tardar un tiempo.</p>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <h1 className="text-2xl pb-4">Duplicados procesados: 8</h1>
          <h2 className="text-xl pb-4">Coincidencias procesadas: 4</h2>
          <Image
            className="h-[230px] w-[230px] rounded-full"
            width={230}
            height={230}
            src={"/img/check-duplicates.svg"}
            alt=""
          />
          <Button
            className="w-[200px] py-2"
            buttonStyle="primary"
            label={"Siguiente paso"}
            onclick={handleNext}
          />
        </Fragment>
      )}
    </div>
  );
};

export default InitialSearch;
