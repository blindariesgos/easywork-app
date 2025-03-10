import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

const colors = [
  "#141052",
  "#FF0000",
  "#FF7A00",
  "#FFE500",
  "#ADFF00",
  "#00FF1A",
  "#00FFFF",
  "#0057FF",
  "#BD00FF",
  "#FF007A",
];

export default function RadioGroupColors({ setValue, name, watch, disabled }) {
  const [selected, setSelected] = useState();

  useEffect(() => {
    selected && setValue("color", selected);
  }, [selected]);

  useEffect(() => {
    if (!watch || !watch(name) || selected) return;
    setSelected(watch(name));
  }, [watch && watch(name)]);

  const handleChange = (color) => {
    setSelected(color);
  };

  return (
    <RadioGroup
      value={selected}
      disabled={disabled}
      onChange={handleChange}
      className="gap-4 flex flex-wrap"
    >
      {colors.map((color) => (
        <Radio
          key={color}
          value={color}
          className=" data-[checked]:ring-primary data-[checked]:ring-2 group rounded-full ring-offset-2 h-[24px] w-[24px]"
        >
          <div
            className="h-[24px] w-[24px] rounded-full opacity-60 hover:opacity-100 group-data-[checked]:opacity-100"
            style={{ background: color }}
          />
        </Radio>
      ))}
    </RadioGroup>
  );
}
