"use server";
import { revalidateTag } from "next/cache";
import fetchAPI from "./fetcher";

const addContactFields = [
  "email",
  "nombre",
  "apellidos",
  "rfc",
  "curp",
  "phone",
  "address",
  "responsible",
  "nacimiento",
  "sexo",
  "postal",
  "direccion",
  "telefono",
  "cargo",
  "agente",
  "subAgente",
  "origen",
  "profilePhoto",
];

// CONTACTS

export async function getContacts() {
  const data = await fetchAPI("/crm/contact", "contacts");
  return data;
}

export async function createContact(prevState, formData) {
  // Validation
  // const validatedFields = contactSchema.safeParse({
  //   email: formData.get("email"),
  //   nombre: formData.get("nombre"),
  //   apellidos: formData.get("apellidos"),
  // });

  // if (!validatedFields.success) {
  //   return {
  //     success: false,
  //     errors: validatedFields.error.flatten().fieldErrors,
  //   };
  // }

  // // keep only the fields found in the addContactFields array
  // const filteredFormData = new FormData();
  // for (const field of addContactFields) {
  //   if (formData.get(field)) {
  //     // Si el campo profilePhoto no tiene archivo adjunto, no lo incluye
  //     if (field === "profilePhoto" && formData.get(field).size === 0) {
  //       continue;
  //     }
  //     filteredFormData.append(field, formData.get(field));
  //   }
  // }

  // // Mutate Data
  // const result = await fetchAPI(
  //   "/crm/contact",
  //   "addContact",
  //   "POST",
  //   filteredFormData,
  //   {}
  // );


  // // Revalidate Cache
  // revalidateTag("contacts");
  // return { success: true };
}

export async function updateContact(prevState, formData) {
  // Validation

  const fieldsToValidate = {};
  for (const [field, value] of formData.entries()) {
    if (
      !field.endsWith("_original") &&
      (field === "nombre" || field === "apellidos" || field === "email") &&
      value !== prevState[field]
    ) {
      fieldsToValidate[field] = value;
    }
  }
  for (const field of ["nombre", "apellidos", "email"]) {
    if (formData.has(field)) {
      fieldsToValidate[field] = formData.get(field);
    } else {
      fieldsToValidate[field] = prevState[field];
    }
  }

  // Validate only if there are changed fields
  if (Object.keys(fieldsToValidate).length > 0) {
    const validatedFields = contactSchema.safeParse(fieldsToValidate);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
  }

  // keep only the fields found in the addContactFields array
  const filteredFormData = new FormData();
  for (const field of addContactFields) {
    if (formData.get(field)) {
      // Si el campo profilePhoto no tiene archivo adjunto, no lo incluye
      if (field === "profilePhoto" && formData.get(field).size === 0) {
        continue;
      }
      filteredFormData.append(field, formData.get(field));
    }
  }

  // Mutate Data
  const result = await fetchAPI(
    `/crm/contact/${prevState.id}`,
    "updateContact",
    "PATCH",
    filteredFormData,
    {}
  );


  // Revalidate Cache
  revalidateTag("contacts");
  return { success: true };
}

export async function getContact(id) {
  try {
    const data = await fetchAPI(`/crm/contact/${id}`, "contact");
    return data;
  } catch (error) {
    return null;
  }
}

// POLIZAS

export async function subirPolizaPDF(prevState, formData) {
  const result = await fetchAPI(
    "/crm/poliza/pdf",
    "subirPolizaPDF",
    "POST",
    formData,
    {}
  );
  revalidateTag("contact");
  return result;
}

// TASKS

export async function getTasks() {
  const data = await fetchAPI("/getasks", "tasks");
  return data;
}

// USERS

export async function getUsers() {
  const data = await fetchAPI("/auth/users", "crmUsers");
  return data;
}
