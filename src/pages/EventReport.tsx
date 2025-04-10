import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { IoLocationSharp } from "react-icons/io5";

import { ChangeEvent, useEffect, useState } from "react";

import { OptionField } from "../components/Inputs/OptionField";

import { AddButton } from "../components/Buttons/AddButton";

import { InputField } from "../components/Inputs/InputField";

import { FaCalendarDays } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Contents/URL";
import { Search } from "../components/Search/Search";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { authFailure } from "../redux/UserSlice";
import { toast } from "react-toastify";

type EventType = {
  id: number;
  eventName: string;
  date: string;
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

export const EventReport = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const { loader } = useAppSelector((state) => state?.NavigateSate);

  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);

  const [pageNo, setPageNo] = useState(1);

  const [allEvents, setAllEvents] = useState<EventType[] | null>(null);

  const [reportEvents, setReportEvents] = useState<EventType[] | null>(null);

  const [searchBar, setSearchBar] = useState("");

  console.log(allEvents);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchBar(e.target.value);
  };

  console.log(searchBar);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchBar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchEvent`, {
        headers: {
          Authorization: token,
        },
        params: { q: searchBar },
      });
      console.log(res.data);
      setReportEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrementPageButton = () => {
    setPageNo(pageNo + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleReportEvents = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/eventReport?eventName=${formData.eventName}&form=${formData.dateFrom}&to=${formData.dateTo}&page=${pageNo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setReportEvents(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setReportEvents(null);
    }
  };
  useEffect(() => {
    document.title = "(Jamat)EventReports";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Eventreports"));
    }, 1000);
  }, [pageNo]);

  useEffect(() => {
    handleGetAllEvents();
  }, []);

  useEffect(() => {
    handleReportEvents();
  }, [formData.eventName, formData.dateFrom, formData.dateTo, pageNo]);

  useEffect(() => {
    handleSearchBar();
  }, [searchBar]);

  if (loader) return <Loading />;
  return (
    <div className="text-gray-700 px-3 w-full">
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
        <div className=""></div>
        <Search handleSearch={handleChangeSearch} searchData={searchBar} />
      </div>
      <table className="w-full border border-gray-300 rounded border-separate border-spacing-0 overflow-hidden">
        {/* Table Header */}
        <thead className="bg-sky-500 text-gray-700 ro">
          <tr>
            <th className="p-2 border text-white border-gray-700">Sr#</th>
            <th className="p-2 border text-white border-gray-700">Date</th>
            <th className="p-2 border text-white border-gray-700">
              Event Name
            </th>
            <th className="p-2 border text-white border-gray-700">
              Event Type
            </th>
            <th className="p-2 border text-white border-gray-700">
              Start Time
            </th>
            <th className="p-2 border text-white border-gray-700">End Time</th>
            <th className="p-2 border text-white border-gray-700">
              Focal Person
            </th>
            <th className="p-2 border text-white border-gray-700">
              Focal Person No#
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        {reportEvents?.map((event, index) => (
          <tbody className="text-center bg-white">
            <tr className="hover:bg-gray-100 transition duration-300">
              <td className="p-2 border ">{index + 1}</td>
              <td className="p-2 border">{event.date.slice(0, 10)}</td>
              <td className="p-2 border ">{event.eventName}</td>
              <td className="p-2 border">{event.eventType}</td>
              <td className="p-2 border ">{event.startTime}</td>
              <td className="p-2 border">{event.endTime}</td>
              <td className="p-2 border">{event.focalPersonName}</td>
              <td className="p-2 border">{event.focalPersonNumber} </td>
            </tr>
          </tbody>
        ))}
      </table>

      {(!reportEvents || reportEvents.length === 0) && (
        <span className="flex items-center justify-center border-b text-gray-700 p-2">
          No event records available at the moment!
        </span>
      )}

      <div className="flex items-center justify-between">
        <ShowData />
        <Pagination
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
          page={pageNo}
        />
      </div>
      <div className="flex items-center justify-center">
        <AddButton label="Print" />
      </div>
    </div>
  );
};
