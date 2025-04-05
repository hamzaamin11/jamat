type InputFieldProps = {
  labelName: string;
  icon: React.ReactNode;
  name: string;
  placeHolder: string;
  inputValue: string;
  fieldType: string;
  accept?: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};
export const TextArea = ({
  labelName,
  icon,
  name,
  placeHolder,
  inputValue,


  handleChange,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col  mt-1 ">
      <span className=" text-gray-800 text-xs font-semibold pb-1">
        {labelName}
      </span>
      <label className="flex border  rounded">
        <span className="label text-gray-600 font-medium p-1 w-16 pl-4">
          {icon}
        </span>
        <textarea
          className=" pl-2 w-full  rounded-r bg-white  outline"
          placeholder={placeHolder}
          onChange={handleChange}
          name={name}
          value={inputValue}
        />
      </label>
    </div>
  );
};
