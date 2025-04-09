import { ChangeEvent, useEffect, useState } from "react";
import { InputField } from "../components/Inputs/InputField";
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
import { OptionField } from "../components/Inputs/OptionField";
import { AddButton } from "../components/Buttons/AddButton";
import axios from "axios";
import { BASE_URL } from "../Contents/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { toast } from "react-toastify";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
const initialState = {
  fullName: "",
  fatherName: "",
  district: "",
  zone: "",
  mobileNumber: "",
  address: "",
  education: "",
  email: "",
  cnic: "",
  dob: "",
  age: "",
  profession: "",
};

type ALLZONET = {
  zone: string;
  id: number;
};

type ALLDISTRICTT = {
  district: string;
  id: number;
};

export const AddMember = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const { loader } = useAppSelector((state) => state?.NavigateSate);

  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);

  const [getAllzone, setGetallzone] = useState<ALLZONET[] | null>(null);

  const [getDistrict, setGetDistrict] = useState<ALLDISTRICTT[] | null>(null);

  const [updateImage, setUpdateImage] = useState<File | null>(null);

  console.log(updateImage, "file");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "(Jamat)Registration Member";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Registration"));
    }, 1000);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdateImage(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!updateImage) {
      alert("Please select an image first.");
      return;
    }
    const formData = new FormData();

    formData.append("image", updateImage);
    try {
      const res = await axios.post(`${BASE_URL}/user/uploadImage`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleGetzone = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getZone`, {
        headers: {
          Authorization: token,
        },
      });
      setGetallzone(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetdistrict = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getDistrict`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setGetDistrict(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetmembers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getMembers`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.address.trim() ||
      !formData.age.trim() ||
      !formData.cnic.trim() ||
      !formData.district.trim() ||
      !formData.dob.trim() ||
      !formData.education.trim() ||
      !formData.email.trim() ||
      !formData.fatherName.trim() ||
      !formData.fullName.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.profession.trim() ||
      !formData.zone.trim()
    ) {
      return toast.error("Required field must be filled");
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/registerMember`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      console.log(res.data);
      handleGetmembers();
      handleUploadImage();
      toast.success("User Added successfully");
      setFormData(initialState);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetzone();
    handleGetdistrict();
  }, []);

  if (loader) return <Loading />;

  return (
    <div className="px-3 text-gray-700 w-full">
      <h1 className=" font-semibold text-2xl py-2">Register Member</h1>

      <form
        onSubmit={handleSubmit}
        className="border border-gray-400 rounded py-4  "
      >
        <div className="grid lg:grid-cols-3 gap-4  mx-3">
          <InputField
            labelName="Full Name*"
            icon={<FaUser size={25} color="#495057" />}
            placeHolder={"Enter your name..."}
            fieldType="text"
            name="fullName"
            inputValue={formData?.fullName}
            handleChange={handleChange}
          />

          <InputField
            labelName="Father Name*"
            icon={<FaUsers size={25} color="#495057" />}
            placeHolder={"Enter your father name..."}
            fieldType="text"
            name="fatherName"
            inputValue={formData?.fatherName}
            handleChange={handleChange}
          />

          <InputField
            labelName="Phone Number*"
            icon={<MdOutlineSmartphone size={25} color="#059669" />}
            placeHolder={"Enter your phone number ..."}
            fieldType="number"
            name="mobileNumber"
            inputValue={formData?.mobileNumber}
            handleChange={handleChange}
          />

          <InputField
            labelName="Email*"
            icon={<IoMailSharp size={25} color="#1E40AF" />}
            placeHolder={"Enter your email ..."}
            fieldType="text"
            name="email"
            inputValue={formData?.email}
            handleChange={handleChange}
          />

          <InputField
            labelName="CNIC*"
            icon={<FaRegIdCard size={25} color="#1E40AF" />}
            placeHolder={"Enter your CNIC ..."}
            fieldType="text"
            name="cnic"
            inputValue={formData?.cnic}
            handleChange={handleChange}
          />

          <InputField
            labelName="Age*"
            icon={<CiCalculator2 size={25} color="#0D9488" />}
            placeHolder={"Enter your age ..."}
            fieldType="number"
            name="age"
            inputValue={formData?.age}
            handleChange={handleChange}
          />

          <InputField
            labelName="Date of Birth*"
            icon={<FaCalendarDays size={25} color="#DC2626" />}
            placeHolder={"Enter your date of birth ..."}
            fieldType="date"
            name="dob"
            inputValue={formData?.dob}
            handleChange={handleChange}
          />

          <InputField
            labelName="Education*"
            icon={<PiStudent size={25} color="#1E40AF" />}
            placeHolder={"Enter your education..."}
            fieldType="text"
            name="education"
            inputValue={formData?.education}
            handleChange={handleChange}
          />

          <InputField
            labelName="Professional*"
            icon={<FaBriefcase size={25} color="#D97706" />}
            placeHolder={"Enter your profession..."}
            fieldType="text"
            name="profession"
            inputValue={formData?.profession}
            handleChange={handleChange}
          />

          <OptionField
            labelName="Zone*"
            handlerChange={handleChange}
            name="zone"
            inputValue={formData?.zone}
            optionData={getAllzone?.map((zone) => ({
              id: zone.id ?? "",
              label: zone.zone ?? "",
              value: zone.zone ?? "",
            }))}
            icon={<FaBriefcase size={25} color="#D97706" />}
            initial=" Please select zone"
          />

          <OptionField
            labelName="District*"
            handlerChange={handleChange}
            name="district"
            inputValue={formData?.district}
            optionData={getDistrict?.map((district) => ({
              id: district.id,
              label: district?.district, // Common key for display
              value: district.district, // Common key for value
            }))}
            icon={<IoLocationSharp size={25} color="#DC2626" />}
            initial=" Please select district"
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
                onChange={handleFileChange}
              />
            </label>
          </div>
          {/* <InputField
            labelName="Image*"
            icon={<FaImage size={25} color="#6B7280" />}
            placeHolder={"Upload your image..."}
            fieldType="file"
            name="image"
            accept="image/*"
            // inputValue={}
            handleChange={handleFileChange}
          /> */}

          <InputField
            labelName="Address*"
            icon={<FaAddressBook size={25} color="#495057" />}
            placeHolder={"Enter your address..."}
            fieldType="text"
            name="address"
            inputValue={formData?.address}
            handleChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center pt-5">
          <AddButton label="Registration Now" loading={loading} />
        </div>
      </form>
    </div>
  );
};
