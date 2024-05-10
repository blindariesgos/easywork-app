import SlideOver from '../../../../../../../../components/SlideOver'
import React, { Suspense } from 'react'
import CreateContact from '../../components/create_contact/CreateContact'

export default function ContactDetails({ contactInfo, id }) {
  return (
    <SlideOver openModal={true} colorTag="bg-green-primary" labelTag="contact">
      <Suspense
        fallback={
          <div className="flex flex-col h-screen">
            <div className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden rounded-tl-3xl">
              </div>{" "}
          </div>
        }
      >
        <CreateContact edit={contactInfo} id={id} />
      </Suspense>
    </SlideOver>
  )
}
