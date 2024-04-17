'use client';
import SlideOver from '@/components/SlideOver';
import React from 'react';
import CreateLead from './CreateLead';

export default function CreateLeadModal() {
	return (
		<SlideOver colorTag="bg-yellow-100" labelTag="lead" samePage={`/sales/crm/leads?page=1`}>
			<CreateLead/>
		</SlideOver>
	);
}
