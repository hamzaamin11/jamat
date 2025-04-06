import { ChangeEvent, useEffect, useState } from "react";

import {
  FaAddressBook,
  FaBriefcase,
  FaRegIdCard,
  FaRegImage,
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
};

type getZoneT = {
  id: number;
  zone: string;
};

type getDestrictT = {
  id: number;
  district: string;
};

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

  const [allZone, setAllzone] = useState<getZoneT[] | null>(null);

  const [allDistrict, setAllDistrict] = useState<getDestrictT[] | null>(null);

  const [formData, setFormData] = useState(viewDetail);

  const [updateImage, setUpdateImage] = useState<File | null>(null);

  console.log(updateImage);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdateImage(e.target.files[0]);
    }
  };

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

  const handleGetZone = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getZone`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setAllzone(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetDistrict = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getDistrict`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setAllDistrict(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetZone();
    handleGetDistrict();
  }, []);

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
              optionData={allZone?.map((zone) => ({
                id: zone.id,
                label: zone.zone,
                value: zone.zone,
              }))}
              icon={<FaBriefcase size={25} color="#D97706" />}
              initial="Please select zone"
            />

            <OptionField
              labelName="District*"
              handlerChange={handleChange}
              name="district"
              inputValue={formData?.district ?? ""}
              optionData={allDistrict?.map((district) => ({
                id: district.id,
                label: district.district,
                value: district.district,
              }))}
              icon={<IoLocationSharp size={25} color="#DC2626" />}
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
              inputValue={formData?.address ?? ""}
              handleChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-center pt-5">
            <AddButton label="Update Registration" />
          </div>
        </form>
      </div>
    </div>
  );
};
