'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa6';
import { toast } from 'react-toastify';

// Form step components
import { PersonalInfo } from '../../components/PersonalInfo';
import { ContactDetails } from '../../components/ContactDetails';
import { AccountSetup } from '../../components/AccountSetup';
import { InvalidLink } from '../../components/InvalidLink';
import { VerifyingLink } from '../../components/VerifyingLink';
import { Review } from '../../components/Review';

// Services
import { verifyLink } from '@/src/lib/services/users/invitations';

// Form step titles
const steps = [
  { id: 1, title: 'Información personal' },
  { id: 2, title: 'Detalles de contacto' },
  { id: 3, title: 'Configuración de cuenta' },
  { id: 4, title: 'Resumen' },
];

function Onboarding({ token, linkId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({});
  const [verifyingLink, setVerifyingLink] = useState(true);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  const verifyLinkStatus = useCallback(async () => {
    try {
      return true;
      await verifyLink(token, linkId);
    } catch (error) {
      setIsLinkInvalid(true);
      toast.error('El enlace es inválido o ha expirado');
    } finally {
      setVerifyingLink(false);
    }
  }, [token, linkId]);

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

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'El primer nombre es obligatorio';
      if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La fecha de nacimiento es obligatoria';
    } else if (currentStep === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'El correo es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El correo ingresado no es válido';
      }
      if (!formData.phone.trim()) newErrors.phone = 'El número de teléfono es obligatorio';
    } else if (currentStep === 3) {
      if (!formData.username.trim()) newErrors.username = 'El usuario es obligatorio';
      if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'la contraseña debe contener al menos 8 caracteres';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  // Handle back button click
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    if (currentStep === steps.length) {
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your backend
      alert('Form submitted successfully!');
    } else {
      handleNext();
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo formData={formData} handleChange={handleChange} errors={errors} />;
      case 2:
        return <ContactDetails formData={formData} handleChange={handleChange} errors={errors} />;
      case 3:
        return <AccountSetup formData={formData} handleChange={handleChange} errors={errors} />;
      case 4:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  // Calculate progress percentage
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  useEffect(() => {
    verifyLinkStatus();
  }, [verifyLinkStatus]);

  if (verifyingLink) return <VerifyingLink />;
  if (isLinkInvalid) return <InvalidLink />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-[480px]">
        {/* Step indicator */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between mb-4">
            {steps.map(step => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
                    ${currentStep === step.id ? 'bg-indigo-600 text-white' : currentStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {currentStep > step.id ? <FaCheck className="w-4 h-5" /> : step.id}
                </div>
                <span className="text-xs text-center text-gray-400 hidden sm:block text-wrap max-w-20">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-400">
              Paso {currentStep} de {steps.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">{steps[currentStep - 1].title}</span>
          </div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">{renderStepContent()}</div>

          {/* Form navigation */}
          <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FaChevronLeft className="w-4 h-4 mr-1" />
                Volver
              </button>
            )}

            <button
              type="submit"
              className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
                ${currentStep === 1 ? 'ml-auto' : ''}`}
            >
              {currentStep === steps.length ? 'Finalizar' : 'Siguiente'}
              {currentStep !== steps.length && <FaChevronRight className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
