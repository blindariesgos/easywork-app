import React from 'react';
import DatePicker from 'react-datepicker';

const InputDate = ({ label, value, onChange, icon, error, disabled }) => {
	return (
		<div className="flex flex-col gap-y-2 w-full">
			{label && <label className="text-sm font-medium text-gray-900">{label}</label>}
			<div className='w-full'>
				<DatePicker
                    showIcon={icon ? true : false}
					selected={value}
					onChange={onChange}
					// onBlur={onBlur}
                    icon={icon ? icon : undefined}
					className="w-full border-none rounded-md text-sm h-9 shadow-sm focus:ring-0"
                    isClearable
					disabled={disabled}
				/>
			</div>
            {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
		</div>
	);
};

export default InputDate;
