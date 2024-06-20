'use client';

import LoaderSpinner from '@/src/components/LoaderSpinner';
import { useTranslation } from 'react-i18next';

export default function Loading() {
	const { t } = useTranslation();
	// You can add any UI inside Loading, including a Skeleton.
	return <LoaderSpinner />;
}
