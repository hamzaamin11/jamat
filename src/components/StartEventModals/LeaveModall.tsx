import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AddButton } from "../Buttons/AddButton";
import { Title } from "../title/Title";
import { IoSearchCircleOutline } from "react-icons/io5";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Contents/URL";
import { toast } from "react-toastify";
import { authFailure } from "../../redux/UserSlice";
import { ClipLoader } from "react-spinners";

type MemberAttendanceT = {
  id: number;
  memberId: number;
  fullName: string;
  fatherName: string;
  cnic: string;
  dob: string; // ISO string
  age: number;
  email: string;
  mobileNumber: string;
  address: string;
  profession: string;
  education: string;
  zone: string;
  district: string;
  eventId: number;
  eventStatus: string; // "Leave", etc.
  joinStatus: string; // "Y" | "N"
  memberClockin: string; // HH:MM:SS
  memberClockout: string; // HH:MM:SS
  presentHours: string; // "06 Minutes"
  image: string; // URL
  status: string; // "Y" | "N"
};

interface JOINPROPS {
  updateModal: () => void;
  eventID: number | undefined;
}

export const LeaveModal = ({ updateModal, eventID }: JOINPROPS) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [searchMember, setSearchMember] = useState<MemberAttendanceT[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [searchPerson, setSearchPerson] = useState("");

  const memberRef = useRef<HTMLDivElement>(null);

  const [leaveMember, setLeaveMember] = useState<MemberAttendanceT | null>(
    null
  );

  const [listLeaveMember, setListLeaveMember] = useState<
    MemberAttendanceT[] | null
  >(null);

  const handleSearchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchEventDetail`, {
        params: { q: searchPerson },
        headers: { Authorization: token },
      });
      setSearchMember(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleSelectMember = (memberDetail: MemberAttendanceT) => {
    setLeaveMember(memberDetail);
    setSearchMember(null);
  };

  const handleGetAllLeaveMembers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/getLeaveMembers/${eventID}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      setListLeaveMember(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleSelectLeaveMember = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/joinEvent/${eventID}/${leaveMember?.id}`
      );
      console.log(res.data);
      handleGetAllLeaveMembers();
      toast.success("Leave member added successfully");
      setLeaveMember(null);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        memberRef.current &&
        !memberRef.current.contains(event.target as Node)
      ) {
        setSearchMember(null); // Close dropdown when clicked outside
      }
    };

    if (searchMember && searchMember.length > 0) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [searchMember]);

  useEffect(() => {
    handleSearchUser();
  }, [searchPerson]);

  useEffect(() => {
    handleGetAllLeaveMembers();
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-30">
      <div
        className="bg-white w-[50rem] p-6 border border-gray-200 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Section */}
        <div className="  pb-3 mb-4">
          <Title setModal={updateModal}>Leave Event</Title>
        </div>

        {/* Search Bar */}
        <form className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 mb-5">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchPerson(e.target.value)
            }
            value={searchPerson}
            type="text"
            className="w-full p-3 text-md tracking-wide placeholder-gray-500 outline-none rounded-l-md"
            placeholder="Search Member by Name,CNIC or Email..."
          />
          <button className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-300">
            <IoSearchCircleOutline size={28} title="Search event" />
          </button>
        </form>

        {searchMember && searchMember.length > 0 && (
          <div
            className="bg-white w-[47rem] max-h-36 p-4 rounded-lg shadow-md absolute z-20  overflow-hidden overflow-y-auto "
            ref={memberRef}
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Leave Members
            </h2>
            <ul className="space-y-2">
              {searchMember.map((member) => (
                <li
                  key={member?.id}
                  className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition hover:cursor-pointer"
                  onClick={() => handleSelectMember(member)}
                >
                  <span className="text-gray-800 font-medium text-sm">
                    {member?.fullName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* User Information Section */}
        {leaveMember && (
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Full Name:
              </span>
              <p className="text-gray-700">{leaveMember.fullName}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Father Name:
              </span>
              <p className="text-gray-700">{leaveMember.fatherName}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                CNIC:
              </span>
              <p className="text-gray-700">{leaveMember.cnic}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Contact:
              </span>
              <p className="text-gray-700">{leaveMember.mobileNumber}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Email:
              </span>
              <p className="text-gray-700">{leaveMember.email}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                District:
              </span>
              <p className="text-gray-700">{leaveMember.district}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Zone:
              </span>
              <p className="text-gray-700">{leaveMember.zone}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Current Time:
              </span>
              <p className="text-gray-700">{leaveMember.memberClockin}</p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Address:
              </span>
              <p className="text-gray-700">{leaveMember.address}</p>
            </div>
          </div>
        )}
        <div className="pt-3">
          <AddButton
            label={
              loading ? (
                <div className="flex items-center justify-between gap-1.5">
                  loading <ClipLoader size={18} color="white" />
                </div>
              ) : (
                "Leave Now"
              )
            }
            loading={loading}
            handleClick={handleSelectLeaveMember}
          />
        </div>
        <div className="py-3">
          <span className="text-sm text-gray-800 font-semibold ">
            Leave Member List
          </span>
          <div className="overflow-auto max-h-[147px] border border-gray-300 rounded">
            <table className="w-full border border-gray-300 overflow-hidden ">
              {/* Table Header */}
              <thead className="bg-gray-300 text-sm text-gray-800 sticky top-0 z-10 ">
                <tr className="relative">
                  <th className="p-1 border">Name</th>
                  <th className="p-1 border">Father Name</th>
                  <th className="p-1 border">Contact Number</th>
                  <th className="p-1 border">Clock In</th>
                  <th className="p-1 border">Clock Out</th>
                  <th className="p-1 border">Present Hours</th>
                </tr>
              </thead>

              {/* Table Body */}
              {listLeaveMember?.map((list) => (
                <tbody className="text-center bg-white text-sm   ">
                  <tr className="hover:bg-gray-100 transition duration-300">
                    <td className="p-1 border ">{list?.fullName}</td>
                    <td className="p-1 border">{list?.fatherName}</td>
                    <td className="p-1 border">{list?.mobileNumber}</td>
                    <td className="p-1 border">{list?.memberClockin}</td>
                    <td className="p-1 border">{list?.memberClockout}</td>
                    <td className="p-1 border">{list?.presentHours}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
