import SlideOver from '@/components/SlideOver'
import React, { Suspense } from 'react'
import ContactPoliza from '../../../components/show_contact/tab_polizas/ContactPoliza'

export default function PoliciesDetails( { id }) {
  return (
    <SlideOver
        openModal={true}
        colorTag="bg-green-primary"
        labelTag="policy"
        samePage={`/sales/crm/contacts/contact/${id}?show=true`}
    >
        <Suspense
            fallback={
                <div className="flex flex-col h-screen">
                    <div className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden rounded-tl-3xl" />
                    {' cvbcbxbcbn'}
                </div>
            }
        >
            <ContactPoliza contactID={id} />
        </Suspense>
    </SlideOver>
  )
}
