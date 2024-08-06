import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { PiCheckFatFill } from "react-icons/pi";

const ContactFolders = () => {

    const folders = [
        {
            name: "Siniestros"
        },
        {
            name: "Reclamos"
        }
    ]

    return (
        <div className="w-full  text-black  rounded-lg px-4">
            <Disclosure as="div" className="rounded-lg bg-gray-100" defaultOpen={true}>
                <DisclosureButton className="group flex w-full items-center justify-between bg-white rounded-lg px-8 py-4">
                    <span className="text-sm/6 font-medium ">
                        Drive
                    </span>
                    <ChevronDownIcon className="size-5  group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 px-8  py-2">
                    {
                        folders.map(folder => (
                            <div key={folder.name} className='flex items-center gap-x-3 cursor-pointer'>
                                <PiCheckFatFill className='text-primary w-4 h-4' />
                                <p className='py-3'>{folder.name}</p>
                            </div>
                        ))
                    }
                </DisclosurePanel>
            </Disclosure>
        </div>
    );
}

export default ContactFolders;