'use client';
import React, { useState } from 'react';
import SelectInput from './form/SelectInput';
import Button from './form/Button';
import { useTranslation } from 'react-i18next';
import MenuAddUser from './MenuAddUser';
import { useAlertContext } from '@/context/common/AlertContext';

export default function SelectedOptionsTable() {
	const { t } = useTranslation();
	const [selectedOption, setSelectedOption] = useState(null);
    const {onCloseAlertDialog, onOpenAlertDialog } = useAlertContext();
	const options = [
		{
			id: 1,
			name: t('common:table:checkbox:complete')
		},
		{
			id: 2,
			name: t('common:table:checkbox:add-obserber'),
            selectUser: true,
		},
		{
			id: 3,
			name: t('common:table:checkbox:add-participant'),
            selectUser: true,
		},
		{
			id: 4,
			name: t('common:table:checkbox:change-obserber'),
            selectUser: true,
		},
		{
			id: 5,
			name: t('common:table:checkbox:change-participant'),
            selectUser: true,
		},
		{
			id: 6,
			name: t('common:table:checkbox:delete')
		}
	];
	// console.log("selectedOption", selectedOption)
    const handleApplyPermission = () => {
        onOpenAlertDialog({
            isOpen: true,
            title: t("common:table:checkbox:msg-delete"),
            titleStyles: "success",
            buttonAccept: true,
            buttonCancel: true,
            buttonAcceptLabel: t("common:buttons:continue"),
            buttonCancelLabel: t("common:buttons:cancel"),  
        }) 
    }

	return (
		<div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
			<SelectInput label="" options={options} name="options" border setSelectedOption={setSelectedOption} />
            {selectedOption?.selectUser && (
                <div>
                    <MenuAddUser selectedOption={selectedOption}/>
                </div>
            )}
			<Button
				label={t('common:buttons:apply')}
				type="button"
				className="px-3 py-2"
				buttonStyle="primary"
                disabled={!selectedOption}
                onclick={(e) => handleApplyPermission()}
			/>
		</div>
	);
}
