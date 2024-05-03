'use client';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import InputDate from '../../../../../../../components/form/InputDate';
import { FaCalendarDays } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import TextInput from '../../../../../../../components/form/TextInput';

const DateTimeCalculator = ({ control, watch, setValue }) => {
	const { t } = useTranslation();
	const [ startDate, setStartDate ] = useState(null);
	const [ endDate, setEndDate ] = useState(null);
	const [ duration, setDuration ] = useState({
		days: 0,
		hours: 0,
		minutes: 0
	});
	const [ durationUnit, setDurationUnit ] = useState('days');
    const [value, setValueNumber] = useState("");

	const calculateDuration = () => {
		if (watch('startDate') && watch('endDate')) {
			const days = moment(watch('endDate')).diff(moment(watch('startDate')), 'days');
			const hours = moment(watch('endDate')).diff(moment(watch('startDate')), 'hours');
			const minutes = moment(watch('endDate')).diff(moment(watch('startDate')), 'minutes');
            setValueNumber(durationUnit == "days" ? days : durationUnit == "hours" ? hours : minutes);
			setDuration({ days, hours, minutes });
		}
	};

	useEffect(() => {
		calculateDuration();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch('startDate'), watch('endDate')]);
	
	const updateDuration = (value, unit) => {
        setValueNumber(value),
		setDuration({ ...duration, [unit]: value });
		if (watch('startDate')) {
			const newEndDate = moment(watch('startDate')).add(parseInt(value), unit).toDate();
			setValue('endDate', newEndDate);
			setEndDate(newEndDate);
		} else if (watch('endDate')) {
			const newStartDate = moment(watch('endDate')).subtract(parseInt(value), unit).toDate();
			setStartDate(newStartDate);
			setValue('startDate', newStartDate);
		}
	};

    const onChangeTime = (time) => {
        setDurationUnit(time)
        updateDuration(value, time);
    }

	return (
		<div className="flex flex-wrap w-full">
			<div className="md:ml-36 flex gap-2 sm:gap-6 flex-col sm:flex-row w-full">
				<div>
					<Controller
						render={({ field: { value, onChange, ref, onBlur } }) => {
							return (
								<InputDate
									label={t('tools:tasks:new:init-task')}
									value={value}
									onChange={onChange}
									onBlur={onBlur}
									icon={<FaCalendarDays className="h-3 w-3 text-primary pr-4" />}
									time
								/>
							);
						}}
						name="startDate"
						control={control}
						defaultValue=""
					/>
				</div>
				<div>
					<div className="flex flex-col gap-1 w-full">
						<TextInput 
                            type="number" 
                            label={t('tools:tasks:new:duration')} 
                            onChangeCustom={(e) => updateDuration(e.target.value, durationUnit)}
                            value={value}
                        />
						<div className="flex gap-2">
                            {["days", "hours", "minutes"].map((time, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer hover:text-primary hover:font-semibold ${time === durationUnit ? "text-primary font-semibold" : ""}`}
                                    onClick={() => onChangeTime(time)}
                                >
                                    <p className="text-xs">{t(`tools:tasks:new:${time}`)}</p>
                                </div>

                            ))}
						</div>
					</div>
				</div>
				<div>
					<Controller
						render={({ field: { value, onChange, ref, onBlur } }) => {
							return (
								<InputDate
									label={t('tools:tasks:new:end')}
									value={value}
									onChange={onChange}
									onBlur={onBlur}
									icon={<FaCalendarDays className="h-3 w-3 text-primary pr-4" />}
									time
								/>
							);
						}}
						name="endDate"
						control={control}
						defaultValue=""
					/>
				</div>
			</div>
		</div>
	);
};

export default DateTimeCalculator;
