import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@headlessui/react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { IoTrash } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';

// Services
import { sendInvitations } from '@/src/lib/services/users/invitations';

export const EmailInvitation = () => {
  const defaultValues = {
    newUsers: [],
  };

  const [sending, setSending] = useState(false);

  const { control, register, handleSubmit, formState, reset } = useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'newUsers',
  });

  const { isSubmitting, errors } = formState;

  const onSubmit = async values => {
    setSending(true);
    toast.info('Enviado invitaciones...');

    try {
      await sendInvitations(values);
      // await request(`/users/invitations/send`, { data: values, method: 'POST' });

      reset({ newUsers: [] });

      toast.success('Invitaciones enviadas con éxito!');
    } catch (error) {
      toast.error('Ha ocurrido un error al intentar enviar las invitaciones. Intente más tarde');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-2 my-5">
        {fields.length > 0 ? (
          fields.map((field, index) => {
            const errorsItem = errors.newUsers ? errors.newUsers[index] : null;

            const nameHasErrors = errorsItem?.name;
            const lastNameHasErrors = errorsItem?.lastName;
            const emailHasErrors = errorsItem?.email;

            return (
              <div key={field.id} className="flex items-center gap-2">
                <div>
                  {index === 0 && <p className="text-sm text-gray-400 mb-2">Nombre</p>}
                  <Input
                    {...register(`newUsers.${index}.name`, { required: 'Obligatorio' })}
                    placeholder="Nombre"
                    invalid={nameHasErrors}
                    className={`w-full rounded-lg py-1 text-sm ${nameHasErrors && 'border-red-400'}`}
                    disabled={isSubmitting || sending}
                  />
                  {nameHasErrors && errorsItem?.name?.message && <p className="text-red-400 text-xs">{errorsItem?.name?.message}</p>}
                </div>
                <div>
                  {index === 0 && <p className="text-sm text-gray-400 mb-2">Apellido</p>}
                  <Input
                    {...register(`newUsers.${index}.lastName`, { required: 'Obligatorio' })}
                    placeholder="Apellido"
                    invalid={lastNameHasErrors}
                    className={`w-full rounded-lg py-1 text-sm ${lastNameHasErrors && 'border-red-400'}`}
                    disabled={isSubmitting || sending}
                  />
                  {lastNameHasErrors && errorsItem?.lastName?.message && <p className="text-red-400 text-xs">{errorsItem?.lastName?.message}</p>}
                </div>
                <div>
                  {index === 0 && <p className="text-sm text-gray-400 mb-2">Correo electrónico</p>}
                  <Input
                    {...register(`newUsers.${index}.email`, { required: 'Obligatorio' })}
                    placeholder="Correo electrónico"
                    invalid={emailHasErrors}
                    className={`w-full rounded-lg py-1 text-sm ${emailHasErrors && 'border-red-400'}`}
                  />
                  {emailHasErrors && errorsItem?.email?.message && <p className="text-red-400 text-xs">{errorsItem?.email?.message}</p>}
                </div>
                <div>
                  {index === 0 && <p className="text-sm text-white mb-2">X</p>}
                  <button onClick={() => remove(index)} disabled={isSubmitting || sending}>
                    <IoTrash className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm">Sin invitaciones</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="group transition text-easywork-main bg-white border border-easywork-main hover:bg-easywork-mainhover hover:text-white rounded-lg py-2 px-4 text-sm flex items-center gap-2"
          onClick={() => append({ name: '', lastName: '', email: '' })}
          disabled={isSubmitting || sending}
        >
          Nuevo
          <FaPlus className="h-4 w-4 text-easywork-main group-hover:text-white" />
        </button>
        <button type="submit" className="text-white border border-easywork-main bg-easywork-main hover:bg-easywork-mainhover rounded-lg py-2 px-4 text-sm" disabled={isSubmitting || sending}>
          {sending ? 'Enviando...' : 'Enviar invitaciones'}
        </button>
      </div>
    </form>
  );
};
