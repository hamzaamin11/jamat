import { InputField } from "../Inputs/InputField";

import { Title } from "../title/Title";

import { AddButton } from "../Buttons/AddButton";

import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { BASE_URL } from "../../Contents/URL";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { OptionField } from "../Inputs/OptionField";
import { IoLocationSharp } from "react-icons/io5";
import { authFailure } from "../../redux/UserSlice";

type UPDATEZONET = {
  id: number;
  zone: string;
  district: string;
};

type ALLDISTRICTT = {
  district: string;
  id: number;
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

  const [getDistrict, setGetDistrict] = useState<ALLDISTRICTT[] | null>(null);

  const [btnLoading, setBtnLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setZone({ ...zone, [name]: value } as UPDATEZONET);
  };

  const handleUpdateZone = async () => {
    setBtnLoading(true);
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
      setBtnLoading(false);
      console.log(res.data);
      handleGetallzone();
      setModal();
      toast.success("Zone updated successfully");
    } catch (error) {
      console.log(error);
      setBtnLoading(false);
    }
  };

  const handleGetdistrict = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getDistrict`, {
        headers: {
          Authorization: token,
        },
      });

      setGetDistrict(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
    }
  };
  const handleClick = () => {
    handleUpdateZone();
    handleGetdistrict();
  };
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded">
        <Title setModal={() => setModal()}>Edit Zone</Title>
        <div className="mx-16 py-6">
          <OptionField
            labelName="District*"
            handlerChange={handleChange}
            name="district"
            inputValue={zone?.district ?? ""}
            optionData={getDistrict?.map((district) => ({
              id: district.id,
              label: district?.district, // Common key for display
              value: district.district, // Common key for value
            }))}
            icon={<IoLocationSharp size={25} />}
            initial=" Please select district"
          />
          <InputField
            labelName="District Name*"
            icon={<FaBriefcase size={25} />}
            placeHolder="Add Zone here..."
            handleChange={handleChange}
            name="zone"
            inputValue={zone?.zone ?? ""}
            fieldType="text"
          />
        </div>
        <div className="flex items-center justify-center pb-4">
          <AddButton
            label={
              btnLoading ? (
                <div className="flex items-center justify-between gap-1.5">
                  loading <ClipLoader size={18} color="white" />
                </div>
              ) : (
                "Update"
              )
            }
            loading={btnLoading}
            handleClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};
