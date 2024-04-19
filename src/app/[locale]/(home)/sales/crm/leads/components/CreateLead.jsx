'use client';
import { DocumentSelector } from '@/components/DocumentSelector';
import LoaderSpinner from '@/components/LoaderSpinner';
import ProfileImageInput from '@/components/ProfileImageInput';
import InputDate from '@/components/form/InputDate';
import InputPhone from '@/components/form/InputPhone';
import SelectDropdown from '@/components/form/SelectDropdown';
import SelectInput from '@/components/form/SelectInput';
import { PencilIcon } from '@heroicons/react/20/solid';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaCalendarDays } from 'react-icons/fa6';
import ActivityPanel from '../../contacts/components/ActivityPanel';
import Button from '@/components/form/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { contactTypes, responsible } from '@/lib/common';
import { toast } from 'react-toastify';
import HeaderCrm from '../../HeaderCrm';
import { useLeads } from '@/hooks/useCommon';
import ProgressStages from './ProgressStages';
import TextInput from '@/components/form/TextInput';
import { useRouter } from 'next/navigation';

const contactSources = [
	{ id: 1, name: 'Correo electrónico' },
	{ id: 2, name: 'Maratón de llamadas' },
	{ id: 3, name: 'Formulario de CRM' },
	{ id: 4, name: 'Formulario de devolución de llamada' },
	{ id: 5, name: 'Gestión del agente' },
	{ id: 6, name: 'Red social - LinkedIn' },
	{ id: 7, name: 'Red social - Instagram' },
	{ id: 8, name: 'Red social - Facebook' },
	{ id: 9, name: 'Red social - Otra' },
	{ id: 10, name: 'Otro CRM' },
	{ id: 11, name: 'Página de ventas' },
	{ id: 12, name: 'Teléfono' },
	{ id: 13, name: 'WhatsApp' }
];

