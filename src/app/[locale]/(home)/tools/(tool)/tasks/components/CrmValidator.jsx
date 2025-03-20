'use client';
import React, { useEffect } from 'react';
import useAppContext from '@/src/context/app';
import CRMMultipleSelectV2 from '@/src/components/form/CRMMultipleSelectV2';
import { useSearchParams } from 'next/navigation';
import { getContactId, getLeadById, getPolicyById, getReceiptById, getAgentById, getSchedulingById, getRefundById, getUserById, getClaimById } from '@/src/lib/apis';

export default function CrmValidator({ errors, watch, setValue, setLoading, setIsMeetTask }) {
  const { lists } = useAppContext();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  //#region Logica conexion crm
  const setCrmContact = async contactId => {
    const response = await getContactId(contactId);
    setValue('crm', [
      {
        id: response?.id,
        type: 'contact',
        name: response?.fullName || response?.name,
      },
    ]);
    setValue('name', 'CRM - Cliente: ');
    setLoading(false);
  };
  const setCrmLead = async leadId => {
    const response = await getLeadById(leadId);
    setValue('crm', [
      {
        id: response?.id,
        type: 'lead',
        name: response?.fullName || response?.name,
      },
    ]);
    setValue('name', 'CRM - Prospecto: ');
    setLoading(false);
  };
  const setCrmReceipt = async receiptId => {
    const response = await getReceiptById(receiptId);
    setValue('crm', [
      {
        id: response?.id,
        type: 'receipt',
        name: response?.title,
      },
    ]);
    // console.log("receipt", response);
    setValue('name', 'CRM - Recibo: ');
    setLoading(false);
  };
  const setCrmAgent = async agentId => {
    const response = await getAgentById(agentId);
    setValue('crm', [
      {
        id: response?.id,
        type: 'agent',
        name: response?.name,
      },
    ]);
    setValue('name', 'CRM - Agente: ');
    setLoading(false);
  };

  const setCrmPolicy = async (policyId, type) => {
    const response = await getPolicyById(policyId);

    if (!response?.id) {
      setLoading(false);
      return;
    }
    setValue('crm', [
      {
        id: response?.id,
        name: `${response?.company?.name ?? ''} ${response?.poliza ?? ''} ${response?.type?.name ?? ''}`,
        type,
      },
    ]);
    setValue('name', `CRM - ${type == 'poliza' ? 'Póliza' : 'Renovación'}: `);
    setLoading(false);
  };
  const setCrmMeet = async agentId => {
    const response = localStorage.getItem(agentId);

    if (!response) {
      setLoading(false);
      return;
    }

    const data = JSON.parse(response);

    if (!data) {
      setLoading(false);
      return;
    }
    setIsMeetTask(true);
    const { userId, ...metadata } = data;

    const user = await getUserById(userId).then(res => (res.hasError ? null : res));

    setValue(
      'createdBy',
      lists?.users.filter(user => user.id === data.developmentManagerId)
    );
    user && setValue('responsible', [user]);
    setValue('metadata', metadata);
    setValue('name', 'CRM - Junta Individual: ');
    setLoading(false);
  };

  const setCrmMeetGroup = async agentId => {
    const response = localStorage.getItem(agentId);

    if (!response) {
      setLoading(false);
      return;
    }

    const data = JSON.parse(response);

    if (!data) {
      setLoading(false);
      return;
    }
    setIsMeetTask(true);

    const { userId, ...metadata } = data;

    setValue(
      'createdBy',
      lists?.users.filter(user => user.id === data.developmentManagerId)
    );

    setValue('metadata', metadata);
    setValue('name', 'CRM - Junta Grupal: ');
    setLoading(false);
  };
  const setCourseAssign = async courseId => {
    const response = localStorage.getItem(courseId);

    if (!response) {
      setLoading(false);
      return;
    }

    localStorage.removeItem(courseId);
    const data = JSON.parse(response);

    if (!data) {
      setLoading(false);
      return;
    }

    const { name, assignedBy, assignTo } = data;

    setValue('createdBy', [assignedBy?.id]);
    setValue('name', `Capacitación - Curso asignado: "${name}"`);

    if (assignTo && assignTo[0]) {
      setValue('responsible', [{ ...assignTo[0].user, name: assignTo[0].name }]);
      setValue('crm', [
        {
          id: assignTo[0].id,
          type: 'agent',
          name: assignTo[0].name,
        },
      ]);
    }
    setLoading(false);

    setValue('metadata', { courseId, course: data });
  };

  const setCoursePageAssign = async pageId => {
    const response = localStorage.getItem(pageId);

    if (!response) {
      setLoading(false);
      return;
    }

    localStorage.removeItem(pageId);
    const data = JSON.parse(response);

    if (!data) {
      setLoading(false);
      return;
    }

    const { name, assignedBy, courseId, courseName, id, assignTo } = data;

    setValue('createdBy', [assignedBy?.id]);
    setValue('name', `Capacitación - Evaluación asignada: "${name}"`);

    if (assignTo && assignTo[0]) {
      setValue('responsible', [{ ...assignTo[0].user, name: assignTo[0].name }]);
      setValue('crm', [
        {
          id: assignTo[0].id,
          type: 'agent',
          name: assignTo[0].name,
        },
      ]);
    }

    setValue('metadata', { courseId, courseName, pageId: id, data });
    setLoading(false);
  };

  const setCrmScheduling = async schedulingId => {
    const response = await getSchedulingById(schedulingId);
    if (response.hasError) return;
    setValue('crm', [
      {
        id: schedulingId,
        type: 'poliza_scheduling',
        name: response?.ot ?? response?.sigre,
      },
    ]);
    setValue('name', 'CRM - Programación: ');
    setLoading(false);
  };

  const setCrmRefund = async refundId => {
    const response = await getRefundById(refundId);
    if (response.hasError) return;
    setValue('crm', [
      {
        id: refundId,
        type: 'poliza_reimbursement',
        name: response?.ot ?? response?.sigre,
      },
    ]);
    setValue('name', 'CRM - Reembolso: ');
    setLoading(false);
  };

  const setCrmClaim = async claimId => {
    const response = await getClaimById(claimId);
    if (response.hasError) return;
    setValue('crm', [
      {
        id: claimId,
        type: 'poliza_claim',
        name: response?.claimNumber ?? response?.ot ?? response?.sigre,
      },
    ]);
    setValue('name', 'CRM - Siniestro: ');
    setLoading(false);
  };

  useEffect(() => {
    const prevId = params.get('prev_id');

    if (params.get('prev') === 'contact') {
      setLoading(true);
      setCrmContact(prevId);
      return;
    }

    if (params.get('prev') === 'lead') {
      setLoading(true);
      setCrmLead(prevId);
      return;
    }

    if (params.get('prev') === 'poliza_claim') {
      setLoading(true);
      setCrmClaim(prevId);
      return;
    }

    if (['poliza', 'renewal'].includes(params.get('prev'))) {
      setLoading(true);
      setCrmPolicy(prevId, params.get('prev'));
      return;
    }

    if (params.get('prev') === 'receipt') {
      setLoading(true);
      setCrmReceipt(prevId);
      return;
    }

    if (params.get('prev') === 'agent') {
      setLoading(true);
      setCrmAgent(prevId);
      return;
    }

    if (params.get('prev') === 'meet-individual') {
      setLoading(true);
      setCrmMeet(prevId);
      return;
    }
    if (params.get('prev') === 'meet-group') {
      setLoading(true);
      setCrmMeetGroup(prevId);
      return;
    }
    if (params.get('prev') === 'poliza_scheduling') {
      setLoading(true);
      setCrmScheduling(prevId);
      return;
    }
    if (params.get('prev') === 'poliza_reimbursement') {
      setLoading(true);
      setCrmRefund(prevId);
      return;
    }
    if (params.get('prev') === 'course-assign') {
      const agentId = params.get('agent');
      setLoading(true);
      setCourseAssign(prevId);
      return;
    }
    if (params.get('prev') === 'course-page-assign') {
      setLoading(true);
      setCoursePageAssign(prevId);
      return;
    }
  }, [params.get('prev')]);
  //#endregion

  return <CRMMultipleSelectV2 watch={watch} setValue={setValue} name="crm" error={errors.crm} />;
}

// Función actualizada
const getCmrInfo = cmr => {
  if (!cmr || !cmr.type || !cmr.crmEntity) return null;

  const { id } = cmr.crmEntity;
  const { type } = cmr;

  let name = cmr.crmEntity.name;

  if (type === 'contact' || type === 'lead' || type === 'agent') {
    name = cmr.crmEntity.fullName || cmr.crmEntity.name;
  }

  if (type === 'poliza') {
    name = `${cmr?.crmEntity?.company?.name} ${cmr?.crmEntity?.poliza} ${cmr?.crmEntity?.type?.name}`;
  }

  if (type === 'receipt') {
    name = cmr?.crmEntity?.title;
  }

  return { id, type, name };
};

const formatCrmData = crmData => {
  if (!crmData) return [];
  return crmData.map(item => getCmrInfo(item));
};
