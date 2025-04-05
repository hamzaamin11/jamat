import { IoLocationSharp } from "react-icons/io5";
import { InputField } from "../Inputs/InputField";
import { Title } from "../title/Title";
import { AddButton } from "../Buttons/AddButton";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
type detailT = {
  district: string;
  id: number;
};
interface ADDZONEProps {
  setModal: () => void;
  detail: detailT | null;
  handleGetdistrict: () => void;
}
export const EditDistrict = ({
  setModal,
  detail,
  handleGetdistrict,
}: ADDZONEProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  console.log(detail, "Edit");
  const token = currentUser?.token;
  const [dist, setDist] = useState(detail);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, "name", value);
    setDist({ ...dist, [name]: value } as detailT);
  };

  const handleClick = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/user/updateDistrict/${dist?.id}`,
        dist,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handleGetdistrict();
      toast.success("District updated successfully");
      setModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded">
        <Title setModal={() => setModal()}>Edit District</Title>
        <div className="mx-16 py-6">
          <InputField
            labelName="District Name*"
            icon={<IoLocationSharp size={25} color="#DC2626" />}
            placeHolder="Add district here..."
            handleChange={handleChange}
            name="district"
            inputValue={dist?.district ?? ""}
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
