import { Title } from "../title/Title";
import imageProfile from "../../assets/Avatar.png";

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
  memberType: string;
  profession: string;
  image: string;
};

type ModalTProps = {
  setModal: () => void;
  viewDetail: MemberT | null;
};

export const ViewUserDetailModal = ({ setModal, viewDetail }: ModalTProps) => {
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-xl border border-gray-300 rounded-lg p-6 shadow-xl relative">
          {/* Close Button */}

          {/* Title */}
          <Title setModal={setModal}>Member Detail</Title>

          {/* Profile Section */}
          <div className="flex  justify-between items-center text-center border-b py-2 gap-2 lg:gap-0 text-gray-300">
            <div className="flex flex-col gap-2 ">
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs text-gray-700 font-semibold w-24">
                  Full Name:
                </h1>
                <h2 className=" text-gray-600 text-xs  ">
                  {(viewDetail?.fullName &&
                    viewDetail?.fullName.slice(0, 18)) ||
                    "--"}
                </h2>
              </div>
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs text-gray-700 font-semibold w-24">
                  Father Name:
                </h1>
                <h2 className=" text-gray-600 text-xs">
                  {(viewDetail?.fatherName && viewDetail?.fatherName) || "--"}
                </h2>
              </div>
              <div className="flex  items-center justify-between text-start bg-gray-100   py-2 px-2 rounded ">
                <h1 className="text-xs font-semibold  text-gray-700  w-16">
                  Email:
                </h1>
                <h2 className=" text-gray-600 text-xs ">
                  {(viewDetail?.email && viewDetail?.email) || "--"}
                </h2>
              </div>
            </div>
            <img
              className="lg:w-28 lg:h-28 w-20 h-20   rounded-full border-4 bg-sky-500 border-gray-400 object-cover mr-2"
              src={(viewDetail?.image && viewDetail?.image) || imageProfile}
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
                {(viewDetail?.mobileNumber && viewDetail?.mobileNumber) || "--"}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                CNIC:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {(viewDetail?.cnic && viewDetail?.cnic) || "--"}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Date of Birth:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {(viewDetail?.dob && viewDetail?.dob.slice(0, 10)) || "--"}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Age:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {(viewDetail?.age && viewDetail?.age) || "--"}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Zone:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {(viewDetail?.zone && viewDetail?.zone) || "--"}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Distict:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {(viewDetail?.district && viewDetail?.district) || "--"}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Member Type:
              </span>
              <div className="text-gray-600 text-xs pl-4 ">
                {(viewDetail?.memberType && viewDetail?.memberType) || "--"}
              </div>
            </div>

            <div className="flex  items-center text-start py-1 ">
              <span className="text-xs font-semibold text-gray-700  w-24">
                Address:
              </span>
              <div className="text-gray-600 text-xs pl-4 overflow-hidden break-words ">
                {(viewDetail?.address && viewDetail?.address) || "--"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
