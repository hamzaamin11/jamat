import { Title } from "../title/Title";
import imageProfile from "../../assets/Avatar.png";
import axios from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppSelector } from "../../redux/Hooks";
import { useEffect } from "react";
type GETEVENTT = {
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
type ModalTProps = {
  setModal: () => void;
  viewDetail: GETEVENTT | null;
};

export const ViewEventModal = ({ setModal, viewDetail }: ModalTProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;
  console.log("view", viewDetail);

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
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10 ">
      <div className="w-full flex justify-center max-h-full ">
        <div className="bg-white w-full max-w-xl border border-gray-300 rounded-lg p-6 shadow-xl relative">
          {/* Close Button */}

          {/* Title */}
          <Title setModal={setModal}>Event Information</Title>

          {/* Profile Section */}
          <div className="flex  justify-between items-center text-center border-b py-2 text-gray-300">
            <div className="flex flex-col gap-2 ">
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs text-gray-700 font-semibold w-24">
                  Event Name:
                </h1>
                <h2 className=" text-gray-600 text-xs pl-4">
                  {viewDetail?.eventName}
                </h2>
              </div>
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs text-gray-700 font-semibold w-24">
                  Date:
                </h1>
                <h2 className=" text-gray-600 text-xs ">{viewDetail?.date}</h2>
              </div>
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs font-semibold  text-gray-700  w-16">
                  Location:
                </h1>
                <h2 className=" text-gray-600 text-xs pl-12">
                  {viewDetail?.location}
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
          <div className=" ">
            <h2 className="text-lg font-semibold py-1 ">
              Focal Person Information
            </h2>

            <div className="flex  items-center text-start  py-1">
              <span className="text-xs font-semibold text-gray-700  w-[4.5rem]">
                Full Name:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.focalPersonName}
              </div>
            </div>

            <div className="flex  items-center text-start  py-1">
              <span className="text-xs font-semibold text-gray-700  w-[4.5rem]">
                Contact:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.focalPersonNumber}
              </div>
            </div>

            <div className="flex  items-center text-start  py-1">
              <span className="text-xs font-semibold text-gray-700  w-[4.5rem]">
                Email:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {viewDetail?.focalPersonEmail}
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold py-1">
            Contact Person Information
          </h2>

          <div className="flex  items-center text-start  py-1">
            <span className="text-xs font-semibold text-gray-700  w-[4.5rem]">
              Full Name:
            </span>
            <div className="text-gray-600 text-xs  pl-4 h-4 ">
              {viewDetail?.infoPersonName}
            </div>
          </div>
          <div className="flex  items-center text-start  py-1">
            <span className="text-xs font-semibold text-gray-700  w-[4.5rem]">
              Contact:
            </span>
            <div className="text-gray-600 text-xs  pl-4 h-4 ">
              {viewDetail?.infoPersonNumber}
            </div>
          </div>

          <div className="flex  items-center text-start  py-1">
            <span className="text-xs font-semibold text-gray-700  w-[4.5rem]">
              Email:
            </span>
            <div className="text-gray-600 text-xs  pl-4 h-4 ">
              {viewDetail?.infoPersonEmail}
            </div>
          </div>

          <div className="flex  items-center text-start  py-1">
            <span className="text-xs font-semibold text-gray-700  w-[4.5rem]">
              Even type:
            </span>
            <div className="text-gray-600 text-xs  pl-4 h-4 ">
              {viewDetail?.eventType}
            </div>
          </div>

          <div className="flex  gap-2 items-start text-start py-1">
            <span className="text-xs font-semibold text-gray-700 w-[4.5rem]">
              Description:
            </span>
            <div className="text-gray-600 text-xs pl-1">
              {viewDetail?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
