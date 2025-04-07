import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { IoLocationSharp } from "react-icons/io5";

import { useEffect, useState } from "react";

import { OptionField } from "../components/Inputs/OptionField";

import { AddButton } from "../components/Buttons/AddButton";

import { InputField } from "../components/Inputs/InputField";

import { FaCalendarDays } from "react-icons/fa6";
import { useAppSelector } from "../redux/Hooks";
import axios from "axios";
import { BASE_URL } from "../Contents/URL";

type EventType = {
  id: number;
  eventName: string;
  currentDate: string;
  location: string;
  focalPersonName: string;
  focalPersonNumber: string;
  focalPersonEmail: string;
  infoPersonName: string;
  infoPersonNumber: string;
  infoPersonEmail: string;
  image: string;
  description: string;
  startTime: string;
  endTime: string;
  presentTime: string;
  eventType: "oneTimeEvent | recursiveEvent";
};

const initialState = {
  eventName: "",
  dateFrom: "",
  dateTo: "",
};
export const EventReport = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);

  console.log("date", formData);

  const [allEvents, setAllEvents] = useState<EventType[] | null>(null);

  const handleGetAllEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getEvent/${10}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setAllEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    handleGetAllEvents();
  }, []);
  return (
    <div className="text-gray-800 mx-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Events Report</h1>
      </div>

      <div className="grid grid-cols-3 items-center justify-center  gap-4">
        <OptionField
          labelName="Event Name*"
          handlerChange={handleChange}
          name="eventName"
          inputValue={formData.eventName}
          optionData={allEvents?.map((event) => ({
            id: event?.id,
            label: event?.eventName,
            value: event?.eventName,
          }))}
          icon={<IoLocationSharp size={25} color="#DC2626" />}
          initial={"Please Select Event"}
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
          <span className="bg-gray-200 rounded mx-1 p-1"></span>
          <span>entries</span>
        </div>
        {/* <Search /> */}
      </div>
      <table className="w-full border border-gray-300 rounded border-separate border-spacing-0 overflow-hidden">
        {/* Table Header */}
        <thead className="bg-sky-500 text-gray-700 ro">
          <tr>
            <th className="p-2 border text-white border-gray-700">Sr#</th>
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
