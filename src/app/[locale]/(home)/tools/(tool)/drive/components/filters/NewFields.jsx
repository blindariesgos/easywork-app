import { MenuItem } from '@headlessui/react';
import { contactTypes } from '../../../../../../../../lib/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDriveContext from '@/src/context/drive';

const NewFields = ({ append, remove, fields: selectFields }) => {
	const { t } = useTranslation();
	const { filters, filterFields: fields, setFilterFields: setFields } = useDriveContext()

	useEffect(() => {
		const updatedFields = fields.map((field) => {
			const correspondingItem = selectFields.find((select) => select.name === field.name);
			if (correspondingItem) return { ...field, check: true };
			return field;
		});

		// Verificar si hay cambios antes de actualizar 'fields'
		if (!fields.every((field, index) => field.check === updatedFields[index].check)) {
			setFields(updatedFields);
		}
	}, [selectFields, fields]);

	const handleAddField = (e) => {
		const { value, checked } = e.target;
		const field = fields.filter((fld) => fld.id === parseInt(value))[0] || fields[0];
		if (checked) append({ ...field, value: "" });
		else {
			const fieldIndex = selectFields.indexOf((item) => item.id == value);
			if (fieldIndex) remove(fieldIndex);
		}
		const updatedFields = fields.map((field) => {
			return field.id == value ? { ...field, check: checked } : field;
		})
		setFields(updatedFields);
	};

	return (
		<MenuItem className="p-4">
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
		</MenuItem>
	);
};

export default NewFields;
