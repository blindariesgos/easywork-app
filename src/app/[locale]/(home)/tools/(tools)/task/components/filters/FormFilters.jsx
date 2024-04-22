import Button from '@/components/form/Button';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useCommon, useTasks } from '@/hooks/useCommon';
import SelectInput from '@/components/form/SelectInput';
import TextInput from '@/components/form/TextInput';
import { PlusIcon } from '@heroicons/react/20/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddFields from './AddFields';
import MultipleSelect from '@/components/form/MultipleSelect';
import InputDateFilter from './InputDateFilter';
import SelectDropdown from '@/components/form/SelectDropdown';
import useAppContext from '@/context/app';

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

const FormFilters = () => {
	const { t } = useTranslation();
	const { statusLead, stagesLead } = useCommon();
	const { lists } = useAppContext();
	const { users } = lists;
	const { status } = useTasks();

	const schema = yup.object().shape({
		role: yup.string(),
		status: yup.array().min(1, t('common:validations:min-array', { min: 1 })),
		responsible: yup.string(),
		limitDate: yup.object(),
		newDate: yup.string(),
		createdThe: yup.object(),
		newDate1: yup.string(),
		createdBy: yup.string(),
		closedThe: yup.object(),
		newDate2: yup.string(),
		labels: yup.array(),
		fields: yup.array().of(yup.object().shape({}))
	});
	const [ dateRange, setDateRange ] = useState([ null, null ]);
	const [ dateRangeThe, setDateRangeThe ] = useState([ null, null ]);
	const [ dateRangeClosedThe, setDateRangeClosedThe ] = useState([ null, null ]);
	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		getValues,
		watch,
		formState: { isValid, errors }
	} = useForm({
		defaultValues: {
			range: [ null, null ]
		},
		mode: 'onChange',
		resolver: yupResolver(schema)
	});

	console.log('data', errors);
	const handleFormFilters = (data) => {
		console.log('data', data);
	};

	useEffect(() => {
		reset();
	}, []);


	const { fields, append, remove } = useFieldArray({
		control,
		name: 'fields'
	});
	
	return (
		<form onSubmit={handleSubmit(handleFormFilters)}>
			<div className='h-[325px] overflow-y-auto '>
				<div className='grid grid-cols-1 gap-2 sm:w-96 w-72 px-2 mb-4'>
					<Controller
						name="role"
						control={control}
						defaultValue={''}
						render={({ field }) => {
							return (
								<SelectInput
									{...field}
									label={t('tools:tasks:filters:fields:role')}
									name="role"
									options={contactSources}
									error={!field.value && errors.role}
									setValue={setValue}
								/>
							);
						}}
					/>
					<Controller
						name="status"
						control={control}
						defaultValue={[]}
						render={({ field }) => (
							<MultipleSelect
								{...field}
								options={status}
								getValues={getValues}
								setValue={setValue}
								name="status"
								label={t('tools:tasks:filters:fields:status')}
								error={errors.status}
							/>
						)}
					/>
					<SelectDropdown
						label={t('tools:tasks:filters:fields:responsible')}
						name="responsible"
						options={users}
						setValue={setValue}
					/>
					<InputDateFilter 
						label={t('tools:tasks:filters:fields:limit-date')}
						watch={watch} 
						setValue={setValue} 
						register={register} 
						nameDate={'newDate'} 
						name="limitDate" 
						dateRange={dateRange} 
						setDateRange={setDateRange}
					/>
					<InputDateFilter 
						label={t('tools:tasks:filters:fields:createdThe')}
						watch={watch} 
						setValue={setValue} 
						register={register} 
						nameDate={'newDate1'} 
						name="createdThe" 
						dateRange={dateRangeThe} 
						setDateRange={setDateRangeThe}
					/>
					<SelectDropdown
						label={t('tools:tasks:filters:fields:createdBy')}
						name="createdBy"
						options={users}
						setValue={setValue}
					/>
					<Controller
						name="labels"
						control={control}
						defaultValue={[]}
						render={({ field }) => (
							<MultipleSelect
								{...field}
								options={status}
								getValues={getValues}
								setValue={setValue}
								name="labels"
								label={t('tools:tasks:filters:fields:tag')}
								error={errors.labels}
							/>
						)}
					/>
					<InputDateFilter 
						label={t('tools:tasks:filters:fields:closed')}
						watch={watch} 
						setValue={setValue} 
						register={register} 
						nameDate={'newDate2'} 
						name="closedThe" 
						dateRange={dateRangeClosedThe} 
						setDateRange={setDateRangeClosedThe}
					/>
					{fields.map((field, index) => {
							{console.log("fields[${index}].value", `fields[${index}].value`)}
						return (
							<div key={field.id}>
								{field.type === 'input' && (
									<TextInput
										label={field.name}
										type="text"
										name={`fields[${index}].value`}
										register={register}
									/>
								)}
								{field.type === 'select' && (
									<SelectInput
										{...field}
										label={field.name}
										name={`fields[${index}].value`}
										options={field.options}
										register={register}
										setValue={setValue}
									/>
								)}
								{field.type === 'dropdown' && (
									<SelectDropdown
										label={field.name}
										name={`fields[${index}].value`}
										options={field.options}
										setValue={setValue}
									/>
								)}
								{field.type === 'date' && (
									<InputDateFilter 
										{...field}
										label={field.name}
										watch={watch} 
										setValue={setValue} 
										register={register} 
										nameDate={field.date} 
										name={`fields[${index}].value`}
										dateRange={field.state === 1 ? dateRange : field.state === 2 ? dateRangeThe : dateRangeClosedThe} 
										setDateRange={field.state === 1 ? setDateRange : field.state === 2 ? setDateRangeThe : setDateRangeClosedThe}
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>
			<div className="my-2 flex gap-2 items-center">
				<AddFields append={append} remove={remove} fields={fields} />
				<Button
					type="button"
					label={t('tools:tasks:filters:restore-fields')}
					buttonStyle="text"
					iconLeft={<PlusIcon className="h-4 w-4 text-gray-60" />}
					onclick={() => {
						setValue('fields', []);
						reset();
					}}
				/>
			</div>
			<div className="flex gap-2 justify-center mt-4">
				<Button
					type="submit"
					label={t('tools:tasks:filters:search')}
					buttonStyle="primary"
					className="py-1 px-3"
					iconLeft={<FaMagnifyingGlass className="h-4 w-4 text-white" />}
				/>
				<Button
					type="button"
					label={t('tools:tasks:filters:reset')}
					buttonStyle="secondary"
					className="py-1 px-3"
					onclick={() => { setValue("fields", []); reset() }}
				/>
			</div>
		</form>
	);
};

export default FormFilters;
