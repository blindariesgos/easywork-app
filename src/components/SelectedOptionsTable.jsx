'use client';
import React, { useEffect, useState } from 'react';
import SelectInput from './form/SelectInput';
import Button from './form/Button';
import { useTranslation } from 'react-i18next';
import MenuAddUser from './MenuAddUser';
import { useAlertContext } from '../context/common/AlertContext';

export default function SelectedOptionsTable({ options: data }) {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState(null);
    const { onCloseAlertDialog, onOpenAlertDialog } = useAlertContext();
    const [options, setOptions] = useState([]);
    useEffect(() => {
        setOptions(data);
    }, [data])

    const handleApplyPermission = () => {
        onOpenAlertDialog({
            isOpen: true,
            title: t("common:table:checkbox:msg-delete"),
            titleStyles: "success",
            buttonAccept: true,
            buttonCancel: true,
            buttonAcceptLabel: t("common:buttons:continue"),
            buttonCancelLabel: t("common:buttons:cancel"),
            onButtonAcceptClicked: selectedOption.onclick && selectedOption.onclick,
            onButtonCancelClicked: () => onCloseAlertDialog(),
        })
    }

    return (
        <div className="flex gap-2 items-start flex-wrap sm:flex-nowrap">
            <SelectInput label="" options={options} name="options" border setSelectedOption={setSelectedOption} />
            {selectedOption?.selectUser && (
                <div>
                    <MenuAddUser selectedOption={selectedOption} />
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
