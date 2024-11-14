import { useEffect, useState } from "react";

const FileInput = ({ handleChange, name }) => {
  const [file, setFile] = useState();
  const handleChangeFile = async (e) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const currentFile = Array.from(files)[0];

    if (currentFile.size > MAX_FILE_SIZE) {
      toast.error("El archivo debe tener un tamaño menor a 5MB.");
      return;
    }

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
    <div className="flex items-center gap-2">
      <label
        htmlFor={name}
        className="text-white text-sm rounded-full bg-primary px-4 py-1"
      >
        Seleccionar archivo
      </label>
      <p className="text-sm">{file ? file.name : "Sin archivo seleccionado"}</p>
      <input
        name={name}
        id={name}
        type="file"
        className="hidden"
        onChange={handleChangeFile}
      />
    </div>
  );
};

export default FileInput;
