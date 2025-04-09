import { Title } from "../title/Title";
import imageProfile from "../../assets/Avatar.png";
import axios from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useEffect } from "react";
import { useAppSelector } from "../../redux/Hooks";

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

type ModalTProps = {
  setModal: () => void;
  viewDetail: MemberT | null;
};

export const ViewUserDetailModal = ({ setModal, viewDetail }: ModalTProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const handleGetImage = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/member-image/${viewDetail?.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetImage();
  }, []);
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-xl border border-gray-300 rounded-lg p-6 shadow-xl relative">
          {/* Close Button */}

          {/* Title */}
          <Title setModal={setModal}>Member Detail</Title>

          {/* Profile Section */}
          <div className="flex  justify-between items-center text-center border-b py-2 text-gray-300">
            <div className="flex flex-col gap-2 ">
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs text-gray-700 font-semibold w-24">
                  Full Name:
                </h1>
                <h2 className=" text-gray-600 text-xs pl-4">
                  {viewDetail?.fullName}
                </h2>
              </div>
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs text-gray-700 font-semibold w-24">
                  Father Name:
                </h1>
                <h2 className=" text-gray-600 text-xs ">
                  {viewDetail?.fatherName}
                </h2>
              </div>
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs font-semibold  text-gray-700  w-16">
                  Email:
                </h1>
                <h2 className=" text-gray-600 text-xs pl-12">
                  {viewDetail?.email}
                </h2>
              </div>
            </div>
            <img
              className="w-28 h-28   rounded-full border-4 bg-sky-500 border-gray-400 object-cover"
              src={viewDetail?.image || imageProfile}
              alt="Profile"
            />
          </div>

          {/* User Details */}
          <div className="mt-2 space-y-2">
            <div className="flex  items-center text-start  py-1">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Contact:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.mobileNumber}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                CNIC:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.cnic}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Date of Birth:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.dob.slice(0, 10)}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Age:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.age}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Zone:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.zone}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Distict:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.district}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Address:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.address}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
