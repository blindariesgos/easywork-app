import * as Yup from "yup"

export const contactSchema = Yup.object().shape({
  email: Yup
    .string()
    .required("El email es requerido")
    .email()
    .min(5),
  name: Yup.string().required("El nombre es requerido").min(2, "El nombre debe tener al menos 2 caracteres"),
  lastname: Yup.string().required("Los apellidos son requeridos").min(2, "El apellido debe tener al menos 2 caracteres"),
});
