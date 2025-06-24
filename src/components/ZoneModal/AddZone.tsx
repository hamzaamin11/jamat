import { InputField } from "../Inputs/InputField";

import { Title } from "../title/Title";

import { AddButton } from "../Buttons/AddButton";

import { useEffect, useRef, useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Contents/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { OptionField } from "../Inputs/OptionField";
import { IoLocationSharp } from "react-icons/io5";
import { authFailure } from "../../redux/UserSlice";

interface ADDZONEProps {
  setModal: () => void;
  handleGetallzone: () => void;
}

type ALLDISTRICTT = {
  district: string;
  id: number;
};

const initialState = {
  zone: "",
  district: "",
};
export const AddZone = ({ setModal, handleGetallzone }: ADDZONEProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const inputRef = useRef<HTMLInputElement>(null);

  console.log(inputRef, "zoneeeee");

  const token = currentUser?.token;

  const [addZone, setAddZone] = useState(initialState);

  const [getDistrict, setGetDistrict] = useState<ALLDISTRICTT[] | null>(null);

  const [btnLoader, setBtnLoader] = useState(false);

  const dispatch = useAppDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  useEffect(() => {
    inputRef?.current?.focus();
    handleGetdistrict();
  }, []);
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded">
        <Title setModal={() => setModal()}>Add Zone</Title>
        <div className="mx-16 py-6">
          <OptionField
            labelName="District*"
            handlerChange={handleChange}
            name="district"
            inputValue={addZone?.district}
            optionData={getDistrict?.map((district) => ({
              id: district.id,
              label: district?.district,
              value: district.district,
            }))}
            icon={<IoLocationSharp size={25} />}
            initial=" Please select district"
          />

          <InputField
            labelName="Zone Name*"
            icon={<FaBriefcase size={25} />}
            placeHolder="Add Zone here..."
            handleChange={handleChange}
            name="zone"
            inputRef={inputRef}
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
