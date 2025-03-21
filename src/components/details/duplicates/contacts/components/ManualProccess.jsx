import clsx from "clsx";
import { Fragment, useState } from "react";
import ManualMerging from "./steps/ManualMerging";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Finished from "./steps/Finished";

const ManualProccess = ({ onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const contacts = [
    [
      {
        id: "176271f1-e6db-474c-8087-02c4f1b1a9e7",
        createdAt: "2025-03-15T06:32:15.251Z",
        updatedAt: "2025-03-21T06:32:15.251Z",
        number: 18108,
        typePerson: "fisica",
        fullName: "Gina Argueta",
        name: "Gina",
        lastName: "Argueta",
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: "Femenino",
        source: {
          id: "ae74347b-3236-4648-b21a-461514a513b6",
          name: "Red social - LinkedIn",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "+52 55 1009 6152",
        email: "gina@eyecatcher.mx",
      },
      {
        id: "176271f1-e6db-474c-8087-02c4f1b1a9e8",
        createdAt: "2025-03-21T06:32:15.251Z",
        updatedAt: "2025-03-21T06:32:15.251Z",
        number: 18108,
        typePerson: "fisica",
        fullName: "Gina Argueta",
        name: "Gina",
        lastName: "Argueta",
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: "Femenino",
        source: {
          id: "ae74347b-3236-4648-b21a-461514a513b6",
          name: "Red social - LinkedIn",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "+52 55 1009 6152",
        email: "gina@eyecatcher.mx",
      },
    ],
    [
      {
        id: "285dfc59-9df7-440f-aa11-9094af7ed01",
        createdAt: "2025-03-13T21:35:11.651Z",
        updatedAt: "2025-03-19T22:31:00.872Z",
        number: 18074,
        typePerson: "fisica",
        fullName: "LOPEZ VIUDA DE VILLARREAL REBECA",
        name: "LOPEZ",
        lastName: "VIUDA DE VILLARREAL REBECA",
        rfc: "V22523294",
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "96bfd1f1-88ce-4780-abbb-04c465e65ac5",
          name: "Formulario de CRM",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "83482624",
        email: "actualizarcorreo@yopmail.com",
      },
      {
        id: "285dfc59-9df7-440f-aa11-9094af7ed013",
        createdAt: "2025-03-13T21:35:11.651Z",
        updatedAt: "2025-03-19T22:31:00.872Z",
        number: 18074,
        typePerson: "fisica",
        fullName: "LOPEZ VIUDA DE VILLARREAL REBECA",
        name: "LOPEZ",
        lastName: "VIUDA DE VILLARREAL REBECA",
        rfc: "V22523294",
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "96bfd1f1-88ce-4780-abbb-04c465e65ac5",
          name: "Formulario de CRM",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "83482624",
        email: "actualizarcorreo@yopmail.com",
      },
    ],
    [
      {
        id: "2e7aef4f-2072-4133-8e65-d881b9c9a76e",
        createdAt: "2025-03-13T21:35:11.651Z",
        updatedAt: "2025-03-19T19:55:35.445Z",
        number: 18075,
        typePerson: "fisica",
        fullName: "ALEJANDRO CANTU CHAPA",
        name: "ALEJANDRO",
        lastName: "CANTU CHAPA",
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "96bfd1f1-88ce-4780-abbb-04c465e65ac5",
          name: "Formulario de CRM",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "82805854",
        email: "actualizaremail@yopmail.com",
      },
      {
        id: "2e7aef4f-2072-4133-8e65-d881b9c9a74e",
        createdAt: "2025-03-13T21:35:11.651Z",
        updatedAt: "2025-03-19T19:55:35.445Z",
        number: 18075,
        typePerson: "fisica",
        fullName: "ALEJANDRO CANTU CHAPA",
        name: "ALEJANDRO",
        lastName: "CANTU CHAPA",
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "96bfd1f1-88ce-4780-abbb-04c465e65ac5",
          name: "Formulario de CRM",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "82805854",
        email: "actualizaremail@yopmail.com",
      },
    ],
    [
      {
        id: "f8ed6508-08fa-4835-83c3-567783e34e3",
        createdAt: "2025-03-11T14:25:34.787Z",
        updatedAt: "2025-03-11T14:25:34.787Z",
        number: 16897,
        typePerson: "fisica",
        fullName: "MARIA DEL ROSARIO",
        name: "MARIA DEL ROSARIO",
        lastName: null,
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "c7b65c7f-4e2c-43fd-a4f9-6c8d711666e9",
          name: "Correo Electrónico",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "1397238",
        email: null,
      },
      {
        id: "f8ed6508-08fa-4835-83c3-5671783e34e3",
        createdAt: "2025-03-11T14:25:34.787Z",
        updatedAt: "2025-03-11T14:25:34.787Z",
        number: 16897,
        typePerson: "fisica",
        fullName: "MARIA DEL ROSARIO",
        name: "MARIA DEL ROSARIO",
        lastName: null,
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "c7b65c7f-4e2c-43fd-a4f9-6c8d711666e9",
          name: "Correo Electrónico",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "1397238",
        email: null,
      },
    ],
    [
      {
        id: "dccce06d-9e7c-40a1-b5ef-c68a5a5d7a4",
        createdAt: "2025-03-11T14:25:34.787Z",
        updatedAt: "2025-03-11T14:25:34.787Z",
        number: 16908,
        typePerson: "fisica",
        fullName: "JORGE ARMANDO",
        name: "JORGE ARMANDO",
        lastName: null,
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "c7b65c7f-4e2c-43fd-a4f9-6c8d711666e9",
          name: "Correo Electrónico",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "2962769",
        email: null,
      },
      {
        id: "dccce06d-9e7c-40a1-b5ef-c68a5a59d7a4",
        createdAt: "2025-03-11T14:25:34.787Z",
        updatedAt: "2025-03-11T14:25:34.787Z",
        number: 16908,
        typePerson: "fisica",
        fullName: "JORGE ARMANDO",
        name: "JORGE ARMANDO",
        lastName: null,
        rfc: null,
        cargo: null,
        birthdate: null,
        gender: null,
        source: {
          id: "c7b65c7f-4e2c-43fd-a4f9-6c8d711666e9",
          name: "Correo Electrónico",
        },
        assignedBy: {
          id: "ba0e46d9-12bc-43a0-940c-17a1d2e228a9",
          username: "ysanchez",
          avatar: "https://easy-drive.s3.amazonaws.com/Xthmz02XGnR5uGjN2aoH0",
          profile: {
            firstName: "Yonei",
            lastName: "Sanchez",
          },
        },
        photo: null,
        phone: "2962769",
        email: null,
      },
    ],
  ];
  const handleNext = () => {
    setSelectedIndex(selectedIndex + 1);
  };
  const handleBack = () => {
    setSelectedIndex(selectedIndex - 1);
  };

  return (
    <div
      className={clsx(
        "max-h-screen h-full p-4 bg-gray-600 max-w-[1400px] w-full relative opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px]  overflow-y-auto lg:overflow-y-hidden"
      )}
    >
      <h1 className="text-2xl pb-4">Fusionar contactos</h1>
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
        as={Fragment}
      >
        <TabList className="hidden">
          {contacts.map((_, index) => (
            <Tab key={`fusion-${index}`}>Tab 4</Tab>
          ))}
          <Tab>Tab last</Tab>
        </TabList>
        <TabPanels>
          {contacts.map((items, index) => (
            <TabPanel key={`fusion-${index}`}>
              <ManualMerging
                handleNext={handleNext}
                items={items}
                index={index}
                totals={contacts.length}
              />
            </TabPanel>
          ))}
          <TabPanel>
            <Finished onClose={onClose} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default ManualProccess;
