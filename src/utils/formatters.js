export const formatToCurrency = (amount) => {
  // Asegurarse de que el valor sea un número
  if (isNaN(amount)) {
    return "0.00";
  }

  // Convertir a número y formatear
  const options = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat("en-US", options).format(amount);
};

export function correctSpecialCharacters(texto) {
  // Convertir el texto a un formato Unicode normalizado
  const textoNormalized = texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Reemplazar caracteres específicos si es necesario (ajusta según tus necesidades)
  const textCorrected = textoNormalized
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ñ/g, "n")
    .replace(/ü/g, "u");
  // Agrega más reemplazos si tienes otros caracteres problemáticos

  return textCorrected;
}
