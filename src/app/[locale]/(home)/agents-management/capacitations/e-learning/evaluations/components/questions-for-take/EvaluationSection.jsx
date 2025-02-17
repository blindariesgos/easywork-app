import { Select, Input, Textarea } from '@headlessui/react';
import { FiCopy } from 'react-icons/fi';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { EvaluationQuestionHeader } from '../EvaluationQuestionHeader';
import { EvaluationQuestionToolbar } from '../EvaluationQuestionToolbar';

export const EvaluationSection = () => {
  return (
    <div className="bg-white px-4 py-6 rounded-lg">
      <hr />
      <h2 className="text-xl font-bold">Nueva sección</h2>
    </div>
  );
};
