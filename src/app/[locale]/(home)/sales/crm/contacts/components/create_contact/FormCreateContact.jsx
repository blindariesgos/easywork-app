import React, { useCallback, useState } from 'react';
import ProfileImageInput from './ProfileImageInput';
import TextInput from '@/components/form/TextInput';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InputPhone from '@/components/form/InputPhone';
import SelectInput from '@/components/form/SelectInput';
import SelectDropdown from './SelectDropdown';
import { DocumentTextIcon, PhotoIcon, UserIcon, VideoCameraIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { contactTypes, filterOptions, responsible } from '@/lib/common';

const contactSources = [
    { id: 1, name: "Correo electrónico" },
    { id: 2, name: "Maratón de llamadas" },
    { id: 3, name: "Formulario de CRM" },
    { id: 4, name: "Formulario de devolución de llamada" },
    { id: 5, name: "Gestión del agente" },
    { id: 6, name: "Red social - LinkedIn" },
    { id: 7, name: "Red social - Instagram" },
    { id: 8, name: "Red social - Facebook" },
    { id: 9, name: "Red social - Otra" },
    { id: 10, name: "Otro CRM" },
    { id: 11, name: "Página de ventas" },
    { id: 12, name: "Teléfono" },
    { id: 13, name: "WhatsApp" },
];

const FormCreateContact = () => {
	const { t } = useTranslation();
	const [ query, setQuery ] = useState('');
	const [ querySource, setQuerySource ] = useState('');
	const [ queryResponsible, setQueryResponsible ] = useState('');
	const [ querySexo, setQuerySexo ] = useState('');

	const [ contactType, setContactType ] = useState(null);
	const [ contactSource, setContactSource ] = useState(null);
	const [ contactResponsible, setContactResponsible ] = useState(null);
	const [ contactSexo, setContactSexo ] = useState(null);
	const [ files, setFiles ] = useState([]);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);

	const schema = Yup.object().shape({
		email: Yup.string()
			.required(t('common:validations:required'))
			.email(t('common:validations:email'))
			.min(5, t('common:validations:min', { min: 5 })),
		name: Yup.string().required(t('common:validations:required')).min(2, t('common:validations:min', { min: 2 })),
		charge: Yup.string().required(t('common:validations:required')),
		phone: Yup.string().required(t('common:validations:required')),
		rfc: Yup.string().required(t('common:validations:required')),
		cua: Yup.string().required(t('common:validations:required')),
		typeContact: Yup.string().required(t('common:validations:required')),
		origin: Yup.string().required(t('common:validations:required')),
		address: Yup.string().required(t('common:validations:required')),
		responsible: Yup.string().required(t('common:validations:required'))

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

	const { register, handleSubmit, control, reset, setValue, formState: { isValid, errors } } = useForm({
		defaultValues: {},
		mode: 'onChange',
		resolver: yupResolver(schema)
	});

	const handleProfileImageChange = useCallback((event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				setSelectedProfileImage(e.target.result);
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

	const handleBirthdayChange = useCallback((value) => {
		const date = new Date(value);
		const formattedDate = value ? date.toISOString().split('T')[0] : '';
		setBirthday(formattedDate);
	}, []);

	const filteredContactTypes = filterOptions(query, contactTypes);
	const filteredContactSources = filterOptions(querySource, contactSource);
	// const filteredContactResponsible = filterOptions(queryResponsible, crmUsers);
	const filteredContactResponsible = filterOptions(queryResponsible, responsible);
	// const filteredSexoOptions = filterOptions(querySexo, sexoOptions);

	return (
		<div className="sm:w-2/5 bg-gray-100 overflow-y-scroll rounded-lg">
			<h1 className="bg-white py-4 px-4 rounded-md">{t('contacts:create:data')}</h1>
			<div className="flex justify-center">
				<ProfileImageInput selectedProfileImage={selectedProfileImage} onChange={handleProfileImageChange} />
			</div>
			<div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:max-w-xl lg:px-12 px-2 mb-10 mt-8">
				<TextInput
					type="text"
					label={t('contacts:create:name')}
					placeholder={t('contacts:create:placeholder-name')}
					error={errors.name}
					register={register}
					name="name"
				/>
				<TextInput
					label={t('contacts:create:charge')}
					placeholder={t('contacts:create:charge')}
					error={errors.charge}
					register={register}
					name="charge"
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
							/>
						);
					}}
					name="phone"
					control={control}
					defaultValue=""
				/>
				<TextInput
					label={t('contacts:create:email')}
					placeholder={t('contacts:create:placeholder-lastname')}
					error={errors.email}
					register={register}
					name="email"
				/>
				<TextInput
					label={t('contacts:create:rfc')}
					placeholder="XEXX010101000"
					error={errors.rfc}
					register={register}
					name="rfc"
				/>
				<SelectInput
					label={t('contacts:create:contact-type')}
					options={filteredContactTypes}
					selectedOption={contactType}
					onChangeInput={setQuery}
					// query={query}
					name="typeContact"
					error={errors.typeContact}
					register={register}
				/>
				<TextInput
					label={t('contacts:create:address')}
					error={errors.address}
					register={register}
					name="address"
					placeholder={t('contacts:create:placeholder-address')}
				/>
				<SelectInput
					label={t('contacts:create:origen')}
					name="origin"
					options={filteredContactSources}
					selectedOption={contactSource}
					onChangeInput={setQuerySource}
					error={errors && errors.origin}
					register={register}
					setValue={setValue}
				/>
				<SelectDropdown
					label={t('contacts:create:responsible')}
					name="responsible"
					options={filteredContactResponsible}
					selectedOption={contactResponsible}
					onChangeInput={setQueryResponsible}
					error={errors.responsible}
					register={register}
				/>
				<TextInput
					label={t('contacts:create:cua')}
					error={errors.cua}
					register={register}
					name="cua"
					// placeholder={t('contacts:create:placeholder-address')}
				/>
				<DocumentSelector name="files" onChange={handleFilesUpload} files={files} />
				{/* <TextInputLocal label={t('contacts:create:charge')} id="position" placeholder={t('contacts:create:charge')} />
            <TextInputLocal
            label={t('contacts:create:curp')}
            id="curp"
            placeholder="124125153534"
            hidden
            errors={errors}
            />
            <TextInputLocal
            label={t('contacts:create:phone')}
            id="telefono"
            placeholder="+1 (555) 987-6543"
            type="tel"
            />
            <TextInputLocal
            label={t('contacts:create:email')}
            id="email"
            placeholder="usuario@domain.com"
            type="email"
            errors={errors}
            />
            <div className="col-span-full">
            <label
                htmlFor="nacimiento"
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {t('contacts:create:born-date')}
            </label>
            <DatePicker
                locale={locale === "es" ? es : enUS}
                enableYearNavigation={true}
                placeholder={t('contacts:create:select')}
                displayFormat="dd/MM/yyyy"
                onValueChange={handleBirthdayChange}
            />
            <input
                type="hidden"
                name="nacimiento"
                id="nacimiento"
                value={birthday}
            />
            </div>
            <SelectInput
            label={t('contacts:create:sex')}
            id="sexo"
            options={filteredSexoOptions}
            selectedOption={contactSexo}
            setSelectedOption={setContactSexo}
            onChangeInput={setQuerySexo}
            />
            <TextInputLocal
            label={t('contacts:create:rfc')}
            id="rfc"
            placeholder="XEXX010101000"
            />
            <TextInputLocal
            label={t('contacts:create:zip-code')}
            id="postal"
            placeholder="Ej.: 12345"
            hidden
            type="text"
            />
            <TextArea
            label={t('contacts:create:address')}
            id="direccion"
            placeholder={t('contacts:create:placeholder-address')}
            />
            <SelectInput
            label={t('contacts:create:contact-type')}
            id="tipoContacto"
            options={filteredContactTypes}
            selectedOption={contactType}
            setSelectedOption={setContactType}
            onChangeInput={setQuery}
            />
            <SelectInput
            label={t('contacts:create:responsible')}
            id="responsible"
            options={filteredContactResponsible}
            selectedOption={contactResponsible}
            setSelectedOption={setContactResponsible}
            onChangeInput={setQueryResponsible}
            />
            <TextInputLocal label={t('contacts:create:agent')} id="agente" placeholder={t('contacts:create:agent')} />
            <TextInputLocal
            label={t('contacts:create:sub-agent')}
            id="subAgente"
            placeholder={t('contacts:create:sub-agent')}
            />
            <SelectInput
            label={t('contacts:create:origen')}
            id="origen"
            options={filteredContactSources}
            selectedOption={contactSource}
            setSelectedOption={setContactSource}
            onChangeInput={setQuerySource}
            className="pb-4"
            /> */}
			</div>
		</div>
	);
};

export default FormCreateContact;

function DocumentSelector({ onChange, files, ...props }) {
	const { t } = useTranslation();

	const handleDrop = (event) => {
		event.preventDefault();
		onChange(event, true);
	};

	return (
		<div className="col-span-full">
			<label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
				{t('contacts:create:passport')}
			</label>
			<div
				className="mt-2  rounded-lg border border-dashed border-gray-900/25 py-6 px-2 relative"
				onDrop={handleDrop}
				onDragOver={(event) => event.preventDefault()}
			>
				<div>
					<div className="grid grid-cols-3 gap-x-2">
						{files.length > 0 &&
							files.map((file, index) => (
								<div key={index} className="flex flex-col items-center">
									<DocumentTextIcon className="h-10 w-10 text-primary" />
									<p className="text-[10px]">{file.name}</p>
								</div>
							))}
					</div>
					{files.length === 0 && (
						<div className="">
							<PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
						</div>
					)}
				</div>
				<div className="text-center">
					<div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
						<label
							htmlFor="file-upload"
							className="relative cursor-pointer rounded-md bg-zinc-100 font-semibold text-primary focus-within:outline-none  focus-within:ring-primary  hover:text-indigo-600 outline-none focus:ring-0 focus-within:ring-0"
						>
							<span>{t('contacts:create:upload-file')}</span>
							<input
								type="file"
								accept="image/*,application/pdf"
								onChange={(event) => onChange(event)}
								id="file-upload"
								className="sr-only outline-none focus:ring-0"
								multiple
								{...props}
							/>
						</label>
						<p className="pl-1">{t('contacts:create:drap-drop')}</p>
					</div>
					<p className="text-xs leading-5 text-gray-600">{t('contacts:create:png')}</p>
				</div>
			</div>
			{files.length === 0 && <p className="mt-1 text-xs text-red-600">{t('common:validations:file')}</p>}
		</div>
	);
}
