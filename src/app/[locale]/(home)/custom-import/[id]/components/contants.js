export const contactImportKeys = [
  "typePerson",
  "name",
  "lastname",
  "fullName",
  "rfc",
  "cua",
  "codigo",
  "address",
  "cargo",
  "birthday",
  "gender",
  "curp",
  "phone-work",
  "phone-mobile",
  "phone-fax",
  "phone-house",
  "locator-number",
  "phone-marketing",
  "phone-other",
  "email-work",
  "email-home",
  "email-marketing",
  "email-other",
  "disabled",
];

export const contactImportExample = [
  {
    typePerson: "fisica",
    name: "Jhon",
    lastname: "Smith",
    "phone-mobile": "+581234567",
    "email-work": "jhonsmit@yopmail.com",
    birthday: "1978/06/24",
    disabled: "Si",
    gender: "Masculino",
  },
  {
    typePerson: "fisica",
    name: "Maria",
    lastname: "Gonzales",
    "phone-mobile": "+581234567",
    "email-work": "mariagonzales@yopmail.com",
    birthday: "1978/06/24",
    disabled: "Si",
    gender: "Femenino",
  },
  {
    typePerson: "moral",
    fullName: "Exportadora Nacional FEW C.A.",
    "phone-mobile": "+581234567",
    "email-work": "jhonsmit@yopmail.com",
    disabled: "Si",
  },
];

export const emailTypes = {
  "email-home": "Casa",
  "email-marketing": "Para boletines",
  "email-other": "Otros",
  "email-work": "Trabajo",
};

export const phoneTypes = {
  "locator-number": "Localizador",
  "phone-fax": "Fax",
  "phone-house": "Casa",
  "phone-marketing": "Sms Marketing",
  "phone-mobile": "Móvil",
  "phone-other": "Otros",
  "phone-work": "Teléfono Trabajo",
};
