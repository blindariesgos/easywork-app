'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { useCallback, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';

import { useUserPermissions } from '../../../hooks/useUserPermissions';
import { useEvaluations } from '../../hooks/useEvaluations';

import { EvaluationHeader } from '../components/EvaluationHeader';
import { EvaluationForm } from '../components/EvaluationForm';
import { EvaluationFloatingMenu } from '../components/EvaluationFloatingMenu';

import { LMS_PERMISSIONS } from '../../../constants';

export default function CreateEvaluation() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();
  const { getEvaluations } = useEvaluations();

  // const [evaluations, setEvaluations] = useState([]);

  // const fetchEvaluations = useCallback(async () => {
  //   try {
  //     const response = await getEvaluations();
  //     setEvaluations(response);
  //   } catch (error) {
  //     toast.error('Ha ocurrido un error al obtener la información de la evaluación. Por favor intente más tarde');
  //   }
  // }, [getEvaluations]);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.evaluations)) router.replace('/');

    // fetchEvaluations();
  }, [hasPermission, router]);

  return (
    <div className="max-w-7xl relative mx-auto">
      <div className="max-w-2xl mx-auto py-5">
        <EvaluationHeader />
        <EvaluationForm />
      </div>
      <EvaluationFloatingMenu />
    </div>
  );
}
