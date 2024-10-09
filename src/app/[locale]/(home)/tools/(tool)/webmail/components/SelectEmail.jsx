import Button from '../../../../../../../components/form/Button';
import React, { useEffect, useState } from 'react';
import MultipleSelect from '../../../../../../../components/form/MultipleSelect';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useCommon } from '../../../../../../../hooks/useCommon';
import SelectInput from '../../../../../../../components/form/SelectInput';
import TextInput from '../../../../../../../components/form/TextInput';
import {
	PlusIcon,
  } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddFields from './AddFields';
import SelectDropdown from '../../../../../../../components/form/SelectDropdown';
import useAppContext from '../../../../../../../context/app';

const SelectEmail = () => {
    const { lists, setFilter } = useAppContext();
	const { t } = useTranslation();
	const { createdDate } = useCommon();
	const schema = yup.object().shape({
		// responsible: yup.array().min(1, 'Al menos una opción debe seleccionarse'),
		responsible: yup.string(),
		date: yup.object(),
        origin: yup.string(),
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
		// range: yup.array().of(yup.string().required()).required().min(2).max(2),
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
	const updatedData = { ...getValues() };
	setFilter(updatedData);
  };

  useEffect(() => {
    setFilter(null);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'fields',
	});
	
	return (
		<form onSubmit={handleSubmit(handleFormFilters)} className="grid grid-cols-1 gap-2 sm:w-96 w-72 px-2">
			<SelectDropdown
				label={t('contacts:filters:responsible')}
				name="responsible"
				options={lists?.users}
				setValue={setValue}
			/>
			{/* <Controller
				name="responsible"
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<MultipleSelect
						{...field}
						options={responsible}
						getValues={getValues}
						setValue={setValue}
						name="responsible"
						label={t('contacts:filters:responsible')}
						error={errors.responsible}
					/>
				)}
			/> */}
			<div className="flex gap-2 items-end">
				<div className={`${watch("date")?.date ? "w-2/5" : "w-full"}`}>
				<SelectInput
					label={t("contacts:filters:created")}
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
				name="origin"
				control={control}
				defaultValue={""}
				render={({ field }) => {
				return (
					<SelectInput
					// {...field}
					label={t("contacts:filters:origin")}
					name="origin"
					options={lists?.listContact?.contactSources}
					error={!field.value && errors.origin}
					setValue={setValue}
					/>
				);
				}}
			/>
      {/* <Controller
				name="createdby"
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<MultipleSelect
						{...field}
						options={responsible}
						getValues={getValues}
						setValue={setValue}
						name="createdby"
						label={t('contacts:filters:created-by')}
						error={errors.createdby}
					/>
				)}
			/> */}
			<SelectDropdown
				label={t('contacts:filters:created-by')}
				name="createdby"
				options={lists?.users}
				selectedOption={null}
				setValue={setValue}
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
								label={field.name}
								name={`fields[${index}].value`}
								options={field.options}
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
					label={t('contacts:filters:restore')}
					buttonStyle="text"
					iconLeft={<PlusIcon className="h-4 w-4 text-gray-60" />}
					onclick={() => { setValue("fields", []); reset() }}
				/>
			</div>
			<div className="flex gap-2 justify-center mt-4">
				<Button
					type="submit"
					label={t('contacts:filters:search')}
					buttonStyle="primary"
					className="py-1 px-3"
					iconLeft={<FaMagnifyingGlass className="h-4 w-4 text-white" />}
				/>
				<Button
					type="button"
					label={t('contacts:filters:restart')}
					buttonStyle="secondary"
					className="py-1 px-3"
					onclick={() => { setValue("fields", []); reset() }}
				/>
			</div>
		</form>
	);
};

export default SelectEmail;
