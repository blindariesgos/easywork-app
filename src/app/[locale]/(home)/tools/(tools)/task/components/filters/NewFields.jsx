import useAppContext from '@/context/app';
import { useTasks } from '@/hooks/useCommon';
import { contactTypes } from '@/lib/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NewFields = ({ append, remove, fields: selectFields}) => {
	const { t } = useTranslation();
	const { lists } = useAppContext();
	const { users } = lists;
	const { status } = useTasks();
	const [ fields, setFields ] = useState([
		{
			id: 1,
			name: t('tools:tasks:filters:fields:status'),
			options: status,
			type: 'multipleSelect',
			check: false,
            code: "role"
		},
		{
			id: 2,
			name: t('tools:tasks:filters:fields:responsible'),
			type: 'dropdown',
			options: users,
			check: false,
            code: "typeContact"
		},
		{
			id: 3,
			name: t('tools:tasks:filters:fields:limit-date'),
			type: 'date',
			check: false,
            code: "limitDate",
			date: "newDate",
			state: 1,
		}
	]);

	useEffect(
		() => {
			const updatedFields = fields.map((field) => {
				const correspondingItem = selectFields.find((select) => select.name === field.name);
				if (correspondingItem) return { ...field, check: true };
				return field;
			});
			setFields(updatedFields);
		},
	[]);

	const handleAddField = (e) => {
		const { value, checked } = e.target;
		const field = fields.filter((fld) => fld.id === parseInt(value))[0] || fields[0];
		if (checked) append({ ...field, value: '', newValue: "" });
		else {
			const fieldIndex = selectFields.indexOf((item) => item.id == value);
			if (fieldIndex) remove(fieldIndex);
		}
        const updatedFields = fields.map((field) => {
            return field.id == value ? { ...field, check: !field.check } : field;
        })
        setFields(updatedFields);
	};

	return (
		<div className="p-4">
			<div className="flex gap-4 flex-col">
				{fields.map((field, index) => (
					<div key={index} className="flex gap-2">
						<input
							type="checkbox"
							className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
							value={field.id}
							checked={field.check}
							onChange={(e) => handleAddField(e)}
						/>
						<p className="text-sm">{field.name}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default NewFields;
