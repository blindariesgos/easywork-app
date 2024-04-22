'use client'; // Error components must be Client Components

import { getApiError } from '@/utils/getApiErrors';
import { useParams, useRouter, } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Error({ error, reset }) {
	const params = useParams();
	const router = useRouter();
	const { id } = params;
	const errorsDuplicated = useRef(false);
	useEffect(
		() => {
			getApiError(error, errorsDuplicated);
			if (id) router.push('/sales/crm/contacts?page=1');
		},
		[ error ]
	);

	return <div />;
}
