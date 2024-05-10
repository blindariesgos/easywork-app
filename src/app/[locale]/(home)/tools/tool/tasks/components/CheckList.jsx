'use client';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid';


export default function CheckList({ handleSubmit, append, remove, fields, setValue, watch, getValues, control, register }) {
    const { t } = useTranslation();
    const [editTitleList, setEditTitleList] = useState({});
    const [showIcon, setShowIcon] = useState({});
    
    const onSubmit = () => {}

    const handleKeyPress = (event, index, indexP) => {
      if (event.key === 'Enter') {
        addSubItems(indexP);   
      }
    };

    const removeSubItem = (index, subIndex, empty) => {
        const existingSubItems = watch(`items.${index}.subItems`);
        if (empty) return setValue(`items.${index}.subItems`, watch(`items.${index}.subItems`).filter((_, index) => index !== subIndex));
        if (existingSubItems.some((subItem, index) => subItem.name === "")) {
            const indexNameEmpty = existingSubItems.findIndex((subItem) => subItem.name === "");
            const arrayDataCorrect = watch(`items.${index}.subItems`).filter((_, index) => index !== indexNameEmpty);
            return setValue(`items.${index}.subItems`, arrayDataCorrect.filter((_, index) => index !== subIndex));  
        }else return setValue(`items.${index}.subItems`, watch(`items.${index}.subItems`).filter((_, index) => index !== subIndex));
    }

    const addSubItems = (index) => {
        const existingSubItems = getValues(`items.${index}.subItems`);
        const endIndex = existingSubItems.length > 0 ? existingSubItems.length - 1 : 0;
        if (!existingSubItems.some((subItem) => subItem.name === "")) {
            if (existingSubItems.length > 0) setValue(`items.${index}.subItems.${endIndex}.empty`, false);
            setValue(
                `items.${index}.subItems`,
                [...getValues(`items.${index}.subItems`), { name: "", value: false, empty: true }]
            );
        }        
    }

    const onChangeCheckBox = (e, index, subIndex) => {
        const existingSubItems = watch(`items.${index}.subItems`);
        const { checked } = e.target;
        if (checked){
            if (existingSubItems.some((subItem, index) => index === subIndex && subItem.name === "")) {
                return removeSubItem(index, subIndex, true);
            }
        }
        setValue(`items.${index}.subItems.${subIndex}.value`, checked)
    }

    const addList = () => {
        append({ name:`${t('tools:tasks:new:verification-list')} #${fields.length + 1}` , subItems: [{ name: "", value: false, empty: true }]});
    }

    const removeList = (index) => {
        remove(index);
    }

	return (    
        <form onSubmit={handleSubmit(onSubmit)} >
            <ul>
            {/* {errors && errors?.items &&
                errors?.items.forEach((error, index) => (
                    <li key={index}>{error.message}</li>
                ))} */}
                {fields.map((field, index) => ( 
                    <Disclosure key={index} className="mt-2">
                        {({ open }) => (
                            <div className='bg-gray-100 drop-shadow-lg rounded-lg p-2' >
                                <Disclosure.Button className="flex w-full justify-between items-center p-2 pb-0 focus:ring-0 outline-none">
                                    {editTitleList[index] ? (
                                        <div className='border-b-2 border-gray-200 mb-2 w-full flex items-center' onClick={(e) => e.preventDefault()}>
                                            <input 
                                                {...register(`items.${index}.name`)} 
                                                type="text" 
                                                className="bg-transparent border-none focus:ring-0 w-full placeholder:text-black placeholder:text-sm text-sm"
                                                onChange={e=> e.preventDefault()}
                                            />
                                            <XMarkIcon className='h-3 w-3 text-red-600 mr-4' onClick={(e) => {e.preventDefault(); setValue(`items.${index}.name`, "")}}/>
                                        </div>
                                    ) : (
                                        <div 
                                            onMouseEnter={() => setShowIcon({ ...showIcon, [index]: true })}
                                            onMouseLeave={() => setShowIcon({ ...showIcon, [index]: false })}
                                            onClick={() => setEditTitleList({...editTitleList, [index]: !editTitleList[index]})}
                                            className='flex gap-10 items-center flex-wrap'>
                                                <div className='flex gap-1'>
                                                    <p className='text-sm text-black'>{getValues(`items.${index}.name`) || `${t('tools:tasks:new:verification-list')} ${`#${index + 1}`}`}</p>
                                                    {showIcon[index] && (
                                                        <PencilSquareIcon className="h-4 cursor-pointer text-gray-400"/>
                                                    )}                                    
                                                </div>
                                                <div>
                                                <div className='flex gap-2 items-center'>
                                                    <div className='h-2 w-20 bg-gray-200 rounded-md'>
                                                        <div className={`h-2 bg-green-500 rounded-md`} style={{ width: `${watch(`items.${index}.subItems`).length > 0  && (watch(`items.${index}.subItems`)?.filter((sub) => sub.value === true).length/watch(`items.${index}.subItems`).length)/0.01}%` }}></div>
                                                    </div>
                                                    <div className='text-xs text-gray-50'>{t('tools:tasks:new:completed', {init: watch(`items.${index}.subItems`).length > 0 ? watch(`items.${index}.subItems`)?.filter((sub) => sub.value === true).length : 0, end: watch(`items.${index}.subItems`).length})}</div>
                                                </div>
                                                </div>
                                        </div>
                                    )}
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-gray-400`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 text-sm text-gray-500">
                                    <ul>
                                        {/* {errors && errors.items?.[index]?.subItems &&
                                            errors.items?.[index]?.subItems.forEach((error, subIndex) => (
                                                <li key={subIndex}>{error.message}</li>
                                        ))} */}
                                        <Controller
                                            name={`items.${index}.subItems`}
                                            control={control}
                                            defaultValue={[]}
                                            render={({ field, }) => (
                                            <ul className='pt-2'>
                                                {field.value.map((subField, subIndex) => (
                                                    <li key={subIndex} >
                                                        <div className='flex gap-2 items-center mt-2' onKeyPress={(e) => handleKeyPress(e, subIndex, index)}>
                                                            <input
                                                                type='checkbox'
                                                                className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                                                                {...register(`items.${index}.subItems.${subIndex}.value`)} 
                                                                onChange={(e) => onChangeCheckBox(e, index, subIndex)}
                                                            />
                                                            <div className='w-full' >  
                                                                {subField.empty ? (                                                          
                                                                    <input  
                                                                        {...register(`items.${index}.subItems.${subIndex}.name`)} 
                                                                        type="text" 
                                                                        placeholder={t('tools:tasks:new:item')} 
                                                                        className='text-sm w-full rounded-md border-gray-200 bg-white focus:ring-primary focus:ring-1 placeholder:text-sm text-black'
                                                                    />
                                                                ) : (
                                                                    <div className='flex w-full justify-between items-center'>
                                                                        <p className='text-sm text-black '>{subIndex + 1}. {subField.name}</p>
                                                                        <div className='cursor-pointer' onClick={() => removeSubItem(index, subIndex)} >
                                                                            <TrashIcon className='h-3 w-3 text-gray-200'/>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <hr className='text-gray-200 mt-2'/>
                                                    </li>
                                                ))}
                                            </ul>          
                                        )}
                                        />           
                                        <div className='flex justify-between w-full mt-3 '>   
                                            <button 
                                                type="button" 
                                                onClick={() => addSubItems(index)}
                                                className='border-b border-dashed  border-gray-400 text-xs text-gray-400 flex gap-2 mt-3'
                                            >
                                                <PlusIcon className='h-4 w-4'/>
                                                {t('tools:tasks:new:add-item')}
                                            </button>
                                            <button type="button" onClick={() => removeList(index)} className='border-b border-dashed  border-red-600 text-xs text-red-600 mt-3'>
                                                {t('tools:tasks:new:delete-item')}
                                            </button>
                                        </div>
                                    </ul>
                                </Disclosure.Panel>
                            </div>
                        )}
                    </Disclosure>
                ))}
            </ul>
            <button type="button" onClick={() => addList()} className='mt-4 text-xs flex gap-2 items-center border-b border-dashed'>
                <PlusIcon className='h-4 w-4'/>
                {t('tools:tasks:new:add-lists')}
            </button>
        </form>
      );
}
