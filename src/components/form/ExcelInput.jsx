import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";

const ExcelInput = ({
  handleChange,
  name,
  onChangeCustom,
  setValue,
  errors,
}) => {
  const [file, setFile] = useState();
  const handleChangeFile = async (e) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const currentFile = Array.from(files)[0];
    const response = await readXlsxFile(currentFile)
      .then((rows) => ({ rows }))
      .catch((error) => ({ hasError: true, error }));
    console.log(response);

    if (response?.hasError) {
      toast.error(
        "Se ha producido un error al leer el archivo, compruebe que el formato es correcto."
      );
      return;
    }

    if (response?.rows?.[0]?.length !== 23) {
      toast.error(
        "El archivo cargado no tiene la cantidad de columnas requeridas"
      );
      return;
    }

    onChangeCustom && onChangeCustom(response.rows);
    setValue && setValue(name, response.rows);

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = {
        result: reader.result,
        size: currentFile.size,
        name: currentFile.name,
        file: currentFile,
      };

      setFile(result);
    };
    reader.readAsDataURL(currentFile);
  };

  useEffect(() => {
    handleChange && handleChange(file);
  }, [file]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <label
          htmlFor={name}
          className="text-white text-sm rounded-full bg-primary px-4 py-1"
        >
          Seleccionar archivo
        </label>
        <p className="text-sm">
          {file ? file.name : "Sin archivo seleccionado"}
        </p>
        <input
          name={name}
          id={name}
          type="file"
          className="hidden"
          accept=".xlsx"
          onChange={handleChangeFile}
        />
      </div>
      {errors && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
    </div>
  );
};

export default ExcelInput;
