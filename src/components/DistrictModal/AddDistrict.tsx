import { IoLocationSharp } from "react-icons/io5";
import { InputField } from "../Inputs/InputField";
import { Title } from "../title/Title";
import { AddButton } from "../Buttons/AddButton";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

interface ADDZONEProps {
  setModal: () => void;
  handleGetdistrict: () => void;
}
const initialState = {
  district: "",
};
export const AddDistrict = ({ setModal, handleGetdistrict }: ADDZONEProps) => {
  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;
  const [dist, setDist] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDist({ ...dist, [name]: value });
  };

  const handleClick = async () => {
    if (!dist.district.trim()) {
      return toast.error("Required field must be filled");
    }
    try {
      const res = await axios.post(`${BASE_URL}/user/addDistrict`, dist, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setDist(initialState);
      handleGetdistrict();
      toast.success("District added successfully");
      setModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded">
        <Title setModal={() => setModal()}>Add District</Title>
        <div className="mx-16 py-6">
          <InputField
            labelName="District Name*"
            icon={<IoLocationSharp size={25} color="#DC2626" />}
            placeHolder="Add district here..."
            handleChange={handleChange}
            name="district"
            inputValue={dist.district}
            fieldType="text"
          />
        </div>
        <div className="flex items-center justify-center pb-4">
          <AddButton handleClick={handleClick} label="Save" />
        </div>
      </div>
    </div>
  );
};
