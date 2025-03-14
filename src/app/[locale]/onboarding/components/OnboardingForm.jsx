'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

// Services
import { registerUser } from '@/src/lib/services/users/invitations';

const initialValues = {
  // Personal Info
  firstName: '',
  lastName: '',
  dateOfBirth: '',

  // Contact Details
  email: '',
  phone: '',
  address: '',

  // Account Setup
  username: '',
  password: '',
  confirmPassword: '',

  // Others
  marketing: false,
  seminaries: false,
};

export const OnboardingForm = ({ token, linkId, requestEmail }) => {
  const router = useRouter();

  const [formData, setFormData] = useState(initialValues);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update form data
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El primer nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';

    if (requestEmail) {
      if (!formData.email.trim()) {
        newErrors.email = 'El correo es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El correo ingresado no es válido';
      }
    }

    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'la contraseña debe contener al menos 8 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validateStep()) return;

    console.log('Form submitted:', formData);
    saveUser(formData);
  };

  const saveUser = async data => {
    console.log('🚀 ~ OnboardingForm ~ data:', { ...data, token, linkId });
    setIsSubmitting(true);

    try {
      await registerUser({ ...data, token, linkId });
      toast.success('Su registro ha sido exitoso!');

      setFormData(initialValues);
      router.push('/');
    } catch (error) {
      console.log(error);
      toast.error('Ha ocurrido un error durante el registro de sus datos. Por favor intente más tarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white px-20 py-8 rounded-xl">
      <div className="max-w-[480px]">
        <div className="bg-amber-100 p-4 rounded-lg">
          <p>Únete a nuestra cuenta de Easywork.</p>
          <p>Este es un lugar donde todos pueden comunicarse, colaborar en tareas y proyectos, administrar clientes y mucho más</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Usted fue invitado a{' '}
            <Link className="text-easy-600" href="/">
              Easywork
            </Link>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Por favor ingresa tus detalles personales.</p>
        </div>

        <div className="bg-[#e1f5fe] p-4 rounded-lg mt-4 mb-8">
          <p className="text-sm font-light">
            ¿Ya tienes cuenta EasyWork?{' '}
            <Link className="text-easy-500 font-bold" href="/auth?loginState=0">
              Inicia sesión
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label htmlFor="firstName" className="w-1/4 text-right block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <div className="w-5/6">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ingresa tu primer nombre..."
                  className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="lastName" className="w-1/4 text-right block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <div className="w-5/6">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ingresa tu o tus apellidos..."
                  className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {requestEmail && (
              <div className="flex items-center gap-2">
                <label htmlFor="email" className="w-1/4 text-right block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="w-5/6">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label htmlFor="password" className="w-1/4 text-right block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="w-5/6">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Crea tu contraseña"
                    className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10`}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="confirmPassword" className="w-1/4 text-right block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="w-5/6">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña escribiéndola otra vez"
                    className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10`}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm">
              Al registrarse, confirma que acepta nuestros{' '}
              <Link href="/" className="text-easy-500">
                términos de servicio
              </Link>{' '}
              y las{' '}
              <Link href="/" className="text-easy-500">
                políticas de privacidad
              </Link>
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <input
              id="marketing"
              name="marketing"
              type="checkbox"
              className="mr-1 h-4 w-4 text-primary focus:ring-primary"
              onChange={handleCheck}
              disabled={isSubmitting}
              defaultChecked={formData.marketing}
            />
            <label htmlFor="marketing">Acepto recibir correos electrónicos que contengan promociones, noticias y actualizaciones</label>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <input
              id="seminaries"
              name="seminaries"
              type="checkbox"
              className="mr-1 h-4 w-4 text-primary focus:ring-primary"
              onChange={handleCheck}
              disabled={isSubmitting}
              defaultChecked={formData.seminaries}
            />
            <label htmlFor="seminaries">Quiero recibir seminarios a sitios web gratuitos</label>
          </div>

          <button
            type="submit"
            className={`mt-4 block mx-auto px-8 py-2 text-white rounded-lg bg-easy-500 hover:bg-easy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar'}
          </button>
        </form>
      </div>
    </div>
  );
};
