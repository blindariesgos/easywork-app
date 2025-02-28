import { Fragment, useEffect, useState } from "react";
import TextInput from "./TextInput";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import { getAddListConnections, getAddressByPostalCode } from "@/src/lib/apis";
import { VALIDATE_POSTAL_CODE } from "@/src/utils/regularExp";
import SelectInput from "./SelectInput";
import { handleFrontError } from "@/src/utils/api/errors";
import LoaderSpinner from "../LoaderSpinner";

const AddressInput = ({
  label,
  error,
  register,
  name,
  placeholder,
  disabled,
  setValue,
  small,
  isRequired,
  ...props
}) => {
  const [postalCode, setPostalCode] = useState("");
  const [habitations, setHabitations] = useState([]);
  const [habitation, setHabitation] = useState();
  const [address, setAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const getAddress = async () => {
    setIsLoading(true);
    const response = await getAddressByPostalCode(postalCode);
    if (response.error) {
      handleFrontError({ message: response.error_message });
      setIsLoading(false);
      return;
    }
    console.log({ response });
    if (Array.isArray(response?.response?.asentamiento)) {
      setHabitations(
        response?.response?.asentamiento?.map((a) => ({
          id: a,
          name: a,
        }))
      );
      setAddress(response?.response);
    } else {
      setHabitations([
        {
          name: response?.response?.asentamiento,
          id: response?.response?.asentamiento,
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleSearch = useDebouncedCallback(() => {
    if (VALIDATE_POSTAL_CODE.test(postalCode)) {
      getAddress();
    }
  }, 500);

  useEffect(() => {
    handleSearch();
  }, [postalCode]);

  const handleChangePostalCode = (e) => {
    setPostalCode(e.target.value);
  };

  useEffect(() => {
    if (!address || !habitation || !postalCode) return;
    setValue(
      name,
      `${address?.tipo_asentamiento} ${habitation}, ${address.municipio}, C.P ${postalCode}, ${address?.estado}, ${address?.estado}`
    );
  }, [habitation, address, postalCode]);

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <div className="grid grid-cols-1 gap-y-1">
        {label && (
          <label
            className={clsx(
              "block font-medium leading-6 text-gray-900 px-3 relative",
              {
                "text-xs": small,
                "text-sm": !small,
              }
            )}
          >
            {label}
            {isRequired && (
              <span className="text-sm text-red-600 absolute top-0 left-0">
                *
              </span>
            )}
          </label>
        )}
        <div
          className={clsx("grid grid-cols-2 gap-x-1", {
            hidden: disabled,
          })}
        >
          <TextInput
            onChangeCustom={handleChangePostalCode}
            placeholder={"Ingrese codigo postal"}
          />
          <SelectInput
            options={habitations}
            disabled={habitations.length == 0}
            setSelectedOption={(a) => setHabitation(a.id)}
            placeholder={
              address?.tipo_asentamiento
                ? `Seleccionar ${address?.tipo_asentamiento}`
                : "Asentamiento"
            }
          />
        </div>
        <TextInput
          error={error}
          register={register}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      </div>
    </Fragment>
  );
};

export default AddressInput;
