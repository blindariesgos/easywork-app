import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, PlusCircleIcon, PlusIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from 'react-i18next';
import TextInput from '../../../../../../../components/form/TextInput';
import { deleteTags, getTags, postTags } from '../../../../../../../lib/apis';
import { getApiError } from '../../../../../../../utils/getApiErrors';

const MultiSelectTags = ({ getValues, setValue, name, label, error }) => {
    const { t } = useTranslation(); 
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [query, setQuery] = useState("");  
    const [filterData, setFilterData] = useState([]);
    const handleToggle = () => {
        setQuery("");
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const getAllTags = async() => {
            try {
                const tags = await getTags();
                setOptions(tags);
                setFilterData(tags);
            } catch (error) {
                getApiError(error.message)
            }
        }

        getAllTags();
    }, [])
    

    const handleSelect = (option) => {
        const array = getValues(name);
        if (array){
            const index = array.findIndex((res) => res.id === option.id);
            if (index === -1) {
                setValue(name, [...array, option], { shouldValidate: true });
            } else {
                const updatedResponsible = array.filter((res) => res.id !== option.id);
                setValue(name, updatedResponsible, { shouldValidate: true });
            }
        }else {
            setValue(name, [option], { shouldValidate: true });
        }
    };

    const handleRemove = (id) => {
        const updatedResponsible = getValues(name).filter((res) => res.id !== id);
        setValue(name, updatedResponsible, { shouldValidate: true });
    };


     

    const onChangeTags = (e) => {
        const { value } = e.target;
        setQuery(value);
        const filterData =
            value === ""
            ? options :  options.filter((opt) => {
                return `${opt.username} ${opt.name}`.toLowerCase().includes(value.toLowerCase());
            });
        setFilterData(filterData);
    }

    const createTags = async() => {
        try {
            const addTag = await postTags({name: query});
            setOptions([ ...options ,addTag]);
            setFilterData([ ...options ,addTag]);
            handleSelect(addTag)
            setQuery("");
        } catch (error) {
            getApiError(error.message);            
        }
    }

    const deleteTag = async(e, id) => {
        e.preventDefault();
        try {
            const data = await deleteTags(id);
            setOptions(options.filter((tag)=> tag.id!==id));
            setFilterData(filterData.filter((tag)=> tag.id!==id));
        } catch (error) {
            getApiError(error.message);                
        }
    }
    return (
        <div className="">
            <label className='text-sm font-medium leading-6 text-gray-900'>
                {label}
            </label>
            <div className='relative mt-1'>
                <button
                    type="button"
                    onClick={handleToggle}
                    className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm bg-white py-2"
                >
                    <span className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
                        {getValues(name)?.length > 0
                            && getValues(name).map((res) => (
                                <div key={res.id} className="bg-primary p-1 rounded-md text-white flex gap-1 items-center text-xs">
                                    {res.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(res.id)}
                                        className="text-white"
                                    >
                                        <XMarkIcon className='h-3 w-3 text-white'/>
                                    </button>
                                </div>
                                ))}                                                       
                            <div className='flex gap-1 border-b border-dashed ml-2 text-primary font-semibold'>
                                <PlusIcon className='h-3 w-3'/>
                                <p className='text-xs'>{t("common:buttons:add")}</p>
                            </div>
                    </span>
                    <span className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="h-4 w-4"/>
                    </span>
                </button>
                {isOpen && (
                    <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50 pt-2">
                        <div className="py-1 flex flex-col gap-2 px-2 relative" aria-labelledby="options-menu">
                            <div className="w-full mt-2">
                                <TextInput onChangeCustom={(e) => onChangeTags(e)} border value={query}/>
                            </div>
                            {filterData?.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                                    {t('common:not-found')}
                                </div>
                                ) : (
                                filterData && filterData.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`flex justify-between px-4 py-2 text-sm cursor-pointer rounded-md hover:bg-primary hover:text-white ${
                                            getValues(name) && getValues(name).some((res) => res.id === option.id) ? 'bg-primary text-white' : ' text-black bg-white'
                                        }`}
                                        onClick={(e) => {e.preventDefault(); handleSelect(option)}}
                                    >
                                        {option.name}
                                        <div className='cursor-pointer' onClick={(e) => deleteTag(e, option.id)}>
                                            <XCircleIcon className='h-4 w-4'/>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {query !== "" && (
                            <div className='bg-blue-100 p-2 rounded-b-md'>
                                <div className='flex gap-1 items-center cursor-pointer' onClick={() => createTags()}>
                                    <PlusCircleIcon className='h-4 w-4 text-primary'/>
                                    <p className='text-xs '>{t("tools:tasks:add-tags")}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
        </div>
    );
};
export default MultiSelectTags;
  