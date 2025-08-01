import { useEffect, useRef, useState } from "react";
import { AddButton } from "../Buttons/AddButton";
import { Title } from "../title/Title";
import { IoSearchCircleOutline } from "react-icons/io5";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { authFailure } from "../../redux/UserSlice";
import { ClipLoader } from "react-spinners";

interface JOINPROPS {
  updateModal: () => void;
  eventID: number | undefined;
}

type MemberT = {
  id: number;
  fullName: string;
  fatherName: string;
  zone: string;
  mobileNumber: string;
  address: string;
  education: string;
  email: string;
  cnic: string;
  districtName: string;
  age: number;
  profession: string;
  currentTime: string;
  memberClockin?: string;
};

export const JoinModal = ({ updateModal, eventID }: JOINPROPS) => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [searchPerson, setSearchPerson] = useState("");

  const [loading, setLoading] = useState(false);

  const [searchMember, setSearchMember] = useState<MemberT[] | null>(null);

  const [addMember, setAddMember] = useState<MemberT | null>(null);

  const [addMemberList, setAddMemberList] = useState<MemberT[] | null>(null);

  const memberRef = useRef<HTMLDivElement>(null);

  const handleSearchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchMember`, {
        params: { q: searchPerson },
        headers: { Authorization: token },
      });
      setSearchMember(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectEvent = (getUser: MemberT) => {
    setAddMember(getUser);
    setSearchMember(null);
  };
  console.log(searchMember, "seacher");

  const handleGetAllMembers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/getJoinMembers/${eventID}`,
        {
          headers: { Authorization: token },
        }
      );

      setAddMemberList(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleAddMember = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/joinEvent/${eventID}/${addMember?.id}`,
        addMember,
        { headers: { Authorization: token } }
      );
      console.log(res.data);
      handleGetAllMembers();
      setLoading(false);
      toast.success("Member added successfully!");
      setAddMember(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
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
    setSearchMember(null);
    handleGetAllMembers();
  }, [searchPerson]);
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-30">
      <div
        className="bg-white lg:w-[50rem] w-[23rem]  p-6 border border-gray-200 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Section */}
        <div className="  pb-3 mb-4">
          <Title setModal={updateModal}>Join Event</Title>
        </div>

        {/* Search Bar */}
        <form className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 mb-5">
          <input
            type="text"
            value={searchPerson}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchPerson(e.target.value)
            }
            className="w-full p-3 text-md tracking-wide placeholder-gray-500 outline-none rounded-l-md"
            placeholder="Search Member by Name,CNIC or Email..."
          />
          <button className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-300">
            <IoSearchCircleOutline size={28} title="Search event" />
          </button>
        </form>
        {searchMember && searchMember.length > 0 && (
          <div
            ref={memberRef}
            className="bg-white w-[47rem] max-h-36 p-4 rounded-lg shadow-md absolute z-20  overflow-hidden overflow-y-auto"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Add Members
            </h2>
            <ul className="space-y-2">
              {searchMember.map((event) => (
                <li
                  key={event?.id}
                  className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition hover:cursor-pointer"
                  onClick={() => handleSelectEvent(event)}
                >
                  <span className="text-gray-800 font-medium text-sm">
                    {event?.fullName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* User Information Section */}

        {addMember && (
          <div className="grid lg:grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Full Name:
              </span>
              <p className="text-gray-700">
                {(addMember?.fullName && addMember?.fullName) || "--"}
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Father Name:
              </span>
              <p className="text-gray-700">
                {(addMember?.fatherName && addMember?.fatherName) || "--"}
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                CNIC:
              </span>
              <p className="text-gray-700">
                {(addMember?.cnic && addMember?.cnic) || "--"}
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Contact:
              </span>
              <p className="text-gray-700">
                {(addMember?.mobileNumber && addMember?.mobileNumber) || "--"}
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Email:
              </span>
              <p className="text-gray-700 overflow-hidden break-words w-48 ">
                {(addMember?.email && addMember?.email) || "--"}
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                District:
              </span>
              <p className="text-gray-700">
                {(addMember?.districtName && addMember?.districtName) || "--"}
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Zone:
              </span>
              <p className="text-gray-700">
                {(addMember?.zone && addMember?.zone) || "--"}
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Current Time:
              </span>
              <p className="text-gray-700">
                {(addMember?.currentTime && addMember?.currentTime) || "--"}
              </p>
            </div>

            <div className="flex items-center ">
              <span className="text-sm text-gray-800 font-semibold w-32">
                Address:
              </span>
              <p className="text-gray-700 w-52 overflow-hidden break-words">
                {(addMember?.address && addMember?.address) || "--"}
              </p>
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
                "Add Now"
              )
            }
            loading={loading}
            handleClick={handleAddMember}
          />
        </div>
        <div className="py-3">
          <span className="text-sm text-gray-800 font-semibold ">
            Participants List
          </span>
          <div className="h-[9.5rem] overflow-y-auto">
            <table className="w-full border border-gray-300 overflow-hidden ">
              {/* Table Header */}
              <thead className="bg-gray-300 lg:text-sm text-xs text-gray-800 sticky top-0 z-10  ">
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

              {addMemberList?.map((member) => (
                <tbody className="text-center bg-white lg:text-sm text-xs">
                  <tr
                    className="hover:bg-gray-100 transition duration-300"
                    key={member.id}
                  >
                    <td className="p-1 border ">
                      {(member?.fullName && member?.fullName) || "--"}
                    </td>
                    <td className="p-1 border">
                      {(member?.fatherName && member?.fatherName) || "--"}
                    </td>
                    <td className="p-1 border">
                      {(member?.mobileNumber && member?.mobileNumber) || "--"}
                    </td>
                    <td className="p-1 border">
                      {(member?.memberClockin &&
                        member?.memberClockin?.slice(0, 5)) ||
                        "--"}
                    </td>
                    <td className="p-1 border">--</td>
                    <td className="p-1 border">--</td>
                  </tr>
                </tbody>
              ))}
            </table>
            {(!addMemberList || addMemberList.length === 0) && (
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
