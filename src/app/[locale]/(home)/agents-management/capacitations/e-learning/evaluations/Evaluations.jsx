'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useEvaluations } from '../hooks/useEvaluations';

import { EvaluationHeader } from './components/EvaluationHeader';
import { EvaluationForm } from './components/EvaluationForm';

import { LMS_PERMISSIONS } from '../../constants';
import { BuildingModule } from '../../components/Building';

export default function Evaluations() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();
  const { getEvaluations } = useEvaluations();

  const [evaluations, setEvaluations] = useState([]);

  const fetchEvaluations = useCallback(async () => {
    try {
      const response = await getEvaluations();
      setEvaluations(response);
    } catch (error) {
      toast.error('Ha ocurrido un error al obtener la información de la evaluación. Por favor intente más tarde');
    }
  }, [getEvaluations]);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.evaluations)) router.replace('/');

    fetchEvaluations();
  }, [hasPermission, router, fetchEvaluations]);

  return <BuildingModule />;

  return (
    <div className="max-w-xl mx-auto py-5">
      <EvaluationHeader />

      <div>
        <EvaluationForm />
      </div>
    </div>
  );
}
