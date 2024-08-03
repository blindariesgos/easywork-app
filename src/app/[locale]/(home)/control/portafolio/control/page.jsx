'use client'

import { Fragment } from "react";
import { TabGroup, TabList, TabPanels, TabPanel, Tab } from "@headlessui/react";
import Contact from "./components/panels/contact"
import Policy from "./components/panels/policy"
import Control from "./components/panels/control"
import MoralContactForm from "./components/moralContactForm"
const Page = () => {
    const tabs = [
        {
            name: "Contacto",
            component: () => (<Contact />)
        },
        {
            name: "Compañia",
            component: () => (<MoralContactForm />)
        },
        {
            name: "Póliza",
            component: () => (<Policy />)
        },
        {
            name: "Cobranza",
            component: () => (<Control />)
        },
    ]
    return (
        <Fragment>
            <div className='bg-white rounded-md shadow-sm'>
                <div className='flex gap-6 py-4 px-4'>
                    <h2 className="text-primary text-2xl">Control de Cartera</h2>
                </div>
            </div>
            <div className='bg-white rounded-md shadow-sm'>
                <div className='flex gap-6 py-4 px-4'>
                    <div className="flex min-h-screen w-full px-4">
                        <div className="w-full ">
                            <TabGroup>
                                <TabList className="flex gap-4">
                                    {tabs.map(({ name }) => (
                                        <Tab
                                            key={name}
                                            className="rounded-xl py-2.5 px-5 text-sm  focus:outline-none data-[selected]:bg-primary  data-[selected]:text-white data-[hover]:bg-gray-300 data-[selected]:data-[hover]:bg-indigo-500 data-[hover]:shadow-sm "
                                        >
                                            {name}
                                        </Tab>
                                    ))}
                                </TabList>
                                <TabPanels>
                                    {tabs.map(({ name, component }) => (
                                        <TabPanel key={name} >
                                            {component()}
                                        </TabPanel>
                                    ))}
                                </TabPanels>
                            </TabGroup>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Page;