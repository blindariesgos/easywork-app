'use client';
import { useLeads } from '@/hooks/useCommon';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import DialogPositiveStage from './DialogPositiveStage';

export default function ProgressStages() {
	const { stages, isOpen, setIsOpen } = useLeads();
	const [ selectedReason, setSelectedReason ] = useState([]);
	return (
		<div className="flex md:flex-row items-center md:justify-center gap-2 md:gap-3 flex-wrap">
			{stages.map((stage, index) => {
				const stageClassName = `px-3 py-2 rounded-lg text-sm text-white cursor-pointer ${stage.id === 6
					? 'bg-green-500'
					: stage.id === 7 ? 'bg-red-500' : 'bg-easy-600'}`;
				return (
					<div key={stage.id} className="flex flex-row items-center relative">
						{index !== 0 && (
							<div className="text-blue-800 flex h-7 w-7 bg-white rounded-full justify-center items-center absolute -left-5">
								<PlusCircleIcon className="h-6 w-6 text-easy-600" />
							</div>
						)}
						<div className={stageClassName} onClick={stage.onclick}>{stage.name}</div>
					</div>
				);
			})}
			<DialogPositiveStage isOpen={isOpen} setIsOpen={setIsOpen} setSelectedReason={setSelectedReason} selectedReason={selectedReason}/>
		</div>
	);
}
