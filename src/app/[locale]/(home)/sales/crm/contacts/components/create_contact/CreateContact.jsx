'use client';
import useAppContext from '@/context/app';
import { PencilIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import AddContactTabs from './AddContactTabs';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Button from '@/components/form/Button';
import TextInput from '@/components/form/TextInput';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InputPhone from '@/components/form/InputPhone';
import SelectInput from '@/components/form/SelectInput';
import InputDate from '@/components/form/InputDate';
import { FaCalendarDays } from 'react-icons/fa6';
import ActivityPanel from '../ActivityPanel';
import { getApiError } from '@/utils/getApiErrors';
import { createContact, updateContact, updatePhotoContact } from '@/lib/apis';
import SelectDropdown from '@/components/form/SelectDropdown';
import { DocumentSelector } from '@/components/DocumentSelector';
import ProfileImageInput from '@/components/ProfileImageInput';
import { useRouter } from 'next/navigation';

export default function CreateContact({ edit, id, lists }) {
	const { users, contactSources, contactTypes } = lists;
	const { t } = useTranslation();
	const { setOpenModal, contactDetailTab } = useAppContext();
	const [ openButtons, setOpenButtons ] = useState(!edit);
	const [ contactType, setContactType ] = useState(null);
	const [ contactSource, setContactSource ] = useState(null);
	const [ contactResponsible, setContactResponsible ] = useState(null);
	const [ files, setFiles ] = useState([]);
    const router = useRouter();

	const [ selectedProfileImage, setSelectedProfileImage ] = useState(null);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		if ( edit ) {
			setContactType(contactTypes.filter(option => option.id === edit?.type?.id )[0]);
			setContactSource(contactSources.filter(option => option.id === edit?.source?.id )[0]);
			setSelectedProfileImage({base64:edit?.photo || null, file: null})
		}
	}, [edit, contactTypes, contactSources])
	

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
		cua: Yup.string().required(t('common:validations:required')),
		typeContact: Yup.string().required(t('common:validations:required')),
		otherType: Yup.string(),
		origin: Yup.string().required(t('common:validations:required')),
		address: Yup.string().required(t('common:validations:required')),
		responsible: Yup.string().required(t('common:validations:required')),
		birthday: Yup.date().required(t('common:validations:required'))

		// files: Yup.array().of(Yup.object().shape({})).required('Debe seleccionar al menos un archivo'),
		// files: Yup
		// .array()
		// .min(1, 'Debe seleccionar al menos un archivo')
		// .required('Debe seleccionar al menos un archivo'),

		// files:Yup.mixed()
		//   .required("You need to provide a file")
		//   .test("fileSize", "File Size is too large", (value) => {
		//     return value[0].size <= 5242880;
		//   })
		// .test("fileType", "Unsupported File Format", (value) =>
		//   ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
		// ),
		// files: Yup.array().of(
		//   Yup.mixed().test('fileSize', 'El tamaño del archivo es demasiado grande', (value) => {
		//     // Realiza la validación del tamaño del archivo aquí
		//     // Devuelve true si el tamaño es válido, de lo contrario, devuelve false
		//     return value && value[0].size <= 1024 * 1024; // Ejemplo: tamaño máximo de 1MB
		//   })
		// ),
		// files: Yup.array().required('Debe seleccionar al menos un archivo.'),
	});

	const { register, handleSubmit, control, reset, setValue, watch, formState: { isValid, errors } } = useForm({
		defaultValues: {
			name: id ? edit?.fullName : "",
			charge: id ? edit?.cargo : "",
			phone: id ? edit?.phones[0]?.phone?.number : "",
			email: id ? edit?.emails[0]?.email?.email : "",
			rfc: id ? edit?.curp : "",
			cua: id ? edit?.cua : "",
			typeContact: id ? edit?.type?.id : "",
			origin: id ? edit?.source?.id : "",
			birthday: id ? edit?.birthdate : "",
			address: id? edit?.address : "",
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
		const body = {
			name: data.name,
			fullName: data.name,
			photo: id ? "" : selectedProfileImage?.file || "",
			cargo: data.charge,
			typeId: data.typeContact,
			curp: data.rfc,
			cua: data.cua,
			address: data.address,
			birthdate: data.birthday,
			sourceId: data.origin,
			emails_dto: JSON.stringify([{"email": data.email}]),
			phones_dto: [{"number": data.phone}],
			observadorId: data.responsible,
			assignedById: data.responsible
		}

		const formData = new FormData();
		for (const key in body) {
			if (body[key] instanceof File || body[key] instanceof Blob) {
			  formData.append(key, body[key]);
			} else if (Array.isArray(body[key])) {
			  formData.append(key, JSON.stringify(body[key]));
			} else {
			  formData.append(key, body[key]?.toString() || '');
			}
		}
		try {
			setLoading(true);
			if ( !edit ) {
				await createContact(formData);
				toast.success(t('contacts:create:msg'));
			}else {
				await updateContact(formData, id);
				if (selectedProfileImage.file){	
					const photo = new FormData();		
					photo.append("photo", selectedProfileImage.file);	
					await updatePhotoContact(photo, id);
				}
				toast.success(t('contacts:edit:updated-contact'));
			}
			setLoading(false);			
			router.push(`/sales/crm/contacts?page=1`);
		} catch (error) {
			getApiError(error.message);
			setLoading(false);			
		}
	};

	
	// Calculate the user's 18th birthday
	const eighteenYearsAgo = new Date();
	eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  

	return (
		<div className="flex flex-col h-screen relative w-full">
			{/* Formulario Principal */}
			{loading && (
				<div className="absolute z-50 inset-0 bg-easy-800/10 w-full h-full">
					{/* Loader spinner */}

					<div className="flex items-center justify-center h-full flex-col gap-2 cursor-progress">
						<div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-easy-600" />
						<p className="text-easy-600 animate-pulse select-none">{t('contacts:create:save')}</p>
					</div>
				</div>
			)}
			<div className="flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="flex flex-col flex-1 bg-gray-100 text-black overflow-hidden rounded-t-2xl rounded-bl-2xl relative"
				>
					{/* Encabezado del Formulario */}
					<div className="bg-transparent py-6 mx-4">
						<div className="flex items-start flex-col justify-between space-y-3 relative">
							{!id && <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-t-2xl" />}
							<div className='flex gap-2 items-center'>
								<h1 className="text-xl sm:pl-6 pl-2">
									{edit ? edit.fullName : t('leads:create:client')}
								</h1>
								<div>
									<PencilIcon className='h-4 w-4 text-gray-200'/>
								</div>
							</div>
							<AddContactTabs id={id} />
						</div>
					</div>

					{/* Panel Principal */}

					{/* {contactDetailTab === contactDetailTabs[0] && ( */}
					<div className="flex flex-col sm:flex-row h-full pb-[13.5rem] bg-white mx-4 rounded-lg p-4 w-full">
						{/* Menu Izquierda */}
						<div className="sm:w-2/5 bg-gray-100 overflow-y-scroll rounded-lg">
							<div className="flex justify-between bg-white py-4 px-4 rounded-md">
								<h1 className="">{t('contacts:create:data')}</h1>
								<button type="button" disabled={!id} onClick={() => setOpenButtons(!openButtons)}>
									<PencilIcon className="h-6 w-6 text-primary" />
								</button>
							</div>
							<div className="flex justify-center">
								<ProfileImageInput
									selectedProfileImage={selectedProfileImage}
									onChange={handleProfileImageChange}
									disabled={!openButtons}
								/>
							</div>
							<div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:max-w-xl lg:px-12 px-2 mb-10 mt-8">
								<TextInput
									type="text"
									label={t('contacts:create:name')}
									placeholder={t('contacts:create:placeholder-name')}
									error={errors.name}
									register={register}
									name="name"
									disabled={!openButtons}
									//value={watch('name')}
								/>
								<TextInput
									label={t('contacts:create:charge')}
									placeholder={t('contacts:create:charge')}
									error={errors.charge}
									register={register}
									//value={watch('charge')}
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
												label={t('contacts:create:phone')}
												defaultValue={field.value}
												disabled={!openButtons}
											/>
										);
									}}
									name="phone"
									control={control}
									defaultValue=""
								/>
								<Controller
									render={({ field: { value, onChange, ref, onBlur } }) => {
										return (
											<InputDate
												label={t('contacts:create:born-date')}
												value={value}
												onChange={onChange}
												onBlur={onBlur}
												icon={<FaCalendarDays className='h-3 w-3 text-primary pr-4'/>}
												error={errors.birthday}
												disabled={!openButtons}
												inactiveDate={eighteenYearsAgo}
											/>
										);
									}}
									name="birthday"
									control={control}
									defaultValue=""
								/>
								<TextInput
									label={t('contacts:create:email')}
									placeholder={t('contacts:create:placeholder-lastname')}
									error={errors.email}
									register={register}
									name="email"
									//value={watch('email')}
									disabled={!openButtons}
								/>
								<TextInput
									label={t('contacts:create:rfc')}
									placeholder="XEXX010101000"
									error={errors.rfc}
									register={register}
									name="rfc"
									disabled={!openButtons}
									//value={watch('rfc')}
								/>
								<SelectInput
									label={t('contacts:create:contact-type')}
									options={contactTypes}
									selectedOption={contactType && contactType}
									name="typeContact"
									error={!watch('typeContact') && errors.typeContact}
									register={register}
									setValue={setValue}
									disabled={!openButtons}
								/>
								{watch('typeContact') == 'Otro' ? (
									<TextInput
										label={t('contacts:create:otherType')}
										placeholder=""
										error={errors.otherType}
										register={register}
										name="otherType"
										disabled={!openButtons}
										//value={watch('otherType')}
									/>
								) : null}
								<TextInput
									label={t('contacts:create:address')}
									error={errors.address}
									register={register}
									name="address"
									placeholder={t('contacts:create:placeholder-address')}
									disabled={!openButtons}
									//value={watch('address')}
								/>
								<SelectInput
									label={t('contacts:create:origen')}
									name="origin"
									options={contactSources}
									selectedOption={contactSource && contactSource}
									error={!watch('origin') && errors.origin}
									register={register}
									setValue={setValue}
									disabled={!openButtons}
									//value={watch('origin')}
								/>
								<SelectDropdown
									label={t('contacts:create:responsible')}
									name="responsible"
									options={users}
									selectedOption={contactResponsible}
									register={register}
									disabled={!openButtons}
									error={!watch('responsible') && errors.responsible}
									setValue={setValue}
									// //value={watch('responsible')}
								/>
								<TextInput
									label={t('contacts:create:cua')}
									error={errors.cua}
									register={register}
									name="cua"
									disabled={!openButtons}
									//value={watch('cua')}
									// placeholder={t('contacts:create:placeholder-address')}
								/>
								<DocumentSelector name="files" onChange={handleFilesUpload} files={files} disabled={!openButtons} setFiles={setFiles}/>
							</div>
						</div>

						{/* Menu Derecha */}
						<ActivityPanel editing={!id} />
					</div>
					{/* )} */}

					{/* Botones de acción */}
					{(openButtons || !edit) && (
						<div className="flex justify-center px-4 py-4 gap-4 sticky bottom-0 bg-white">
							<Button
								type="submit"
								label={loading ? t('common:buttons:saving') : t('common:buttons:save')}
								disabled={loading}
								buttonStyle="primary"
								className="px-3 py-2"
								// onclick={() => handleSubmit(handleFormSubmit)}
							/>
							<Button
								type="button"
								label={t('common:buttons:cancel')}
								disabled={loading}
								buttonStyle="secondary"
								onclick={() => router.back()}
								className="px-3 py-2"
							/>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}




