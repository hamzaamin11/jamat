import { ChangeEvent, useEffect, useState } from "react";

import {
  FaAddressBook,
  FaBriefcase,
  FaRegIdCard,
  FaRegImage,
  FaUser,
  FaUserTie,
} from "react-icons/fa";
import { MdOutlineSmartphone } from "react-icons/md";
import { IoLocationSharp, IoMailSharp } from "react-icons/io5";
import { CiCalculator2 } from "react-icons/ci";
import { FaCalendarDays } from "react-icons/fa6";
import { PiStudent } from "react-icons/pi";
import { InputField } from "../Inputs/InputField";
import { OptionField } from "../Inputs/OptionField";
import { AddButton } from "../Buttons/AddButton";
import { Title } from "../title/Title";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { authFailure } from "../../redux/UserSlice";
import { ClipLoader } from "react-spinners";

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
};

type getZoneT = {
  id: number;
  zone: string;
};

type getDestrictT = {
  id: number;
  district: string;
};

const SelectMember = [
  {
    id: 1,
    label: "Rukan",
    value: "rukan",
  },
  {
    id: 2,
    label: "Umeedwar Rukan",
    value: "umeedwar",
  },
  {
    id: 3,
    label: "Karkun",
    value: "karkun",
  },
  {
    id: 4,
    label: "Hami",
    value: "hami",
  },
];

