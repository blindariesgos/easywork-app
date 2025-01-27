export const getCrmTypeConfig = (data) => ({
  contact: {
    href: `/sales/crm/contacts/contact/${data.crmEntity.id}?show=true`,
    bgClass: "bg-[#241F61] text-white",
    labelKey: "tools:tasks:edit:contact",
    name: data?.crmEntity?.fullName ?? data?.crmEntity?.name ?? "",
  },
  poliza: {
    href: `/operations/policies/policy/${data.crmEntity.id}?show=true`,
    bgClass: "bg-[#86BEDF] text-[#241F61]",
    labelKey: "tools:tasks:edit:policy",
    name:
      data?.crmEntity?.name ??
      `${data?.crmEntity?.company?.name} ${data?.crmEntity?.poliza} ${data?.crmEntity?.type?.name}` ??
      "",
  },
  lead: {
    href: `/sales/crm/leads/lead/${data.crmEntity.id}?show=true`,
    bgClass: "bg-[#A9EA44] text-[#241F61]",
    labelKey: "tools:tasks:edit:lead",
    name: data?.crmEntity?.fullName ?? data?.crmEntity?.name ?? "",
  },
  receipt: {
    href: `/sales/crm/leads/lead/${data.crmEntity.id}?show=true`,
    bgClass: "bg-[#DFE3E6] text-[#241F61]",
    labelKey: "Recibo",
    name: data?.crmEntity?.title ?? data?.crmEntity?.name ?? "",
  },
  renewal: {
    href: `/operations/renovations/renovation/${data.crmEntity.id}?show=true`,
    bgClass: "bg-[#fff79d] text-[#241F61]",
    labelKey: "Renovación",
    name:
      data?.crmEntity?.name ??
      `${data?.crmEntity?.company?.name} ${data?.crmEntity?.poliza} ${data?.crmEntity?.type?.name}` ??
      "",
  },
  agent: {
    href: `/agents-management/accompaniment/agent/${data.crmEntity.id}?show=true`,
    bgClass: "bg-easy-400 text-white",
    labelKey: "Agente",
    name: data?.crmEntity?.name,
  },
  poliza_scheduling: {
    href: `/operations/programations/programation/${data.crmEntity.id}?show=true`,
    bgClass: "bg-[#B7B7B7] text-[#241F61]",
    labelKey: "Programación",
    name: data?.crmEntity?.ot || data?.crmEntity?.sigre,
  },
  poliza_reimbursement: {
    href: `/operations/refunds/refund/${data.crmEntity.id}?show=true`,
    bgClass: "bg-[#dabea6] text-[#241F61]",
    labelKey: "Reembolso",
    name: data?.crmEntity?.ot || data?.crmEntity?.sigre,
  },
});
