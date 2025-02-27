import Image from "next/image";

export const polizaReimbursementStatus = {
  captura_documentos: "Captura de documentos",
  en_proceso: "En proceso",
  validacion_documentos: "Validación de documentos",
  aclaracion: "Aclaración",
  recoleccion_medicamentos: "Recolección y envio de médicamentos",
  aprobado: "Aprobado",
  no_cumple_condiciones: "No cumple condiciones",
};

export const polizaReimbursementStatusColor = {
  captura_documentos: "#EFD864",
  en_proceso: "#DFC2FF",
  validacion_documentos: "#FFF9C2",
  aclaracion: "#C2FFF9",
  recoleccion_medicamentos: "#73B5FF",
  aprobado: "#C2FFCF",
  no_cumple_condiciones: "#FFC2C2",
};

export const renovationStages = [
  {
    name: "Seguimiento de renovación",
    id: "86fc75e2-7278-4cce-9c5e-d53e803ef8ec",
    color: "#0091CD",
  },
  {
    name: "Solicitud de renovación enviada a aseguradora",
    id: "23dca7ac-0e9d-4838-8c7a-7f20d6181755",
    color: "#0077BF",
  },
  {
    name: "Póliza nueva emitida",
    id: "71323626-f251-4c5c-a57f-3fc00c785795",
    color: "#005BA6",
  },
  {
    name: "Renovado pago parcial - recibos",
    id: "461a4c99-71c8-43d3-9259-5cdabbe11553",
    color: "#005084",
  },
  {
    name: "Renovado pago total - recibos",
    id: "8650bcf7-1a1b-489b-a4df-c503a2d48cac",
    color: "#241F61",
  },
  {
    name: "Anulada - No pago",
    id: "07f51453-7413-4db8-9c63-bfdf56ac23eb",
    color: "#E00000",
  },
  {
    name: "No renovado - anulado",
    id: "e9fda904-99f2-47be-8511-64a79c88be65",
    color: "#E00000",
  },
  {
    name: "Renovado generar recibos",
    id: "468f65cf-db77-4b78-8aba-d65bb78312e1",
    color: "#00AB00",
  },
];

export const recruitmentStages = [
  {
    id: "f3404a7e-8550-4cbc-9161-9d6197628a41",
    name: "Contacto Inicial",
    color: "#0F8BBF",
    type: "state",
  },
  {
    id: "fcdc645d-b4c5-4fd6-b9e4-ae6d7c8a19ea",
    name: "Entrevista 1",
    color: "#0879A8",
    type: "state",
  },
  {
    id: "580ee85e-ae46-4e78-a4fb-aadb868ff8b4",
    name: "Entrevista de verificación",
    color: "#004D6C",
    type: "state",
  },
  {
    id: "1bd3c42e-ee1a-42d3-ab9e-f3ed75a96006",
    name: "Contactar después - No tiene disponibilidad",
    color: "#C30000",
    type: "canceled",
  },
  {
    id: "899ad5ec-0b60-4354-8819-560df0b06d88",
    name: "Contactar después - No cumple FV",
    color: "#C30000",
    type: "canceled",
  },
  {
    id: "28f5ff34-ce55-4cd9-b7bf-357f61e9e95f",
    name: "No contactar mas",
    color: "#C30000",
    type: "canceled",
  },
  {
    id: "965c079e-3583-4a15-a265-4a1f2bf2b39d",
    name: "Observaciones por CNSF",
    color: "#C30000",
    type: "canceled",
  },
  {
    id: "fd995692-4640-4dc9-a78c-67df037a1fe6",
    name: "Ingreso aprobado",
    color: "#00A130",
    type: "approved",
  },
];

