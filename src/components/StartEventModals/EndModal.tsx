import axios, { AxiosError } from "axios";
import { AddButton } from "../Buttons/AddButton";

import { Title } from "../title/Title";

import { BASE_URL } from "../../Contents/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authFailure } from "../../redux/UserSlice";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

type MemberEvent = {
  id: number;
  memberId: number;
  eventId: number;
  memberClockin: string; // HH:mm:ss format
  memberClockout: string; // HH:mm:ss format
  presentHours: string; // e.g., "0 Minutes"
  eventStatus: string; // e.g., "End"
  fullName: string;
  fatherName: string;
  zone: string;
  mobileNumber: string;
  address: string;
  education: string;
  email: string;
  cnic: string;
  dob: string; // ISO string format
  district: string;
  age: number;
  profession: string;
  image: string; // e.g., "C:\\fakepath\\Avatar.png"
  status: "Y" | "N"; // assuming only 'Y' or 'N'
  joinStatus: "Y" | "N"; // assuming only 'Y' or 'N'
};
type EventType = {
  id: number;
  eventName: string;
  description: string;
  eventStatus: string; // e.g. 'Y' for active or similar status code
  eventType: string; // e.g. 'oneTimeEvent'
  date: string; // ISO string: "1985-12-29T19:00:00.000Z"
  startTime: string; // e.g. "10:22:07"
  endTime: string; // e.g. "00:00:00"
  presentTime: string; // e.g. "00:00:00"
  endStatus: string; // e.g. 'Start'
  location: string;
  fullName: string;
  image: string | null;
  fatherName: string;
  focalPersonName: string;
  focalPersonEmail: string;
  focalPersonNumber: string;
  phoneNumber: string;
  infoPersonName: string;
  infoPersonEmail: string;
  infoPersonNumber: string;
};

interface JOINPROPS {
  updateModal: () => void;
  eventID: number | undefined;
}

export const EndModal = ({ updateModal, eventID }: JOINPROPS) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [endNote, setEndnote] = useState("");

  const [loading, setLoading] = useState(false);

  const [leaveMembers, setLeaveMembers] = useState<MemberEvent[] | null>(null);

  const [eventData, setEventData] = useState<EventType | null>(null);

  const handleGetEventDetail = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getEventById/${eventID}`, {
        headers: {
          Authorization: token,
        },
      });
      setEventData(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
    }
  };

  const handleGetEndEventMemebers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getEndMembers/${eventID}`, {
        headers: {
          Authorization: token,
        },
      });
      setLeaveMembers(res.data);
      console.log(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
    }
  };

  const handleEndEvent = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/endEvent/${eventID}`,
        { endNote },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handleGetEndEventMemebers();
      setLoading(false);
      setEndnote("");
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetEventDetail();
    handleGetEndEventMemebers();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-30 ">
      <div
        className="bg-white w-[90%] sm:w-[80%] md:w-[40rem] lg:w-[50rem] p-6 border border-gray-200 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Section */}
        <div className="  pb-3 mb-4">
          <Title setModal={updateModal}>End Event</Title>
        </div>
        <div className="pb-3 space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-800 font-semibold  w-24">
              Event Name:
            </span>
            <p className="text-gray-700 text-sm">
              {eventData?.eventName && eventData?.eventName}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-800 font-semibold w-24">
              Start Time:
            </span>
            <p className="text-gray-700 text-sm">
              {" "}
              {eventData?.startTime && eventData?.startTime}
            </p>
          </div>
        </div>
        {/* Search Bar */}
        <span className="text-sm text-gray-800 font-semibold">Note:</span>
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 mb-5 pb-12">
          <textarea
            className="w-full p-3 text-md tracking-wide placeholder-gray-500 outline-none rounded-l-md resize-none"
            placeholder="Ending Note write leave here..."
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setEndnote(e.target.value)
            }
          />
        </div>

        <div className="flex items-center justify-center">
          <AddButton
            label={
              loading ? (
                <div className="flex items-center justify-between gap-1.5">
                  loading <ClipLoader size={18} color="white" />
                </div>
              ) : (
                "End Event"
              )
            }
            loading={loading}
            handleClick={handleEndEvent}
          />
        </div>
        <div className="py-3">
          <span className="text-sm text-gray-800 font-semibold ">
            Participants List
          </span>
          <div className="overflow-auto max-h-96 border border-gray-300 rounded">
            <table className="w-full border border-gray-300 overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-300 lg:text-sm text-xs  text-gray-800 sticky top-0 z-1 ">
                <tr>
                  <th className="p-1 border">Name</th>
                  <th className="p-1 border">Father Name</th>
                  <th className="p-1 border">Contact Number</th>
                  <th className="p-1 border">Clock In</th>
                  <th className="p-1 border">Clock Out</th>
                  <th className="p-1 border">Present Hours</th>
                </tr>
              </thead>

              {/* Table Body */}
              {leaveMembers?.map((end) => (
                <tbody className="text-center bg-white lg:text-sm text-xs ">
                  <tr className="hover:bg-gray-100 transition duration-300">
                    <td className="p-1 border ">
                      {(end?.fullName && end?.fullName) || "--"}
                    </td>
                    <td className="p-1 border">
                      {(end?.fatherName && end?.fatherName) || "--"}
                    </td>
                    <td className="p-1 border">
                      {(end?.mobileNumber && end?.mobileNumber) || "--"}
                    </td>
                    <td className="p-1 border">
                      {(end?.memberClockin && end?.memberClockin) || "--"}
                    </td>
                    <td className="p-1 border">
                      {end?.memberClockout && end?.memberClockout}
                    </td>
                    <td className="p-1 border">
                      {(end?.presentHours && end?.presentHours) || "--"}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
            {(!leaveMembers || leaveMembers.length === 0) && (
              <span className="flex items-center justify-center border-b text-gray-700 p-2 lg:text-sm text-xs">
                No member records available at the moment!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
