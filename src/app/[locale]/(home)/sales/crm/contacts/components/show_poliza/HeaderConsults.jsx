'use client';
import { usePolicies } from '@/hooks/useCommon';
import { usePathname } from 'next/navigation';
import React from 'react';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}
export default function HeaderConsults({ noPolicy }) {
	const { policyConsult } = usePolicies(noPolicy);
    const pathname = usePathname();
	return (
		<div className="flex space-x-2 rounded-md w-full p-2 bg-white md:flex-row flex-col md:mt-8 mt-3 items-center h-full">
			{policyConsult.map((policy, index) => (
				<div
					key={index}
					className={classNames(
						' h-full w-full rounded-lg text-sm font-medium leading-5 uppercase flex cursor-pointer justify-center items-center',
						'ring-white/60 ring-offset-2 ring-0 focus:outline-none focus:ring-0',
						policy.route == pathname ? 'bg-blue-100 text-white shadow' : 'hover-off text-gray-400'
					)}
					onClick={policy.onclick}
				>
					{policy.name}
				</div>
			))}
		</div>
	);
}
