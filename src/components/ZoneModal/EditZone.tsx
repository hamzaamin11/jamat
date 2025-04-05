import { InputField } from "../Inputs/InputField";

import { Title } from "../title/Title";

import { AddButton } from "../Buttons/AddButton";

import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { BASE_URL } from "../../Contents/URL";
import axios from "axios";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type UPDATEZONET = {
  id: number;
  zone: string;
};
interface ADDZONEProps {
  setModal: () => void;
  updateZone: UPDATEZONET | null;
  handleGetallzone: () => void;
}
export const EditZone = ({
  setModal,
  updateZone,
  handleGetallzone,
}: ADDZONEProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const [zone, setZone] = useState(updateZone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setZone({ ...zone, [name]: value } as UPDATEZONET);
  };

  const handleUpdateZone = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/user/updateZone/${zone?.id}`,
        zone,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handleGetallzone();
      setModal();
      toast.success("Zone updated successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = () => {
    handleUpdateZone();
  };
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded">
        <Title setModal={() => setModal()}>Edit Zone</Title>
        <div className="mx-16 py-6">
          <InputField
            labelName="District Name*"
            icon={<FaBriefcase size={25} color="#DC2626" />}
            placeHolder="Add Zone here..."
            handleChange={handleChange}
            name="zone"
            inputValue={zone?.zone ?? ""}
            fieldType="text"
          />
        </div>
        <div className="flex items-center justify-center pb-4">
          <AddButton handleClick={handleClick} label="Update" />
        </div>
      </div>
    </div>
  );
};
