import { Search } from "../components/Search/Search";

import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { IoLocationSharp, IoSearchCircleOutline } from "react-icons/io5";

import { useState } from "react";
import { OptionField } from "../components/Inputs/OptionField";
import { AddButton } from "../components/Buttons/AddButton";
import { InputField } from "../components/Inputs/InputField";
import { FaCalendarDays } from "react-icons/fa6";

const districtData = [
  { label: "Select Event", value: "" },
  { label: "IT Expo", value: "itExpo" },
  { label: "Tech Expo", value: "techExpo" },
];

const data = [
  { label: "Full Name", value: "Hamza Amin" },
  { label: "Father Name", value: "Amin Ullah" },
  { label: "CNIC", value: "34103-1232934-7" },
  { label: "Contact", value: "+923215965061" },
  { label: "Email", value: "hamzaamin104@gmail.com" },
  { label: "Address", value: "Hafizabad district gujranwala" },
];

const numbers = ["10", "25", "50", "100"];
const initialState = {
  eventName: "",
  dateFrom: "",
  dateTo: "",
};
export const PresentReport = () => {
  const [formData, setFormData] = useState(initialState);

  console.log("date", formData);
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="text-gray-800 mx-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Individual Present Report</h1>
      </div>

      <form className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 mt-2 mb-5">
        <input
          type="text"
          className="w-full p-3 text-md tracking-wide placeholder-gray-500 outline-none rounded-l-md"
          placeholder="Search Member by Name,CNIC or Email..."
        />
        <button className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-300">
          <IoSearchCircleOutline size={28} title="Search event" />
        </button>
      </form>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="text-sm   text-gray-800 font-semibold w-32">
              {item.label}:
            </span>
            <p className="text-gray-700">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 items-center justify-center  gap-4">
        <OptionField
          labelName="Event Name*"
          handlerChange={handleChange}
          name="eventName"
          inputValue={formData.eventName}
          optionData={districtData}
          icon={<IoLocationSharp size={25} color="#DC2626" />}
        />

        <InputField
          labelName="Form*"
          icon={<FaCalendarDays size={25} color="blue" />}
          fieldType="date"
          placeHolder="date"
          name="dateFrom"
          inputValue={formData.dateFrom}
          handleChange={handleChange}
        />
        <InputField
          labelName="To*"
          icon={<FaCalendarDays size={25} />}
          fieldType="date"
          placeHolder="date"
          name="dateTo"
          inputValue={formData.dateTo}
          handleChange={handleChange}
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
        <thead className="bg-sky-500 text-gray-700 ">
          <tr>
            <th className="p-2 border text-white border-gray-700 ">Sr#</th>
            <th className="p-2 border text-white border-gray-700">Name</th>
            <th className="p-2 border text-white border-gray-700">Contact</th>
            <th className="p-2 border text-white border-gray-700">
              Event Name
            </th>
            <th className="p-2 border text-white border-gray-700">Date</th>
            <th className="p-2 border text-white border-gray-700">Clock In</th>
            <th className="p-2 border text-white border-gray-700">Clock Out</th>
            <th className="p-2 border text-white border-gray-700">
              Present Hours
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-center bg-white">
          <tr className="hover:bg-gray-100 transition duration-300">
            <td className="p-2 border ">1</td>
            <td className="p-2 border">Hamza</td>
            <td className="p-2 border ">+92321-5965061</td>
            <td className="p-2 border">Shaadi Expo</td>
            <td className="p-2 border ">18/03/2025</td>
            <td className="p-2 border">11:00 AM</td>
            <td className="p-2 border">04:00 PM</td>
            <td className="p-2 border">4 Hours</td>
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