export default function CreateLead({ edit, id }) {
    const { t } = useTranslation();
    const [ openButtons, setOpenButtons ] = useState();
    const [ selectedProfileImage, setSelectedProfileImage ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ files, setFiles ] = useState([]);
    const { optionsHeader } = useLeads();
    const router = useRouter();
	useEffect(() => {
		setOpenButtons(id ? false : true)
	}, [id])
	
  
	console.log("openButtons",openButtons)
    const schema = Yup.object().shape({
          email: Yup
            .string()
            .required(t('common:validations:required'))
            .email(t('common:validations:email'))
            .min(5,  t('common:validations:min', { min: 5 })),
          name: Yup.string().required(t('common:validations:required')).min(2, t('common:validations:min', {min: 2})),
          charge: Yup.string().required(t('common:validations:required')),
          phone: Yup.string().required(t('common:validations:required')),
          rfc: Yup.string().required(t('common:validations:required')),
          typeContact: Yup.string().required(t('common:validations:required')),
          otherType: Yup.string(),
          origin: Yup.string().required(t('common:validations:required')),
          address: Yup.string().required(t('common:validations:required')),
          responsible: Yup.string().required(t('common:validations:required')),
          amount: Yup.number()
          .typeError(t('common:validations:number'))
          .positive()
          .transform((value, originalValue) => {
            if (typeof value === 'string') {
              const floatValue = parseFloat(value);
              return isNaN(floatValue) ? originalValue : floatValue;
            }
            return value;
          }).required(t('common:validations:required')),

      });
  
      const { register, handleSubmit, control, reset, setValue, watch, formState: { isValid, errors } } = useForm({
          defaultValues: {
              name: id ? "Armando Alvarado" : "",
              charge: id ? "Programador" : "",
              phone: id ? "5284791145" : "",
              email: id ? "test@gmail.com" : "",
              rfc: id ?  "fcdvv" : "",
              amount: id ? "2022.00" : "",
              typeContact: id ? "Amigo" : "",
              otherType: id ? "" : "",
              origin: id ? "Correo electrónico" : "",
              responsible: id ? "Nathaly Polin": "",
              address: id ? "Address": ""
          },
          mode: 'onChange',
          resolver: yupResolver(schema)
      });
  
      const handleProfileImageChange = useCallback((event) => {
          const file = event.target.files[0];
  
          if (file) {
              const reader = new FileReader();
  
              reader.onload = (e) => {
                  setSelectedProfileImage({base64:e.target.result, file: file});
              };
  
              reader.readAsDataURL(file);
          }
      }, []);
    
      const handleFilesUpload = (event, drop) => {
          let uploadedImages = [ ...files ];
          const fileList = drop ? event.dataTransfer.files : event.target.files;
  
          if (fileList) {
              for (let i = 0; i < fileList.length; i++) {
                  const file = fileList[i];
                  if (file.size > 5 * 1024 * 1024) {
                      toast.error(t('common:validations:size', { size: 5 }));
                      return;
                  } else {
                      const reader = new FileReader();
  
                      reader.onload = (e) => {
                          setTimeout(() => {
                              const existFile = uploadedImages.some((item) => item.name === file.name);
                              if (!existFile) {
                                  uploadedImages = [
                                      ...uploadedImages,
                                      { base64: reader.result, type: file.type.split('/')[0], name: file.name }
                                  ];
                                  setFiles(uploadedImages);
                              }
                          }, 500);
                      };
                      reader.readAsDataURL(file);
                  }
              }
          }
      };
  
    const handleFormSubmit = async (data) => {
        console.log('data', data);
    };
	
	return (
		<div className="flex flex-col h-screen relative w-full">
			{/* Formulario Principal */}
			{loading && <LoaderSpinner />}
			<div className="flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="flex flex-col flex-1 bg-gray-100 text-black overflow-hidden rounded-t-2xl rounded-bl-2xl relative"
				>
					{/* Encabezado del Formulario */}
					<div className="bg-transparent py-6 mx-4">
						<div className="flex items-start flex-col justify-between space-y-3 relative">
							{!id && <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-t-2xl" />}
							<div className="flex gap-2 items-center">
								<h1 className="text-xl sm:pl-6 pl-2">
									{edit ? edit.fullName : t('leads:lead:new')}
								</h1>
								<div>
									<PencilIcon className="h-4 w-4 text-gray-200" />
								</div>
							</div>
                            <div className='px-4 py-4'>
                                <ProgressStages/>
                            </div>
							<div className="mt-4 w-full px-4">
								<HeaderCrm options={optionsHeader} />
							</div>
						</div>
					</div>

					{/* Panel Principal */}

					{/* {contactDetailTab === contactDetailTabs[0] && ( */}
					<div className="flex flex-col md:flex-row h-full pb-0 md:pb-[20rem] bg-white mx-4 rounded-lg p-4 w-full">
						{/* Menu Izquierda */}
						<div className="md:w-2/5 bg-gray-100 overflow-y-scroll rounded-lg">
							<div className="flex justify-between bg-white py-4 px-4 rounded-md">
								<h1 className="">{t('leads:lead:lead-data')}</h1>
								<button type="button" disabled={!id} onClick={() => setOpenButtons(!openButtons)}>
									<PencilIcon className="h-6 w-6 text-primary" />
								</button>
							</div>
							<div className="flex justify-center">
								<ProfileImageInput
									selectedProfileImage={selectedProfileImage}
									onChange={handleProfileImageChange}
								/>
							</div>
							<div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:max-w-xl lg:px-12 px-2 mb-10 mt-8">
								<TextInput
									type="text"
									label={t('leads:lead:fields:fullname')}
									placeholder={t('leads:lead:fields:placeholder-name')}
									error={errors.name}
									register={register}
									name="name"
									disabled={!openButtons}
									// value={watch('name')}
								/>
								<TextInput
									label={t('leads:lead:fields:charge')}
									placeholder={t('leads:lead:fields:charge')}
									error={errors.charge}
									register={register}
									// value={watch('charge')}
									name="charge"
									disabled={!openButtons}
								/>
								<Controller
									render={({ field: { ref, ...field } }) => {
										return (
											<InputPhone
												name="phone"
												field={field}
												error={errors.phone}
												label={t('leads:lead:fields:phone-number')}
												defaultValue={field.value}
												disabled={!openButtons}
											/>
										);
									}}
									name="phone"
									control={control}
									defaultValue=""
								/>
								<TextInput
									label={t('leads:lead:fields:email')}
									placeholder={"Ej: example@gmail.com"}
									error={errors.email}
									register={register}
									name="email"
									// value={watch('email')}
									disabled={!openButtons}
								/>
								<TextInput
									label={t('leads:lead:fields:rfc')}
									placeholder="XEXX010101000"
									error={errors.rfc}
									register={register}
									name="rfc"
									disabled={!openButtons}
									// value={watch('rfc')}
								/>
								<TextInput
									label={t('leads:lead:fields:address')}
									error={errors.address}
									register={register}
									name="address"
									placeholder={t('leads:lead:fields:placeholder-address')}
									disabled={!openButtons}
									// value={watch('address')}
								/>
								<SelectInput
									label={t('leads:lead:fields:contact-type')}
									options={contactTypes}
                                    selectedOption={contactTypes.filter(option => option.name === watch('typeContact'))[0]}
									name="typeContact"
									error={!watch('typeContact') && errors.typeContact}
									register={register}
									setValue={setValue}
									disabled={!openButtons}
									// value={watch('typeContact')}
								/>
								{watch('typeContact') == 'Otro' ? (
									<TextInput
										label={t('leads:lead:fields:otherType')}
										placeholder=""
										error={errors.otherType}
										register={register}
										name="otherType"
										disabled={!openButtons}
										// value={watch('otherType')}
									/>
								) : null}
								<SelectDropdown
									label={t('leads:lead:fields:responsible')}
									name="responsible"
									options={responsible}
									register={register}
									disabled={!openButtons}
                                    selectedOption={responsible.filter(option => option.name === watch('responsible'))[0]}
									error={!watch('responsible') && errors.responsible}
									setValue={setValue}
									// value={watch('responsible')}
								/>
								<SelectInput
									label={t('leads:lead:fields:origin')}
									name="origin"
									options={contactSources}
                                    selectedOption={contactSources.filter(option => option.name === watch('origin'))[0]}
									error={!watch('origin') && errors.origin}
									register={register}
									setValue={setValue}
									disabled={!openButtons}
									// value={watch('origin')}
								/>
								<TextInput
									label={t('leads:lead:fields:amount')}
									error={errors.amount}
									register={register}
									name="amount"
									disabled={!openButtons}
								/>
								<DocumentSelector
									name="files"
									onChange={handleFilesUpload}
									files={files}
									disabled={!openButtons}
									setFiles={setFiles}
								/>
							</div>
						</div>

						{/* Menu Derecha */}
						<ActivityPanel editing={!id} />
					</div>

					{/* Botones de acción */}
					{!openButtons || (!edit) && (
						<div className="flex justify-center gap-4 sticky bottom-0 bg-white pt-3 pb-2">
							<Button
								type="submit"
								label={loading ? t('common:buttons:saving') : t('common:buttons:save')}
								disabled={loading}
								buttonStyle="primary"
								className="px-3 py-2"
							/>
							<Button
								type="button"
								label={t('common:buttons:cancel')}
								disabled={loading}
								buttonStyle="secondary"
								onclick={() => router.push(`/sales/crm/leads?page=1`)}
								className="px-3 py-2"
							/>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
