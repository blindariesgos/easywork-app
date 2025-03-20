'use client';
import Button from '@/src/components/form/Button';
import { Field, Label, Radio, RadioGroup, Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAppContext from '@/src/context/app';
import { cancelPolicy } from '@/src/lib/apis';
import { handleFrontError } from '@/src/utils/api/errors';
import { toast } from 'react-toastify';
import LoaderSpinner from '@/src/components/LoaderSpinner';

const PolicyCanceledReazon = ({ isOpen, setIsOpen, onUpdate, id }) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState();
  const { lists } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await cancelPolicy(id, {
      cancelReasonId: selectedReason,
    });

    if (response.hasError) {
      // console.log({ response });
      handleFrontError(response);
      setIsLoading(false);
      return;
    }
    toast.success(t('operations:policies:update'));
    setIsOpen(false);
    setIsLoading(false);
    onUpdate();
  };

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[20000]">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg  bg-white p-8 rounded-2xl shadow-lg">
            <p className="textsm text-black font-medium">{t('operations:policies:canceled-reazon')}</p>
            <div className="relative grid gap-2 bg-white px-2 sm:px-4 grid-cols-1 mt-4 py-4">
              <RadioGroup value={selectedReason} onChange={setSelectedReason} aria-label="policies canceled reazon">
                {lists?.policies?.canceledReazons.map(item => (
                  <Field key={item.id} className="flex items-center gap-2">
                    <Radio value={item.id} className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary">
                      <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                    </Radio>
                    <Label>{item.name}</Label>
                  </Field>
                ))}
              </RadioGroup>
            </div>
            <p className="textsm text-black font-semibold">{t('operations:policies:canceled-reazon-note')}</p>
            <div className="flex justify-center gap-4 sticky bottom-0 pt-4 pb-2">
              <Button
                type="button"
                label={t('common:buttons:cancel')}
                buttonStyle="secondary"
                onclick={() => {
                  setSelectedReason([]);
                  setIsOpen(false);
                }}
                className="px-3 py-2"
              />
              <Button onclick={handleSubmit} type="button" label={t('common:buttons:save')} buttonStyle="primary" className="px-3 py-2" disabled={!selectedReason} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default PolicyCanceledReazon;
