import { Search } from "../components/Search/Search";

import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { IoLocationSharp } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa";
import { useState } from "react";
import { OptionField } from "../components/Inputs/OptionField";
import { AddButton } from "../components/Buttons/AddButton";

const districtData = [
  { label: "Select District", value: "selectDis" },
  { label: "Hafizabad", value: "hafizabad" },
  { label: "Lahore", value: "lahore" },
];

const zoneData = [
  { label: "Select Zone", value: "selectZone" },
  { label: "PP-64", value: "pp-64" },
  { label: "PP-84", value: "pp-84" },
];
const numbers = ["10", "25", "50", "100"];
const initialState = {
  district: "",
  zone: "",
};
export const MemberReport = () => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="text-gray-800 mx-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Registration Members Report</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-2">
        <OptionField
          labelName="District*"
          handlerChange={handleChange}
          name="district"
          inputValue={formData.district}
          optionData={districtData}
          icon={<IoLocationSharp size={25} color="#DC2626" />}
        />
        <OptionField
          labelName="Zone*"
          handlerChange={handleChange}
          name="zone"
          inputValue={formData.zone}
          optionData={zoneData}
          icon={<FaBriefcase size={25} color="#D97706" />}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="">
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select>
              {numbers.map((num, index) => (
                <option key={index}>{num}</option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>
        <Search />
      </div>
      <table className="w-full border border-gray-300 rounded border-separate border-spacing-0 overflow-hidden">
        {/* Table Header */}
        <thead className="bg-sky-500 text-gray-700 ro">
          <tr>
            <th className="p-2 border text-white border-gray-700">Sr#</th>
            <th className="p-2 border text-white border-gray-700">Name</th>
            <th className="p-2 border text-white border-gray-700">
              Father Name
            </th>
            <th className="p-2 border text-white border-gray-700">Contact</th>
            <th className="p-2 border text-white border-gray-700">Email</th>
            <th className="p-2 border text-white border-gray-700">District</th>
            <th className="p-2 border text-white border-gray-700">Zone</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-center bg-white">
          <tr className="hover:bg-gray-100 transition duration-300">
            <td className="p-2 border ">1</td>
            <td className="p-2 border">Hamza</td>
            <td className="p-2 border">Amin Ullah</td>
            <td className="p-2 border ">+92321-5965061</td>
            <td className="p-2 border ">hamzaamin104@gamil.com</td>
            <td className="p-2 border">Hafizabad</td>
            <td className="p-2 border">PP_64</td>
          </tr>
        </tbody>
      </table>

      <div className="flex items-center justify-between">
        <ShowData />
        <Pagination />
      </div>
      <div className="flex items-center justify-center">
        <AddButton label="Print" />
      </div>
    </div>
  );
};
