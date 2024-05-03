import Button from '../../../../../../../../components/form/Button';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useCommon } from '../../../../../../../../hooks/useCommon';
import SelectInput from '../../../../../../../../components/form/SelectInput';
import TextInput from '../../../../../../../../components/form/TextInput';
import {
	PlusIcon,
  } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddFields from './AddFields';
import MultipleSelect from '../../../../../../../../components/form/MultipleSelect';


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

const FormFilters = () => {
	const { t } = useTranslation();
	const { createdDate, statusLead, stagesLead } = useCommon();

	const schema = yup.object().shape({
		origin: yup.string(),
		stages: yup.string(),
		date: yup.object(),
		status: yup.array().min(1, t("common:validations:min-array", {min: 1})),
		createdBy: yup.string(),
		ndays: yup.number(),
		month: yup.string(),
		quarter: yup.string(),
		year: yup.string(),
		exactDate: yup.string(),
		fields: yup.array().of(
		  yup.object().shape({
		  }),
		),
	});
	const [dateRange, setDateRange] = useState([null, null]);
	const [startDate, endDate] = dateRange;
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
		watch,
        formState: { isValid, errors },
      } = useForm({
          defaultValues: {
			range: [null, null],
          },
          mode: "onChange",
          resolver: yupResolver(schema),
      });

  const handleFormFilters = (data) => {
    console.log("data", data);
  };

  useEffect(() => {
    reset();
  }, [reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'fields',
	});
	
	return (
		<form onSubmit={handleSubmit(handleFormFilters)} className="grid grid-cols-1 gap-2 sm:w-96 w-72 px-2">
			<Controller
				name="origin"
				control={control}
				defaultValue={""}
				render={({ field }) => {
				return (
					<SelectInput
						{...field}
						label={t("leads:filters:origin")}
						name="origin"
						options={contactSources}
						error={!field.value && errors.origin}
						setValue={setValue}
					/>
				);
				}}
			/>
			<Controller
				name="stages"
				control={control}
				defaultValue={""}
				render={({ field }) => {
				return (
					<SelectInput
						{...field}
						label={t("leads:filters:stages:name")}
						name="stages"
						options={stagesLead}
						error={!field.value && errors.stages}
						setValue={setValue}
					/>
				);
				}}
			/>
			<div className="flex gap-2 items-end">
				<div className={`${watch("date")?.date ? "w-2/5" : "w-full"}`}>
				<SelectInput
					label={t("leads:filters:created")}
					name="date"
					options={createdDate}
					setValue={setValue}
					object={true}
				/>
				</div>
				{watch("date")?.date === "input" && (
				<div className="w-3/5">
					<TextInput type="number" name="ndays" register={register} />
				</div>
				)}
				{watch("date")?.date === "month" && (
				<div className="w-3/5 flex gap-2">
					<DatePicker
					selected={watch("month")}
					onChange={(date) => setValue("month", date)}
					showMonthYearPicker
					dateFormat="MM/yyyy"
					className="w-full border-none drop-shadow-sm h-9 rounded-md text-sm focus:ring-0"
					/>
				</div>
				)}
				{watch("date")?.date === "quarter" && (
				<div className="w-3/5 flex gap-2">
					<DatePicker
					selected={watch("quarter")}
					onChange={(date) => setValue("quarter", date)}
					showQuarterYearPicker
					dateFormat="yyyy, QQQ"
					className="w-full border-none drop-shadow-sm h-9 rounded-md text-sm focus:ring-0"
					/>
				</div>
				)}
				{watch("date")?.date === "year" && (
				<div className="w-3/5 flex gap-2">
					<DatePicker
					selected={watch("year")}
					onChange={(date) => setValue("year", date)}
					showYearPicker
					dateFormat="yyyy"
					className="w-full border-none drop-shadow-sm h-9 rounded-md text-sm focus:ring-0"
					/>
				</div>
				)}
				{watch("date")?.date === "exactDate" && (
				<div className="w-3/5 flex gap-2">
					<DatePicker
					selected={watch("exactDate")}
					onChange={(date) => setValue("exactDate", date)}
					className="w-full border-none drop-shadow-sm h-9 rounded-md text-sm focus:ring-0"
					/>
				</div>
				)}
				{watch("date")?.date === "range" && (
				<div className="w-3/5 flex gap-2">
					<DatePicker
					selectsRange={true}
					startDate={startDate}
					endDate={endDate}
					onChange={(update) => {
						setDateRange(update);
					}}
					isClearable={true}
					className="w-full border-none drop-shadow-sm h-9 rounded-md text-sm focus:ring-0"
					/>
				</div>
				)}
			</div>
			<Controller
				name="status"
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<MultipleSelect
						{...field}
						options={statusLead}
						getValues={getValues}
						setValue={setValue}
						name="status"
						label={t('leads:filters:status')}
						error={errors.status}
					/>
				)}
			/>
			{fields.map((field, index) => {
				return (
					<div key={field.id}>
						{field.type === "input" && (
							<TextInput
								label={field.name}
								type="text"		
								name={`fields[${index}].value`}
								register={register}				
							/>
						)}
						{field.type === "select" && (
							<SelectInput
								{...field}
								label={field.name}
								name={`fields[${index}].value`}
								options={field.options}
								register={register}
								setValue={setValue}
							/>							
						)}
					</div>
				)
			})}
			<div className='my-2 flex gap-2 items-center'>
				<AddFields append={append} remove={remove} fields={fields}/>
				<Button
					type="button"
					label={t('leads:filters:restore')}
					buttonStyle="text"
					iconLeft={<PlusIcon className="h-4 w-4 text-gray-60" />}
					onclick={() => { setValue("fields", []); reset() }}
				/>
			</div>
			<div className="flex gap-2 justify-center mt-4">
				<Button
					type="submit"
					label={t('leads:filters:search')}
					buttonStyle="primary"
					className="py-1 px-3"
					iconLeft={<FaMagnifyingGlass className="h-4 w-4 text-white" />}
				/>
				<Button
					type="button"
					label={t('leads:filters:restart')}
					buttonStyle="secondary"
					className="py-1 px-3"
				/>
			</div>
		</form>
	);
};

export default FormFilters;
