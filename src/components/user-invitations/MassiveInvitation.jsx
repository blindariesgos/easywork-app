import { sendMassiveInvitations } from '@/src/lib/services/users/invitations';
import React, { useState, useRef, KeyboardEvent, FocusEvent, ClipboardEvent } from 'react';
import { FaX, FaTrash, FaCircleExclamation } from 'react-icons/fa6';
import { MdErrorOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

export const MassiveInvitation = ({ onEmailsChange }) => {
  const [emailEntries, setEmailEntries] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(null);
  const [sending, setSending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const inputRef = useRef(null);

  const resetEmails = () => {
    setEmailEntries([]);
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const processEmails = emailsToProcess => {
    const newEntries = emailsToProcess
      .map(email => email.trim())
      .filter(email => email)
      .map(email => {
        const isValid = validateEmail(email);
        const existingIndex = emailEntries.findIndex(entry => entry.address.toLowerCase() === email.toLowerCase());
        const isDuplicate = existingIndex !== -1;

        return {
          address: email,
          isValid,
          isDuplicate,
        };
      })
      .filter(entry => !entry.isDuplicate);

    if (newEntries.length > 0) {
      const updatedEntries = [...emailEntries, ...newEntries].map((entry, index, array) => ({
        ...entry,
        isDuplicate: array.findIndex(e => e.address.toLowerCase() === entry.address.toLowerCase()) !== index,
      }));

      setEmailEntries(updatedEntries);
      if (onEmailsChange) onEmailsChange?.(updatedEntries.filter(entry => entry.isValid && !entry.isDuplicate).map(entry => entry.address));
      setInputValue('');
      setInputError(null);
    }
  };

  const removeEmail = indexToRemove => {
    const newEntries = emailEntries
      .filter((_, index) => index !== indexToRemove)
      .map((entry, index, array) => ({
        ...entry,
        isDuplicate: array.findIndex(e => e.address.toLowerCase() === entry.address.toLowerCase()) !== index,
      }));
    setEmailEntries(newEntries);
    if (onEmailsChange) onEmailsChange?.(newEntries.filter(entry => entry.isValid && !entry.isDuplicate).map(entry => entry.address));
  };

  const removeAllEmails = () => {
    resetEmails();
    if (onEmailsChange) onEmailsChange?.([]);
    setInputError(null);
    setShowConfirmDialog(false);
  };

  const removeDuplicates = () => {
    const uniqueEmails = emailEntries.reduce((acc, current) => {
      const exists = acc.find(item => item.address.toLowerCase() === current.address.toLowerCase());
      if (!exists) {
        return [...acc, { ...current, isDuplicate: false }];
      }
      return acc;
    }, []);

    setEmailEntries(uniqueEmails);
    if (onEmailsChange) onEmailsChange?.(uniqueEmails.filter(entry => entry.isValid).map(entry => entry.address));
  };

  const removeInvalidAndDuplicates = () => {
    const validUniqueEmails = emailEntries.reduce((acc, current) => {
      if (!current.isValid) return acc;

      const exists = acc.find(item => item.address.toLowerCase() === current.address.toLowerCase());
      if (!exists) {
        return [...acc, { ...current, isDuplicate: false }];
      }
      return acc;
    }, []);

    setEmailEntries(validUniqueEmails);
    if (onEmailsChange) onEmailsChange?.(validUniqueEmails.map(entry => entry.address));
  };

  const handleKeyDown = e => {
    if (e.key === 'Backspace' && inputValue === '' && emailEntries.length > 0) {
      e.preventDefault();
      removeEmail(emailEntries.length - 1);
    } else if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const emailsToAdd = inputValue.split(/[\s,]+/);
      processEmails(emailsToAdd);
    }
  };

  const handleBlur = e => {
    if (inputValue) {
      const emailsToAdd = inputValue.split(/[\s,]+/);
      processEmails(emailsToAdd);
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emailsToAdd = pastedText.split(/[\s,]+/);
    processEmails(emailsToAdd);
  };

  const handleInputChange = e => {
    const value = e.target.value;
    setInputValue(value);

    if (value && !value.includes(',') && !value.includes(' ')) {
      setInputError(validateEmail(value) ? null : 'Invalid email format');
    } else {
      setInputError(null);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const inviteUser = async () => {
    setSending(true);
    toast.info('Enviando invitaciones...');

    try {
      const emails = emailEntries.filter(entry => entry.isValid && !entry.isDuplicate).map(entry => entry.address);

      await sendMassiveInvitations({ emails });

      toast.success('Invitaciones enviadas con éxito');

      resetEmails();
    } catch (error) {
      toast.error('Ha ocurrido un error al intentar enviar las invitaciones. Por favor intente más tarde');
    } finally {
      setSending(false);
    }
  };

  const invalidEmailCount = emailEntries.filter(entry => !entry.isValid).length;
  const duplicateEmailCount = emailEntries.filter(entry => entry.isDuplicate).length;

  return (
    <div className="w-full max-w-2xl">
      <div className="mt-3">
        <p className="text-sm">Introduzca las direcciones de correo electrónico de las personas a las que desea invitar, separe varias entradas con una coma o un espacio.</p>
        <p className="text-xs my-5 bg-gray-300 px-2 py-5 rounded-lg">
          <span className="font-bold">Ejemplo:</span> example@example.com,example2@example.com,example3@example.com
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 mb-2">
        {duplicateEmailCount > 0 && (
          <button type="button" onClick={removeDuplicates} className="flex items-center text-sm text-orange-600 hover:text-orange-800 transition-colors">
            <FaCircleExclamation className="w-4 h-4 mr-1" />
            Eliminar duplicados ({duplicateEmailCount})
          </button>
        )}
        {(invalidEmailCount > 0 || duplicateEmailCount > 0) && (
          <button type="button" onClick={removeInvalidAndDuplicates} className="flex items-center text-sm text-orange-600 hover:text-orange-800 transition-colors">
            <MdErrorOutline className="w-4 h-4 mr-1" />
            Eliminar errores y duplicados ({invalidEmailCount + duplicateEmailCount})
          </button>
        )}
        {emailEntries.length > 0 && (
          <button type="button" onClick={() => setShowConfirmDialog(true)} className="flex items-center text-sm text-red-400 transition-colors">
            <FaTrash className="w-4 h-4 mr-1" />
            Eliminar todo
          </button>
        )}
      </div>
      <div className="min-h-[100px] p-3 border border-gray-300 rounded-lg bg-white cursor-text transition-colors" onClick={handleContainerClick}>
        <div className="flex flex-wrap gap-2">
          {emailEntries.map((entry, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                !entry.isValid ? 'bg-red-100 text-red-800 border border-red-300' : entry.isDuplicate ? 'bg-orange-100 text-orange-800 border border-orange-300' : 'bg-blue-100 text-blue-800'
              }`}
            >
              <span className="max-w-[200px] truncate">{entry.address}</span>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  removeEmail(index);
                }}
                className={`ml-1.5 ${
                  !entry.isValid ? 'text-red-600 hover:text-red-800' : entry.isDuplicate ? 'text-orange-600 hover:text-orange-800' : 'text-blue-600 hover:text-blue-800'
                } focus:outline-none`}
              >
                <FaX className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            id="email-input"
            type="text"
            className="flex-1 min-w-[200px] bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-sm"
            placeholder={emailEntries.length === 0 ? 'Pega o escribe las direcciones de correo' : 'Agrega otro correo...'}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onPaste={handlePaste}
            disabled={sending}
          />
        </div>
      </div>
      {inputError && <p className="mt-2 text-sm text-red-600">{inputError}</p>}
      {emailEntries.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          {emailEntries.length} {emailEntries.length === 1 ? 'email' : 'emails'} agregados ({emailEntries.filter(e => e.isValid && !e.isDuplicate).length} válido{emailEntries.length > 1 && 's'})
        </p>
      )}

      <button type="submit" className="text-white border border-easywork-main bg-easywork-main hover:bg-easywork-mainhover rounded-lg py-1 px-4 text-sm mt-4" disabled={sending} onClick={inviteUser}>
        {sending ? 'Enviando...' : 'Enviar invitaciones'}
      </button>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Desea eliminar todos los correos?</h3>
            <p className="text-gray-400 mb-6">Esta acción no se puede deshacer. Tendrá que ingresar todos los correos nuevamente.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowConfirmDialog(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button type="button" onClick={removeAllEmails} className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                Eliminar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
