import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { IoLocationSharp } from "react-icons/io5";

import { ChangeEvent, useEffect, useState } from "react";

import { OptionField } from "../components/Inputs/OptionField";

import { AddButton } from "../components/Buttons/AddButton";

import { InputField } from "../components/Inputs/InputField";

import { FaCalendarDays } from "react-icons/fa6";

import axios from "axios";

import { BASE_URL } from "../Contents/URL";

import { useAppDispatch, useAppSelector } from "../redux/Hooks";

import { Search } from "../components/Search/Search";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";

type IndividualType = {
  id: number;
  memberId: number;
  eventId: number;
  memberClockin: string; // format: "HH:mm:ss"
  memberClockout: string; // format: "HH:mm:ss"
  presentHours: string; // e.g., "0 Minutes", or "1 Hour 15 Minutes"
  eventStatus: "Start" | "End"; // or more statuses, adjust accordingly
  fullName: string;
  mobileNumber: string; // e.g., "+923001234567"
  eventName: string;
  date: string; // ISO format e.g., "2015-11-21T19:00:00.000Z"
};

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

const currentDate =
  new Date(new Date().toISOString()).toLocaleDateString("sv-SE") ?? "";

const initialState = {
  eventName: "",
  dateFrom: currentDate,
  dateTo: currentDate,
};
export const PresentReport = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const { loader } = useAppSelector((state) => state?.NavigateSate);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "(Jamat)PresentReports";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("PresentReports"));
    }, 1000);
  }, []);
  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);

  const [allEvents, setAllEvents] = useState<EventType[] | null>(null);

  const [individualReports, setIndividualReports] = useState<
    IndividualType[] | null
  >(null);

  const [searchBar, setSearchBar] = useState("");

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchBar(e.target.value);
  };

  console.log("date", formData);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGetAllEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getEvent`, {
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

  const getIndividualMembersReports = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/individualMemberReport`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setIndividualReports(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllEvents();
    getIndividualMembersReports();
  }, []);
  if (loader) return <Loading />;
  return (
    <div className="text-gray-700 px-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Individual Present Report</h1>
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
        <div className=""></div>
        <Search handleSearch={handleChangeSearch} searchData={searchBar} />
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
        {individualReports?.map((report, index) => (
          <tbody className="text-center bg-white">
            <tr className="hover:bg-gray-100 transition duration-300">
              <td className="p-2 border ">{index + 1}</td>
              <td className="p-2 border">{report.fullName}</td>
              <td className="p-2 border ">{report.mobileNumber}</td>
              <td className="p-2 border">{report.eventName}</td>
              <td className="p-2 border ">{report.date.slice(0, 10)}</td>
              <td className="p-2 border">{report.memberClockin}</td>
              <td className="p-2 border">{report.memberClockout}</td>
              <td className="p-2 border">{report.presentHours}</td>
            </tr>
          </tbody>
        ))}
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