export const connectionsStage = [
  {
    id: "5314113e-82d5-4bd7-8d5f-be5de28da950",
    name: "Documentación inicial",
    color: "#0F8BBF",
    type: "state",
  },
  {
    id: "c8e29a78-42d0-4de0-9a13-bdafe0136e01",
    name: "Clave provincial",
    color: "#0879A8",
    type: "state",
  },
  {
    id: "1788e751-4c22-4ed6-ab77-ad98ff6ee82f",
    name: "En examen y comisión",
    color: "#06668E",
    type: "state",
  },
  {
    id: "05051503-92e0-43e4-a9a7-3e1052a7aff0",
    name: "Agente retirado excluido",
    color: "#C62A20",
    type: "canceled",
  },
  {
    id: "5de88bf9-8180-43c6-9c3e-7bd92076ef0a",
    name: "Agente definitivo - Registrado en GNP",
    color: "#00A130",
  },
];

export const activitySectors = [
  "Agricultura",
  "Comercio",
  "Construcción",
  "Consultoría",
  "Cultura y recreación",
  "Educación",
  "Energía",
  "Ganadería",
  "Hostelería",
  "Industria manufacturera",
  "Minería",
  "Organizaciones sin fines de lucro",
  "Pesca",
  "Servicios de consultoría",
  "Servicios de entretenimiento",
  "Servicios de información",
  "Servicios de investigación y desarrollo",
  "Servicios de protección y custodia",
  "Servicios de salud",
  "Servicios de tecnología",
  "Servicios educativos",
  "Servicios financieros",
  "Servicios inmobiliarios",
  "Silvicultura",
  "Transporte",
  "Turismo",
  "Otros",
];

export const CancelLeadReasons = [
  {
    id: "d0332445-0863-46cb-89c5-0b1435cf280c",
    name: "Cancela cita y no reagenda",
  },
  {
    id: "eb8ffdd1-b5a4-41ce-ba94-eb5522cbcc64",
    name: "Documentos incompletos",
  },
  {
    id: "5d44dc64-019c-4e94-9148-87cd5e5d30ba",
    name: "Lo verá con otra persona",
  },
  {
    id: "02f438aa-9298-420f-804e-62ee3559b777",
    name: "No aprobado por aseguradora",
  },
  {
    id: "e304b128-4ba6-4157-b6cb-656a6cdec85b",
    name: "No contesta",
  },
  {
    id: "dd3b68cd-4676-4bcc-899c-160e0ef2bbdd",
    name: "No le interesó",
  },
  {
    id: "95b06de4-afb5-42c9-8205-fa072e5a1c29",
    name: "No reagendó cita",
  },
  {
    id: "d1cf3051-ecb4-41da-864f-c2c01877ad58",
    name: "No tiene recursos",
  },
  {
    id: "3ccd0900-ebcc-45d0-a7bf-a3f4aa7b7248",
    name: "Otro motivo no específico",
  },
  {
    id: "4983f65d-b000-4406-821a-929ba1dca6d7",
    name: "Pidió retomar en otra fecha",
  },
  {
    id: "21ddc533-6c53-42c9-b088-c544222c9fcd",
    name: "Precio",
  },
  {
    id: "195e1b3d-d2dc-44a8-89c9-12017a9044f7",
    name: "Póliza emitida - anulada aseguradora",
  },
];

export const userStatus = (t) => [
  {
    label: t("common:header:status:working"),
    value: "working",
    icon: (
      <div className="border-2 border-green-500 rounded-full size-3 mr-1.5"></div>
    ),
  },
  {
    label: t("common:header:status:do_not_disturb"),
    value: "do_not_disturb",
    icon: (
      <Image
        className="h-4 w-4 mr-0.5"
        width={30}
        height={30}
        src={"/icons/state/donotdisturb.png"}
        alt="no"
      />
    ),
  },
  {
    label: t("common:header:status:on_vacation"),
    value: "on_vacation",
    icon: (
      <Image
        className="h-4 w-4 mr-0.5"
        width={30}
        height={30}
        src={"/icons/state/palmer.png"}
        alt="vacation"
      />
    ),
  },
  {
    label: t("common:header:status:out_of_office"),
    value: "out_of_office",
    icon: (
      <Image
        className="h-4 w-4 mr-0.5"
        width={30}
        height={30}
        src={"/icons/state/out.png"}
        alt="vacation"
      />
    ),
  },
];
