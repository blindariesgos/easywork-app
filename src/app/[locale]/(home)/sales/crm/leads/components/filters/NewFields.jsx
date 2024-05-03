import { contactTypes } from '../../../../../../../../lib/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NewFields = ({ append, remove, fields: selectFields}) => {
	const { t } = useTranslation();
	const [ fields, setFields ] = useState([
		{
			id: 1,
			name: t('leads:filters:fullname'),
			type: 'input',
			check: false,
            code: "name"
		},
		{
			id: 2,
			name: t('leads:filters:contact-type'),
			type: 'select',
			options: contactTypes,
			check: false,
            code: "typeContact"
		},
		{
			id: 3,
			name: t('leads:filters:rfc'),
			type: 'input',
			check: false,
            code: "rfc"
		}
	]);

	// useEffect(
	// 	() => {
	// 		const updatedFields = fields.map((field) => {
	// 			const correspondingItem = selectFields.find((select) => select.name === field.name);
	// 			if (correspondingItem) return { ...field, check: true };
	// 			return field;
	// 		});
	// 		setFields(updatedFields);
	// 	},
	// [selectFields, fields]);
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
		if (checked) append({ ...field, value: '' });
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
