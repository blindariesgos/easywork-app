'use client';
import React, { useState } from 'react';
import { Dialog, DialogPanel } from "@tremor/react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useFormState } from "react-dom";
import useCrmContext from "@/context/crm";
import { subirPolizaPDF } from '@/lib/api';
import SelectInput from '@/components/form/SelectInput';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/form/Button';

const company = [{ id: 1, name: "GNP" }, {id: 2, name: "TEST"}];

const typePoliza = [
  { id: 1, name: "Auto" },
  { id: 2, name: "Gastos Médicos" },
  { id: 3, name: "Vida" },
];
const initialState = {
    filePdf: "",
    aseguradora: "",
    tipo: "",
};

export default function DialogUploadFile({ isOpen, setIsOpen, contactID }) {
    const { t } = useTranslation();
    const [sending, setSending] = useState(false);
    const [state, formAction] = useFormState(subirPolizaPDF, initialState);
    const { setLastContactUpdate } = useCrmContext();
    const schema = yup.object().shape({
        company: yup.string().required(t('common:validations:required')),
        type: yup.string().required(t('common:validations:required')),
        file: yup.mixed().required(t('common:validations:required')),
    })

    const { register, handleSubmit, control, reset, setValue, watch, formState: { isValid, errors } } = useForm({
		defaultValues: {
		},
		mode: 'onChange',
		resolver: yupResolver(schema)
	});

    const handleSubmitData = async (data) => {
    //   setSending(true);
  
      const formData = new FormData();
      console.log("e.target", data)
  
      // try {
      //   const result = await subirPolizaPDF(state, formData);
  
      //   if (!result?.id) {
      //     if (result?.error) {
      //       return toast.error(result.message || t('contacts:edit:policies:exists'));
      //     }
      //     return toast.error(t('contacts:edit:policies:error-file'));
      //   }
  
      //   setLastContactUpdate(Date.now());
      //   toast.success(t('contacts:edit:policies:created'));
      // } catch (error) {
      //   toast.error(t('contacts:edit:policies:error-file'));
      // } finally {
      //   setIsOpen(false);
      //   setFile(null);
      //   setSending(false);
      // }
    };
	return (
		<Dialog
			open={isOpen}
			onClose={(val) => {
				// setFile(null);
                reset();
				setIsOpen(val);
			}}
			static={true}
		>
			<DialogPanel>
				<form onSubmit={handleSubmit(handleSubmitData)} className="flex w-full flex-col gap-y-3">
					<h1 className="text-center text-lg font-medium">{t('contacts:edit:policies:upload')}</h1>
					<label
						type="button"
						htmlFor="filePdf"
						className="relative cursor-pointer block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						<BsFileEarmarkPdf
							className={clsx(watch('file') ? 'text-easy-600' : 'text-gray-400', 'mx-auto h-12 w-12')}
							aria-hidden="true"
						/>
						<span className="mt-2 block text-sm font-semibold text-gray-900">
							{watch('file')?.length > 0 ? watch('file')[0]?.name : t('contacts:edit:policies:select')}
						</span>
					</label>
					<input
						id="filePdf"
						name="filePdf"
						type="file"
						aria-disabled={sending}
						accept="application/pdf"
						disabled={sending}
						className="sr-only"
                        {...register("file")}
					/>
                    {errors.file && <p>{errors.file.message}</p>}
					<div className="flex gap-2 w-full">                        
                        <SelectInput
							label={t('contacts:edit:policies:insurance')}
                            name="company"
                            options={company}
                            border
                            errors={errors.company}
                            register={register}
                            setValue={setValue}
                        />
                        <SelectInput
							label={t('contacts:edit:policies:policy-type')}
                            name="type"
                            options={typePoliza}
                            border
                            register={register}
                            setValue={setValue}
                        />
					</div>
                    <div className='w-full'>
                        <Button
                            label={sending ? t('common:buttons:uploading') : t('common:buttons:upload')}
                            type="submit"
                            aria-disabled={sending || !isValid}
                            disabled={sending || !isValid}
                            className="px-3 py-2 w-full"
                            buttonStyle="primary"
                        />
                    </div>
				</form>
			</DialogPanel>
		</Dialog>
	);
}
