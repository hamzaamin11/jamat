type option = { id: number; label: string; value: string };

type OptionFieldProps = {
  labelName: string;
  handlerChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  inputValue: string;
  icon: React.ReactNode;
  // optionData: option[] | null;
  optionData: option[] | undefined;
  initial: string;
};

export const OptionField = ({
  labelName,
  handlerChange,
  name,
  inputValue,
  optionData,
  icon,
  initial,
}: OptionFieldProps) => {
  return (
    <div className="flex flex-col  mt-1 ">
      <span className=" text-gray-800 text-xs font-semibold pb-1">
        {labelName}
      </span>
      <label className="flex border  rounded">
        <span className="label text-gray-700 font-medium p-1 w-16 pl-4">
          {icon}
        </span>
        <select
          value={inputValue}
          onChange={handlerChange}
          name={name}
          className=" w-full  bg-white text-gray-700  border border-gray-300 focus:outline-indigo-500 p-2"
        >
          <option value={""}>{initial}</option>
          {optionData?.map((option) => (
            <option value={option?.value} key={option?.id}>
              {option?.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
