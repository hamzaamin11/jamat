import React from "react";

type ButtonProps<T = void> = {
  label: string;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>, param?: T) => void;
  param?: T;
  loading?: boolean;
};

export const AddButton = <T,>({
  label,
  handleClick,
  param,
  loading,
}: ButtonProps<T>) => {
  return (
    <div>
      <button
        disabled={loading}
        className="bg-sky-500 text-white p-2 rounded hover:cursor-pointer hover:scale-105 duration-300"
        onClick={(e) => handleClick?.(e, param)}
      >
        {loading ? "loading..." : label}
      </button>
    </div>
  );
};
