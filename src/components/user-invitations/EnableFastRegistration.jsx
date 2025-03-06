import { Switch } from '@headlessui/react';

export const EnableFastRegistration = ({ enabled, setEnabled }) => {
  return (
    <div className="flex items-center gap-2">
      <p className="ml-1 text-sm">Registro rápido</p>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-gray-200 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-easy-300"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
        />
      </Switch>
    </div>
  );
};
