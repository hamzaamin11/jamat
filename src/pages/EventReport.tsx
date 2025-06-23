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
  dateTo: "",
};

export const EventReport = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);

  const [pageNo, setPageNo] = useState(1);

  const [loading, setLoading] = useState(false);

  const [allEvents, setAllEvents] = useState<EventType[] | null>(null);

  const [reportEvents, setReportEvents] = useState<EventType[] | null>(null);

  const [searchBar, setSearchBar] = useState("");

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchBar(e.target.value);
  };

  console.log(searchBar);
  const handleGetAllEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/getEvent`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setAllEvents(res.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
      setLoading(false);
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
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleIncrementPageButton = () => {
    setPageNo(pageNo + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleReportEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/eventReport?eventName=${formData.eventName}&from=${formData.dateFrom}&to=${formData.dateTo}&page=${pageNo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setReportEvents(res.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
      setReportEvents(null);
      setLoading(false);
    }
  };

  // const downloadFile = (url: string, filename: string) => {
  //   try {
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = filename;
  //     link.style.display = "none";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     // Clean up the blob URL
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.log("Download failed.", error);
  //   }
  // };

  // const handlePrintForm = async () => {
  //   setPrintLoading(true);
  //   try {
  //     const res = await axios.get(`${BASE_URL}/download-report`, {
  //       headers: {
  //         Authorization: token,
  //       },
  //       responseType: "blob", // necessary for binary data like PDF
  //     });

  //     const blob = new Blob([res.data], { type: "application/pdf" });
  //     const url = URL.createObjectURL(blob);

  //     downloadFile(url, "member-report.pdf");

  //     console.log("PDF downloaded successfully");
  //     setPrintLoading(false);
  //   } catch (error) {
  //     console.log("Error downloading PDF:", error);
  //     setPrintLoading(false);
  //   }
  // };
  function printDiv() {
    const printCss = `
      @page {
        size: A4 portrait;
       
      }
  
      body {
        font-family: 'Arial', sans-serif;
        font-size: 11pt;
        color: #000;
      }
  
      .print-container {
        width: 100%;
        padding: 0;
      }
  
      .print-header {
        text-align: center;
       
      }
  
      .print-header h1 {
    
        font-size: 25pt;
        font-weight: bold;
      }
  
      .print-header h2 {
        
        font-size: 20pt;
        font-weight: normal;
      }
  
      .date-range {
        text-align: left;
        font-size: 14pt;
        display:flex;
        justify-content:space-between;
      }
  
      table {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid #000; /* full table border */
      }
  
      thead {
        background-color: #ccc;
        color: #000;
      }
  
      thead th {
        border: 2px solid #000;
        text-align: left;
        font-size: 10pt;
      }
  
      tbody tr {
        border: 2px solid #000;
      }
  
      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }
  
      tbody td {
        border: 2px solid #000;
        text-align: left;
        font-size: 10pt;
      }
  
      .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: 10pt;
        padding: 10px 0;
        border-top: 1px solid #ccc;
      }
  
      
  
      @media print {
        .no-print {
          display: none;
        }
      }
    `;

    const printContents = document?.getElementById("myDiv")?.outerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <div class="print-container">
        <div class="print-header">
          <h1>Jamat Event Management</h1>
          <h2>Event Report</h2>
        </div>
        <div class="date-range">
          <strong>From: 01-04-2024 </strong> &nbsp;&nbsp; <strong>To: 14-04-2025</strong>
        </div>
        ${printContents}
        <div class="footer"></div>
      </div>
    `;

    const printStyleElement = document.createElement("style");
    printStyleElement.type = "text/css";
    printStyleElement.appendChild(document.createTextNode(printCss));
    document.head.appendChild(printStyleElement);

    window.print();
    location.reload();

    window.onafterprint = function () {
      document.body.innerHTML = originalContents;
      document.head.removeChild(printStyleElement);
    };
  }

  useEffect(() => {
    document.title = "Events Tracking - JI GRW";
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
    if (searchBar) {
      handleSearchBar();
    }
  }, [searchBar]);

  if (loading) return <Loading />;
  return (
    <div className="text-gray-700 px-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Events Report</h1>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 items-center justify-center  gap-2 lg:gap-4 pb-2">
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
          icon={<IoLocationSharp size={25} />}
          initial={"Please Select Event"}
        />

        <InputField
          labelName="Form*"
          icon={<FaCalendarDays size={25} />}
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

      <div className="w-full overflow-x-auto">
        <table
          id="myDiv"
          className="w-full border border-gray-300 rounded border-separate border-spacing-0 overflow-hidden"
        >
          {/* Table Header */}
          <thead className="bg-sky-500 text-gray-700 ro">
            <tr>
              <th className="p-1 text-sm  border text-white border-gray-700">
                Sr#
              </th>
              <th className="p-1 text-sm  border text-white border-gray-700">
                Date
              </th>
              <th className="p-1 text-sm  border text-white border-gray-700">
                Event Name
              </th>
              <th className="p-1 text-sm  border text-white border-gray-700">
                Event Type
              </th>
              <th className="p-1 text-sm  border text-white border-gray-700">
                Start Time
              </th>
              <th className="p-1 text-sm  border text-white border-gray-700">
                End Time
              </th>
              <th className="p-1 text-sm  border text-white border-gray-700">
                Focal Person
              </th>
              <th className="p-1 text-sm  border text-white border-gray-700">
                Focal Person No#
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          {reportEvents?.map((event, index) => (
            <tbody className="text-center bg-white">
              <tr
                className="hover:bg-gray-100 transition duration-300"
                key={event.id}
              >
                <td className="p-1 text-sm  border ">{index + 1}</td>
                <td className="p-1 text-sm  border">{event.date}</td>
                <td className="p-1 text-sm  border ">{event.date}</td>
                <td className="p-1 text-sm  border">{event.eventType}</td>
                <td className="p-1 text-sm  border ">{event.startTime}</td>
                <td className="p-1 text-sm  border">{event.endTime}</td>
                <td className="p-1 text-sm  border">{event.focalPersonName}</td>
                <td className="p-1 text-sm  border">
                  {event.focalPersonNumber}{" "}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      {(!reportEvents || reportEvents.length === 0) && (
        <span className="flex items-center justify-center border-b text-gray-700 p-2 text-xs lg:text-sm">
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
        <AddButton label={"Print"} handleClick={printDiv} />
      </div>
    </div>
  );
};
