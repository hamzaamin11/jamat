import { InputField } from "../Inputs/InputField";

import { Title } from "../title/Title";

import { AddButton } from "../Buttons/AddButton";

import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

interface ADDZONEProps {
  setModal: () => void;
  handleGetallzone: () => void;
}

const initialState = {
  zone: "",
};
export const AddZone = ({ setModal, handleGetallzone }: ADDZONEProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [addZone, setAddZone] = useState(initialState);

  const [btnLoader, setBtnLoader] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddZone({ ...addZone, [name]: value });
  };

  const handleClick = async () => {
    if (!addZone.zone.trim()) {
      return toast.error("Required field must be filled");
    }
    setBtnLoader(true);
    try {
      const res = await axios.post(`${BASE_URL}/user/addZone`, addZone, {
        headers: {
          Authorization: token,
        },
      });
      setBtnLoader(false);
      console.log(res.data);
      toast.success("Zone added successfully");
      handleGetallzone();
      setModal();
    } catch (error) {
      console.log(error);
      setBtnLoader(false);
    }
  };
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded">
        <Title setModal={() => setModal()}>Add Zone</Title>
        <div className="mx-16 py-6">
          <InputField
            labelName="District Name*"
            icon={<FaBriefcase size={25} color="#DC2626" />}
            placeHolder="Add Zone here..."
            handleChange={handleChange}
            name="zone"
            inputValue={addZone.zone}
            fieldType="text"
          />
        </div>
        <div className="flex items-center justify-center pb-4">
          <AddButton
            label={
              btnLoader ? (
                <div className="flex items-center justify-between gap-1.5">
                  loading <ClipLoader size={18} color="white" />
                </div>
              ) : (
                "Save"
              )
            }
            loading={btnLoader}
            handleClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};
