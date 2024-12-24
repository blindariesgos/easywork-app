import Link from "next/link";
import React from "react";

const HeaderCrm = ({ options }) => {
  return (
    <div className="bg-white rounded-md shadow-sm w-full">
      <div className="flex gap-6 py-4 px-4 flex-wrap">
        {options.map((opt, index) => (
          <div key={index} className="cursor-pointer">
            {opt.href ? (
              <Link href={opt.href}>
                <p className="text-gray-400 font-medium hover:text-primary">
                  {opt.name}
                </p>
              </Link>
            ) : (
              <p className="text-gray-400 font-medium hover:text-primary">
                {opt.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderCrm;
