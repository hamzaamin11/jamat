import { ChangeEvent, useState } from "react";

import {
  FaAddressBook,
  FaBriefcase,
  FaImage,
  FaRegIdCard,
  FaUser,
  FaUsers,
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
import axios from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

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

const zoneData = [
  { label: "Please Select Zone", value: "" },
  { label: "Hafizabad", value: "hafizabad" },
  { label: "Gujranwala", value: "gujranwala" },
];
const districtDate = [
  { label: "Please Select District", value: "" },
  { label: "Hafizabad", value: "hafizabad" },
  { label: "Gujranwala", value: "gujranwala" },
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
  const [formData, setFormData] = useState(viewDetail);
  console.log("formData", formData);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as MemberT);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/user/updateMember/${formData?.id}`,
        formData,
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
    } catch (error) {
      console.log(error);
      setModal();
    }
  };
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded w-full">
        <Title setModal={setModal}>Update Member Registration</Title>

        <form
          onSubmit={handleSubmit}
          className="border border-gray-400 rounded py-4  "
        >
          <div className="grid grid-cols-3 gap-4  mx-3">
            <InputField
              labelName="Full Name*"
              icon={<FaUser size={25} color="#495057" />}
              placeHolder={"Enter your name..."}
              fieldType="text"
              name="userName"
              inputValue={formData?.fullName ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Father Name*"
              icon={<FaUsers size={25} color="#495057" />}
              placeHolder={"Enter your father name..."}
              fieldType="text"
              name="fatherName"
              inputValue={formData?.fatherName ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Phone Number*"
              icon={<MdOutlineSmartphone size={25} color="#059669" />}
              placeHolder={"Enter your phone number ..."}
              fieldType="number"
              name="mobileNumber"
              inputValue={formData?.mobileNumber ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Email*"
              icon={<IoMailSharp size={25} color="#1E40AF" />}
              placeHolder={"Enter your email ..."}
              fieldType="text"
              name="email"
              inputValue={formData?.email ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="CNIC*"
              icon={<FaRegIdCard size={25} color="#1E40AF" />}
              placeHolder={"Enter your CNIC ..."}
              fieldType="text"
              name="cnic"
              inputValue={formData?.cnic ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Age*"
              icon={<CiCalculator2 size={25} color="#0D9488" />}
              placeHolder={"Enter your age ..."}
              fieldType="number"
              name="age"
              inputValue={formData?.age ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Date of Birth*"
              icon={<FaCalendarDays size={25} color="#DC2626" />}
              placeHolder={"Enter your date of birth ..."}
              fieldType="date"
              name="dob"
              inputValue={formData?.dob.slice(0, 10) ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Education*"
              icon={<PiStudent size={25} color="#1E40AF" />}
              placeHolder={"Enter your education..."}
              fieldType="text"
              name="education"
              inputValue={formData?.education ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Professional*"
              icon={<FaBriefcase size={25} color="#D97706" />}
              placeHolder={"Enter your profession..."}
              fieldType="text"
              name="professional"
              inputValue={formData?.profession ?? ""}
              handleChange={handleChange}
            />

            <OptionField
              labelName="Zone*"
              handlerChange={handleChange}
              name="zone"
              inputValue={formData?.zone ?? ""}
              optionData={zoneData}
              icon={<FaBriefcase size={25} color="#D97706" />}
            />

            <OptionField
              labelName="District*"
              handlerChange={handleChange}
              name="district"
              inputValue={formData?.district ?? ""}
              optionData={districtDate}
              icon={<IoLocationSharp size={25} color="#DC2626" />}
            />

            <InputField
              labelName="Image*"
              icon={<FaImage size={25} color="#6B7280" />}
              placeHolder={"Upload your image..."}
              fieldType="file"
              name="image"
              accept="image/*"
              inputValue={formData?.image ?? ""}
              handleChange={handleChange}
            />

            <InputField
              labelName="Address*"
              icon={<FaAddressBook size={25} color="#495057" />}
              placeHolder={"Enter your address..."}
              fieldType="text"
              name="address"
              inputValue={formData?.address ?? ""}
              handleChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-center pt-5">
            <AddButton label=" Update Registration" />
          </div>
        </form>
      </div>
    </div>
  );
};

