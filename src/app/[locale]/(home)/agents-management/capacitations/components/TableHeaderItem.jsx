import { ChatBubbleBottomCenterIcon, ChevronDownIcon, EnvelopeIcon, PhoneIcon, Bars3Icon } from '@heroicons/react/20/solid';

export const TableHeaderItem = ({ name, orderField, order = '|', onClick }) => {
  const [orderBy, orderAs] = order.split('|');

  return (
    <th
      scope="col"
      className="py-3 text-sm font-medium text-gray-400"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <div className="flex justify-center items-center gap-2">
        {name}
        <div>
          {orderField && (
            <ChevronDownIcon
              className={clsx('h-6 w-6', {
                'text-primary': orderBy === orderField,
                // 'transform rotate-180': orderBy === orderField && orderAs === 'ASC',
              })}
            />
          )}
        </div>
      </div>
    </th>
  );
};
