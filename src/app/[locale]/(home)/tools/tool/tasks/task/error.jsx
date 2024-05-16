'use client'; // Error components must be Client Components

import { getApiError } from '../../../../../../../utils/getApiErrors';
import { redirect } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export default function Error({ error, reset }) {
	const errorsDuplicated = useRef(false);
	useEffect(
		() => {
			getApiError(error, errorsDuplicated);
			redirect('/tools/tool/tasks?page=1');
		},
		[ error ]
	);

	return <div />;
}
