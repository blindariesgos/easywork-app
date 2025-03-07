export const Review = ({ formData }) => {
  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Revisa tu información</h2>
        <p className="text-sm text-gray-400 mt-1">Por favor verifica que tu información esté correcta antes de finalizar el registro</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Información personal</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">Nombre:</div>
            <div className="font-medium">{formData.firstName}</div>

            <div className="text-gray-400">Apellido:</div>
            <div className="font-medium">{formData.lastName}</div>

            <div className="text-gray-400">Fecha de nacimiento:</div>
            <div className="font-medium">{formatDate(formData.dateOfBirth)}</div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Detalles de contacto</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* <div className="text-gray-400">Correo electrónico:</div>
            <div className="font-medium">{formData.email}</div> */}

            <div className="text-gray-400">Teléfono:</div>
            <div className="font-medium">{formData.phone}</div>

            <div className="text-gray-400">Dirección:</div>
            <div className="font-medium">{formData.address || 'Not provided'}</div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Información de cuenta</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">Nombre de usuario:</div>
            <div className="font-medium">{formData.username}</div>

            <div className="text-gray-400">Contraseña:</div>
            <div className="font-medium">•••••••••</div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 italic">Al presionar Finalizar, confirmas que estás de acuerdo con nuestros Términos de Servicio y Política de Privacidad</div>
    </div>
  );
};
