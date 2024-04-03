import React from "react";

export default function RepeatOptions({ visible, frequency }) {
  if (frequency.value === 1) return <></>
  return (
    <div className="flex items-center gap-10">
      <p className="text-sm text-gray-800">Final</p>
      <div className="mt-2">
        <div className="space-y-2 sm:space-y-6">
          <div className="flex items-center">
            <input
              id="never"
              name="final-repetition"
              type="radio"
              defaultChecked={true}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label
              htmlFor={"never"}
              className="ml-3 block text-sm font-medium leading-6 text-gray-900"
            >
              Nunca
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="count"
              name="final-repetition"
              type="radio"
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label
              htmlFor={"count"}
              className="ml-3 text-sm font-medium leading-6 text-gray-900 flex items-center gap-2"
            >
              Después de
              <input
                type="number"
                min={1}
                max={999}
                placeholder="10"
                className="block w-full max-w-14 rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              repeticiones
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="date"
              name="final-repetition"
              type="radio"
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label
              htmlFor={"date"}
              className="ml-3 block text-sm font-medium leading-6 text-gray-900"
            >
              <div>
                <label htmlFor="date-final-repetition" className="sr-only">
                  Email
                </label>
                <input
                  type="date"
                  name="date-final-repetition"
                  id="date-final-repetition"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
