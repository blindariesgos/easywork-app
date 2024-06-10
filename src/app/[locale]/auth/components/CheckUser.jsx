'use client';
import React, { useState, useRef, useCallback } from 'react';
import Image from "next/image";
import { useDataContext } from "../context";
import { validateOTP } from "@/src/lib/api/hooks/auths";

export default function CheckUser() {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const { contextData, setContextData, setOtpToken } = useDataContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleValidateOTP = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        let otpCode = pin.join("");
        try {
            const response = await validateOTP(otpCode);

            setOtpToken(response);
            setContextData(2);
        } catch (err) {
            console.log(err);
            setError("Código inválido");
            inputRefs.current[0].focus();
        } finally {
            setPin(Array(6).fill('')); // Reiniciar el pin
            setIsLoading(false);
        }
    }, [pin, setContextData]);

    const handleInput = (e, index) => {
        let newPin = [...pin];
        let inputValue = e.target.value;

        // Lógica para pegar código de 6 dígitos
        if (index === 0 && inputValue.length === 6 && /^\d+$/.test(inputValue)) {
            newPin = inputValue.split('').map(digit => digit); // Divide el valor pegado en dígitos individuales
            inputRefs.current[5].focus(); // Enfocar la última casilla después de pegar
        } else {
            inputValue = e.target.value.slice(0, 1);

            newPin[index] = inputValue;

            // Lógica para enfocar la casilla anterior al borrar
            if (e.target.value === '' && index > 0) {
                inputRefs.current[index - 1].focus();
            } else if (e.target.value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }

        setPin(newPin);
    };

    if (contextData !== 4) return null; // No renderizar nada si no es el contexto correcto
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mb-2">
                <Image
                    width={156.75}
                    height={118.84}
                    src={"/img/logo.svg"}
                    alt='easywork'
                    priority // Prioriza la carga de la imagen
                />
            </div>
            <div className="mb-4 text-xl">
                <h1>¡Valida tu usuario!</h1>
            </div>
            <div style={{ width: 320 }} className="text-md text-center my-4 w-1/4">
                <h4>Introducir los 6 dígitos recibidos por mensaje de texto o correo</h4>
            </div>
            <div className='p-4 bg-slate-50 rounded-xl'>
                <div className="flex flex-row gap-4">
                    {pin.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric" // Solo permitir números en el teclado móvil
                            pattern="[0-9]*" // Validar solo números
                            className="w-10 h-10 text-center bg-slate-200/80 !important border-transparent border-b-2 border-gray-400 focus:border-primary transition-colors"
                            value={value}
                            onChange={(e) => handleInput(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-4 w-full flex justify-evenly">
                <button
                    onClick={() => handleValidateOTP(true)}
                    style={{ backgroundColor: "#262261" }}
                    className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                    Aceptar
                </button>
                <button onClick={() => {
                    setPin(Array(6).fill(''));
                    setOtpToken(null);
                    setError(null);
                    setContextData(0)
                }} className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
                    Cancelar
                </button>
            </div>
            {error && <div className="mt-2 text-red-600">{error}</div>}
        </div>
    );
};
