import React from 'react';

function TextInput({
	label,
	placeholder,
	type = 'text',
	error,
	onChangeCustom,
	disabled = false,
	name,
	register,
  ...props
}) {
	const registerProps = register && register(name);
	return (
    <div className='flex flex-col gap-y-1 w-full'>
      <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="">
        <input
          autoComplete='off'
          {...registerProps}
          type={type}
          name={name}
          disabled={disabled}
          // value={value || ''}
          onChange={(e) => {
            registerProps && registerProps.onChange(e);
            onChangeCustom && onChangeCustom(e);
          }}
          placeholder={placeholder}
          {...props}
          className='w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm'
        />

        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
	);
}

export default TextInput;
