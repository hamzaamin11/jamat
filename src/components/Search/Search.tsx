import { ChangeEvent } from "react";

type SEARCHT = {
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  searchData: string;
};
export const Search = ({ handleSearch, searchData }: SEARCHT) => {
  return (
    <div className="my-2">
      <span className="text-gray-800">Search: </span>
      <input
        type="text"
        onChange={handleSearch}
        placeholder="Search..."
        value={searchData}
        className="border placeholder-gray-500 border-gray-800 mt-1 p-1.5 outline-none rounded w-40 "
      />
    </div>
  );
};
