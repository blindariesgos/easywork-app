"use client";
import { useEffect, useState } from "react";
import useDriveContext from "@/src/context/drive";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import TextInput from "@/src/components/form/TextInput";
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useContacts } from "../../../../../../../../lib/api/hooks/contacts";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";
import { toast } from "react-toastify";
import { assignCRMContact } from "@/src/lib/api/drive";
const ConnectCRM = () => {
  const { isOpenConnect, setIsOpenConnect, folderConnect, connectCRMContact } =
    useDriveContext();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({});
  const { contacts, isLoading } = useContacts({ filters, page: 1, limit: 10 });
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState();

  const handleSearch = useDebouncedCallback(() => {
    if (query.length > 0) {
      setFilters({
        name: query,
      });
    } else {
      setFilters({});
    }
  }, 500);

  useEffect(() => {
    handleSearch();
  }, [query]);

  const handleConnect = async () => {
    const response = await connectCRMContact(selected);
    if (!response) return;
    setQuery("");
    setSelected();
  };

  return (
    <Dialog
      open={isOpenConnect}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => setIsOpenConnect(false)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base font-medium text-primary">
              {`Vincular Carpeta ${folderConnect?.name} a un Contacto`}
            </DialogTitle>
            <div className="py-12">
              <p>Seleccione un contacto</p>
              <Combobox
                value={selected}
                onChange={(value) => setSelected(value)}
                onClose={() => setQuery("")}
              >
                <div className="relative">
                  <ComboboxInput
                    className={clsx(
                      "w-full rounded-lg  bg-white py-1.5 pr-8 pl-3 text-sm/6",
                      "focus:outline-none data-[focus]:outline-none "
                    )}
                    displayValue={(contact) => contact?.name}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <ChevronDownIcon className="size-4 fill-black group-data-[hover]:fill-primary" />
                  </ComboboxButton>
                </div>

                <ComboboxOptions
                  anchor="bottom"
                  transition
                  className={clsx(
                    "w-[var(--input-width)] rounded-xl p-1 [--anchor-gap:var(--spacing-1)] z-50 bg-white shadow-lg mt-2",
                    "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                  )}
                >
                  {isLoading && (
                    <ComboboxOption
                      disabled
                      className="group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none  cursor-pointer  hover:bg-primary"
                    >
                      Buscando...
                    </ComboboxOption>
                  )}
                  {contacts?.items &&
                    contacts?.items?.map((contact) => (
                      <ComboboxOption
                        key={contact.id}
                        value={contact}
                        className="group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none  cursor-pointer  hover:bg-primary"
                      >
                        <CheckIcon className="invisible size-4 text-primary group-data-[selected]:visible group-hover:text-white" />
                        <div className="group-hover:text-white text-sm ">
                          {contact.name}
                        </div>
                      </ComboboxOption>
                    ))}
                </ComboboxOptions>
              </Combobox>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <Button
                buttonStyle="secondary"
                className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                label="Cerrar"
                onclick={() => setIsOpenConnect(false)}
              />
              <Button
                buttonStyle="primary"
                className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                label="Vincular"
                disabled={!selected}
                onclick={handleConnect}
              />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ConnectCRM;
