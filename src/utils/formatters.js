export const formatToDollars = (amount) => {
    // Asegurarse de que el valor sea un número
    if (isNaN(amount)) {
        return '$0.00';
    }

    // Convertir a número y formatear
    const options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    return new Intl.NumberFormat('en-US', options).format(amount);
}