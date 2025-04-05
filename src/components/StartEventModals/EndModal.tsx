import axios from "axios";
import { AddButton } from "../Buttons/AddButton";

import { Title } from "../title/Title";

import { BASE_URL } from "../../Contents/URL";
import { useAppSelector } from "../../redux/Hooks";
import { ChangeEvent, useEffect, useState } from "react";

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
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [endNote, setEndnote] = useState("");

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
      console.log(error);
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
      console.log(error);
    }
  };
  console.log(leaveMembers, "hamaz");
  const handleEndEvent = async () => {
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetEventDetail();
    handleGetEndEventMemebers();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-30">
      <div
        className="bg-white w-[50rem] p-6 border border-gray-200 rounded-lg shadow-lg"
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
            <p className="text-gray-700 text-sm">{eventData?.eventName}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-800 font-semibold w-24">
              Start Time:
            </span>
            <p className="text-gray-700 text-sm"> {eventData?.startTime}</p>
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
          <AddButton label="End Events" handleClick={handleEndEvent} />
        </div>
        <div className="py-3">
          <span className="text-sm text-gray-800 font-semibold ">
            Participants List
          </span>
          <table className="w-full border border-gray-300 overflow-hidden">
            {/* Table Header */}
            <thead className="bg-gray-300 text-sm text-gray-800 ">
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
              <tbody className="text-center bg-white text-sm ">
                <tr className="hover:bg-gray-100 transition duration-300">
                  <td className="p-1 border ">{end.fullName}</td>
                  <td className="p-1 border">{end.fatherName}</td>
                  <td className="p-1 border">{end.mobileNumber}</td>
                  <td className="p-1 border">{end.memberClockin}</td>
                  <td className="p-1 border">{end.memberClockout}</td>
                  <td className="p-1 border">{end.presentHours}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};