type EditModalProps = {
  setModal: () => void;
  viewDetail: MemberT | null;
  handleGetmembers: () => void;
};
export const EditModal = ({
  setModal,
  viewDetail,
  handleGetmembers,
}: EditModalProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [allZone, setAllzone] = useState<getZoneT[] | null>(null);

  const [allDistrict, setAllDistrict] = useState<getDestrictT[] | null>(null);

  const [formData, setFormData] = useState(viewDetail);

  const [updateImage, setUpdateImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdateImage(e.target.files[0]);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as MemberT);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData?.fullName ?? "");
    data.append("fatherName", formData?.fatherName ?? "");
    data.append("email", formData?.email ?? "");
    data.append("age", formData?.age ?? "");
    data.append("cnic", formData?.cnic ?? "");
    data.append("address", formData?.address ?? "");
    data.append("dob", formData?.dob ?? "");
    data.append("education", formData?.education ?? "");
    data.append("mobileNumber", formData?.mobileNumber ?? "");
    data.append("profession", formData?.profession ?? "");
    data.append("district", formData?.district ?? "");
    data.append("zone", formData?.zone ?? "");
    if (updateImage) {
      data.append("image", updateImage);
    }

    if (
      !formData?.address.trim() ||
      // !formData?.age.trim() ||
      !formData?.cnic.trim() ||
      !formData?.district.trim() ||
      !formData?.dob.trim() ||
      !formData?.education.trim() ||
      !formData?.email.trim() ||
      !formData?.fatherName.trim() ||
      !formData?.fullName.trim() ||
      !formData?.mobileNumber.trim() ||
      !formData?.profession.trim() ||
      !formData?.zone.trim() ||
      !updateImage
    ) {
      return toast.error("Required field must be filled");
    }
    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/user/updateMember/${formData?.id}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      toast.success("Member updated successfully");
      handleGetmembers();
      setModal();
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setModal();
      setLoading(false);
    }
  };

  const handleGetZone = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getZone`, {
        headers: {
          Authorization: token,
        },
      });

      setAllzone(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleGetDistrict = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getDistrict`, {
        headers: {
          Authorization: token,
        },
      });

      setAllDistrict(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  useEffect(() => {
    handleGetZone();
    handleGetDistrict();
  }, []);

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10 ">
      <div className="mx-3 bg-white text-gray-700 rounded w-full">
        <Title setModal={setModal}>Update Member Registration</Title>

        <form
          onSubmit={handleSubmit}
          className="border border-gray-400 rounded py-4  "
        >
          <div className="grid lg:grid-cols-3 gap-4 h-[25rem] overflow-y-auto  mx-3 ">
            <InputField
              labelName="Full Name*"
              icon={<FaUser size={25} color="#495057" />}
              placeHolder={"Enter your name..."}
              fieldType="text"
              name="fullName"
              inputValue={(formData?.fullName && formData?.fullName) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Father Name*"
              icon={<FaUserTie size={25} />}
              placeHolder={"Enter your father name..."}
              fieldType="text"
              name="fatherName"
              inputValue={(formData?.fatherName && formData?.fatherName) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Phone Number*"
              icon={<MdOutlineSmartphone size={25} />}
              placeHolder={"Enter your phone number ..."}
              fieldType="number"
              name="mobileNumber"
              inputValue={
                (formData?.mobileNumber && formData?.mobileNumber) ?? ""
              }
              handleChange={handleChange}
            />

            <InputField
              labelName="Email*"
              icon={<IoMailSharp size={25} />}
              placeHolder={"Enter your email ..."}
              fieldType="text"
              name="email"
              inputValue={(formData?.email && formData?.email) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="CNIC*"
              icon={<FaRegIdCard size={25} />}
              placeHolder={"Enter your CNIC ..."}
              fieldType="text"
              name="cnic"
              inputValue={(formData?.cnic && formData?.cnic) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Age*"
              icon={<CiCalculator2 size={25} />}
              placeHolder={"Enter your age ..."}
              fieldType="number"
              name="age"
              inputValue={(formData?.age && formData?.age) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Date of Birth*"
              icon={<FaCalendarDays size={25} />}
              placeHolder={"Enter your date of birth ..."}
              fieldType="date"
              name="dob"
              inputValue={(formData?.dob && formData?.dob.slice(0, 10)) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Education*"
              icon={<PiStudent size={25} />}
              placeHolder={"Enter your education..."}
              fieldType="text"
              name="education"
              inputValue={(formData?.education && formData?.education) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Professional*"
              icon={<FaBriefcase size={25} />}
              placeHolder={"Enter your profession..."}
              fieldType="text"
              name="profession"
              inputValue={(formData?.profession && formData?.profession) ?? ""}
              handleChange={handleChange}
            />

            <OptionField
              labelName="Zone*"
              handlerChange={handleChange}
              name="zone"
              inputValue={(formData?.zone && formData?.zone) ?? ""}
              optionData={allZone?.map((zone) => ({
                id: zone.id,
                label: zone.zone,
                value: zone.zone,
              }))}
              icon={<FaBriefcase size={25} />}
              initial="Please select zone"
            />

            <OptionField
              labelName="District*"
              handlerChange={handleChange}
              name="district"
              inputValue={(formData?.district && formData?.district) ?? ""}
              optionData={allDistrict?.map((district) => ({
                id: district.id,
                label: district.district,
                value: district.district,
              }))}
              icon={<IoLocationSharp size={25} />}
              initial="Please select district"
            />

            <div className="flex flex-col  mt-1 ">
              <span className=" text-gray-800 text-xs font-semibold pb-1">
                Select Image
              </span>
              <label className="flex border  rounded">
                <span className="label text-gray-600 font-medium p-1 w-16 pl-4">
                  <FaRegImage size={25} />
                </span>
                <input
                  type="file"
                  className=" p-2 w-full rounded-r bg-white  outline"
                  onChange={handleChangeFile}
                />
              </label>
            </div>

            <InputField
              labelName="Address*"
              icon={<FaAddressBook size={25} color="#495057" />}
              placeHolder={"Enter your address..."}
              fieldType="text"
              name="address"
              inputValue={(formData?.address && formData?.address) ?? ""}
              handleChange={handleChange}
            />
            <OptionField
              labelName="Member Types*"
              handlerChange={handleChange}
              name="memberType"
              inputValue={(formData?.memberType && formData?.memberType) ?? ""}
              optionData={SelectMember?.map((member) => ({
                id: member.id,
                label: member?.label, // Common key for display
                value: member.value, // Common key for value
              }))}
              icon={<FaUser size={25} />}
              initial="Select Member Type"
            />
          </div>
          <div className="flex items-center justify-center pt-5">
            <AddButton
              label={
                loading ? (
                  <div className="flex items-center justify-between gap-1.5">
                    loading <ClipLoader size={18} color="white" />
                  </div>
                ) : (
                  "Update Registration"
                )
              }
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
