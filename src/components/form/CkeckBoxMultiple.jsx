import React from 'react';

export default function CkeckBoxMultiple({ setSelectedCheckbox, selectedCheckbox, label, item}) {
	return (
		<div>
			<div className="flex gap-2 w-full items-center">
				<input
					type="checkbox"
					className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary bg-gray-100 focus:ring-primary"
					value={item.id}
					checked={selectedCheckbox && selectedCheckbox.some((reason) => reason.id === item.id)}
					onChange={(e) => {
						setSelectedCheckbox(
							e.target.checked
								? [ ...selectedCheckbox, item ]
								: selectedCheckbox.filter((p) => p.id !== item.id)
						);
					}}
				/>
                {label && (
                    <label className='text-sm font-normal leading-6 text-black'>{label}</label>
                )}
			</div>
		</div>
	);
}
