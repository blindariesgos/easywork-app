'use client';
import React, { useState } from 'react';
import { Dialog, DialogPanel } from "@tremor/react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import SelectInput from '../../../../../../../../../components/form/SelectInput';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../../../../../../../../components/form/Button';
import TextInput from '../../../../../../../../../components/form/TextInput';
import InputDate from '../../../../../../../../../components/form/InputDate';
import { FaCalendarDays } from 'react-icons/fa6';

const status = [
    {
        id: 1,
        name: "Activo"
    },
    {
        id: 2,
        name: "Liquidado"
    },
    {
        id: 3,
        name: "Rechazado"
    }
]


export default function DialogUploadRefund({ isOpen, setIsOpen, contactID }) {
    const { t } = useTranslation();
    const [sending, setSending] = useState(false);

    const schema = yup.object().shape({
        file: yup.mixed().required(t('common:validations:required')),
        refund: yup.string().required(t('common:validations:required')),
        status: yup.string().required(t('common:validations:required')),
        date: yup.string().required(t('common:validations:required')),
    })

    const { register, handleSubmit, control, reset, setValue, watch, formState: { isValid, errors } } = useForm({
		defaultValues: {
		},
		mode: 'onChange',
		resolver: yupResolver(schema)
	});

    const handleSubmitData = async (data) => {
    //   setSending(true);
  
    //   const formData = new FormData();
      console.log("e.target", data)
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
					<h1 className="text-center text-lg font-medium">{t('contacts:edit:policies:refunds:upload')}</h1>
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
					<div className="grid sm:grid-cols-2 grid-cols-1 gap-2 w-full ">               
                        <TextInput
                            label={t('contacts:edit:policies:refunds:table:refund')}
                            error={errors.refund}
                            register={register}
                            name="refund"
                            border
                        />                 
                        <SelectInput
							label={t('contacts:edit:policies:refunds:table:status')}
                            name="status"
                            options={status}
                            border
                            error={!watch('status') && errors.status}
                            register={register}
                            setValue={setValue}
                        />
                        <Controller
                            render={({ field: { value, onChange, ref, onBlur } }) => {
                                return (
                                    <InputDate
                                        label={t('contacts:edit:policies:refunds:table:date')}
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        icon={<FaCalendarDays className='h-3 w-3 text-primary pr-4'/>}
                                        error={errors.date}
                                        border
                                    />
                                );
                            }}
                            name="date"
                            control={control}
                            defaultValue=""
                        />
					</div>
                    <div className='w-full'>
                        <Button
                            label={sending ? t('common:buttons:uploading') : t('common:buttons:upload')}
                            type="submit"
                            aria-disabled={sending || !isValid}
                            // disabled={sending || !isValid}
                            className="px-3 py-2 w-full"
                            buttonStyle="primary"
                        />
                    </div>
				</form>
			</DialogPanel>
		</Dialog>
	);
}
