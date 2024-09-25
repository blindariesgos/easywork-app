export const formatToCurrency = (amount) => {
    // Asegurarse de que el valor sea un número
    if (isNaN(amount)) {
        return '0.00';
    }

    // Convertir a número y formatear
    const options = {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    return new Intl.NumberFormat('de-DE', options).format(amount);
}