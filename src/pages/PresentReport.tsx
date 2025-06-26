import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { IoLocationSharp } from "react-icons/io5";

import { ChangeEvent, useEffect, useState } from "react";

import { OptionField } from "../components/Inputs/OptionField";

import { AddButton } from "../components/Buttons/AddButton";

import { InputField } from "../components/Inputs/InputField";

import { FaCalendarDays } from "react-icons/fa6";

import axios, { AxiosError } from "axios";

import { BASE_URL } from "../Contents/URL";

import { useAppDispatch, useAppSelector } from "../redux/Hooks";

import { Search } from "../components/Search/Search";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { authFailure } from "../redux/UserSlice";

import { ClipLoader } from "react-spinners";
import { FaUser } from "react-icons/fa";

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
  eventDate: string; // ISO format e.g., "2015-11-21T19:00:00.000Z"
};

type EventType = {
  id: number;
  eventName: string;
  eventDate: string;
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

type MemberT = {
  id: number;
  fullName: string;
  fatherName: string;
  district: string;
  zone: string;
  mobileNumber: string;
  address: string;
  education: string;
  email: string;
  cnic: string;
  dob: string;
  age: string;
  profession: string;
  image: string;
};

const currentDate =
  new Date(new Date().toISOString()).toLocaleDateString("sv-SE") ?? "";

const initialState = {
  eventName: "",
  memberName: "",
  dateFrom: currentDate,
  dateTo: currentDate,
};
export const PresentReport = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [printLoading, setPrintLoading] = useState(false);

  const [pageNo, setPageNo] = useState(1);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Events Tracking - JI GRW";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("PresentReports"));
    }, 1000);
  }, [pageNo]);
  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);

  console.log(formData);

  const [allEvents, setAllEvents] = useState<EventType[] | null>(null);

  const [members, setMembers] = useState<MemberT[] | null>(null);

  const [individualReports, setIndividualReports] = useState<
    IndividualType[] | null
  >(null);

  const [searchBar, setSearchBar] = useState("");

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchBar(e.target.value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGetAllEvents = async () => {
    setPrintLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/getEvent`, {
        headers: {
          Authorization: token,
        },
      });
      setAllEvents(res.data);
      setPrintLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
      setPrintLoading(false);
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
  //     const axiosError = error as AxiosError<{ message: string }>;
  //     dispatch(authFailure(axiosError.response?.data?.message ?? ""));
  //     toast.error(axiosError.response?.data?.message ?? "");
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
  //     const axiosError = error as AxiosError<{ message: string }>;
  //     dispatch(authFailure(axiosError.response?.data?.message ?? ""));
  //     toast.error(axiosError.response?.data?.message ?? "");
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

  const handleGetmembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/getMembers?page=${pageNo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setMembers(res.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
      setMembers(null);
      setLoading(false);
    }
  };

  const getIndividualMembersReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/individualMemberReport?page=${pageNo}&eventName=${formData.eventName}&memberName=${formData.memberName}&from=${formData.dateFrom}&to=${formData.dateTo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      setLoading(false);
      setIndividualReports(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
      setIndividualReports(null);
      setLoading(false);
    }
  };
  const handleIncrementPageButton = () => {
    setPageNo(pageNo + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  useEffect(() => {
    handleGetAllEvents();
    handleGetmembers();
  }, []);

  useEffect(() => {
    getIndividualMembersReports();
  }, [
    pageNo,
    formData.eventName,
    formData.dateTo,
    formData.dateFrom,
    formData.memberName,
  ]);
  if (loading) return <Loading />;
  return (
    <div className="text-gray-700 px-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Individual Present Report</h1>
      </div>

      <div className="grid lg:grid-cols-4 grid-cols-1  items-center justify-center  gap-2 lg:gap-4 pb-2">
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

        <OptionField
          labelName="Member Name*"
          handlerChange={handleChange}
          name="memberName"
          inputValue={formData.memberName}
          optionData={members?.map((member) => ({
            id: member?.id,
            label: member?.fullName,
            value: member?.fullName,
          }))}
          icon={<FaUser size={25} />}
          initial={"Please Select Member "}
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
          <thead className="bg-sky-500 text-gray-700 ">
            <tr>
              <th className="p-1 border text-white border-gray-700 text-sm ">
                Sr#
              </th>
              <th className="p-1 border text-white border-gray-700 text-sm">
                Name
              </th>
              <th className="p-1 border text-white border-gray-700 text-sm">
                Contact
              </th>
              <th className="p-1 border text-white border-gray-700 text-sm">
                Event Name
              </th>
              <th className="p-1 border text-white border-gray-700 text-sm">
                Date
              </th>
              <th className="p-1 border text-white border-gray-700 text-sm">
                Clock In
              </th>
              <th className="p-1 border text-white border-gray-700 text-sm">
                Clock Out
              </th>
              <th className="p-1 border text-white border-gray-700 text-sm">
                Present Hours
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          {individualReports && individualReports.length > 0 ? (
            individualReports.map((report, index) => (
              <tbody key={report?.id} className="text-center bg-white">
                <tr className="hover:bg-gray-100 transition duration-300">
                  <td className="p-1 border text-sm">{index + 1}</td>
                  <td className="p-1 border text-sm">
                    {(report?.fullName && report?.fullName) || "--"}
                  </td>
                  <td className="p-1 border text-sm">
                    {(report?.mobileNumber && report?.mobileNumber) || "--"}
                  </td>
                  <td className="p-1 border text-sm">
                    {(report?.eventName && report?.eventName) || "--"}
                  </td>
                  <td className="p-1 border text-sm">
                    {report.eventDate?.slice(0, 10)}
                  </td>
                  <td className="p-1 border text-sm">
                    {(report?.memberClockin && report?.memberClockin) || "--"}
                  </td>
                  <td className="p-1 border text-sm">
                    {(report?.memberClockout && report?.memberClockout) || "--"}
                  </td>
                  <td className="p-1 border text-sm">
                    {(report?.presentHours && report?.presentHours) || "--"}
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-2 text-gray-700 text-xs lg:text-sm"
                >
                  No report records available at the moment!
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      <div className="flex items-center justify-between">
        <ShowData />
        <Pagination
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
          page={pageNo}
        />
      </div>
      <div className="flex items-center justify-center">
        <AddButton
          label={
            printLoading ? (
              <div className="flex items-center justify-between gap-1.5">
                loading <ClipLoader size={18} color="white" />
              </div>
            ) : (
              "Print"
            )
          }
          loading={printLoading}
          handleClick={printDiv}
        />
      </div>
    </div>
  );
};
