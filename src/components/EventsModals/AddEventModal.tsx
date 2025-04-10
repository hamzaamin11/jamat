import { ChangeEvent, useState } from "react";

import { FaRegImage, FaUser } from "react-icons/fa";

import {
  MdEventAvailable,
  MdOutlineDescription,
  MdOutlineSmartphone,
} from "react-icons/md";

import { IoLocationSharp, IoMailSharp } from "react-icons/io5";

import { FaCalendarDays } from "react-icons/fa6";

import { InputField } from "../Inputs/InputField";

import { AddButton } from "../Buttons/AddButton";

import { Title } from "../title/Title";

import axios from "axios";

import { BASE_URL } from "../../Contents/URL";

import { useAppSelector } from "../../redux/Hooks";

import { toast } from "react-toastify";

import { TextArea } from "../Inputs/Textarea";

type GETEVENTT = {
  id: number;
  eventName: string;
  currentDate: string;
  location: string;
  focalPersonName: string;
  focalPersonNumber: string;
  focalPersonEmail: string;
  infoPersonName: string;
  infoPersonNumber: string;
  infoPersonEmail: string;
  image: string;
  description: string;
  startTime: string;
  endTime: string;
  date?: string;
  presentTime: string;
  eventType: "oneTimeEvent | recursiveEvent";
};

type EditModalProps = {
  setModal: () => void;
  getEventDetail: GETEVENTT | null;
  handleGetEvent: () => void;
};
export const AddEventModal = ({
  setModal,
  getEventDetail,
  handleGetEvent,
}: EditModalProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;
  console.log("=>", getEventDetail);

  const [updateEvent, setUpdateEvent] = useState(getEventDetail);

  console.log(updateEvent, "update");

  console.log(updateEvent, "update Event >>>");

  const [updateImage, setUpdateImage] = useState<File | null>(null);

  console.log("updateEvent", updateEvent);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdateImage(e.target.files[0]);
    }
  };
  console.log();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateEvent({ ...updateEvent, [name]: value } as GETEVENTT);
  };

  // const handleUploadImage = () => {
  //   if (!updateImage) {
  //     alert("Please select an image first.");
  //     return;
  //   }
  //   const formData = new FormData();

  //   console.log(formData, "Before");

  //   formData.append("image", updateImage);

  //   console.log(formData, "AFTER");
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("eventName", updateEvent?.eventName ?? "");
    data.append("date", updateEvent?.date ?? "");
    data.append("eventType", updateEvent?.eventType ?? "");
    data.append("description", updateEvent?.description ?? "");
    data.append("location", updateEvent?.location ?? "");
    data.append("focalPersonEmail", updateEvent?.focalPersonEmail ?? "");
    data.append("focalPersonName", updateEvent?.focalPersonName ?? "");
    data.append("focalPersonNumber", updateEvent?.focalPersonNumber ?? "");
    data.append("infoPersonEmail", updateEvent?.infoPersonEmail ?? "");
    data.append("infoPersonName", updateEvent?.infoPersonEmail ?? "");
    data.append("infoPersonNumber", updateEvent?.infoPersonNumber ?? "");
    if (updateImage) {
      data.append("image", updateImage);
    }
    try {
      const res = await axios.put(
        `${BASE_URL}/user/updateEvent/${updateEvent?.id}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      toast.success("Member updated successfully");
      handleGetEvent();
      setModal();
    } catch (error) {
      console.log(error);
      setModal();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-10">
      <div className="mx-3 bg-white text-gray-700 rounded w-full">
        <Title setModal={setModal}>Update Event</Title>

        <form
          onSubmit={handleSubmit}
          className="border border-gray-400 rounded py-4  "
        >
          <h2 className="mx-3 text-lg font-semibold underline">
            Event Information*
          </h2>
          <div className="grid lg:grid-cols-2 gap-4  mx-3">
            <InputField
              labelName="Event Name*"
              icon={<MdEventAvailable size={25} color="#1E90FF" />} // Blue
              placeHolder={"Enter event name..."}
              fieldType="text"
              name="eventName"
              inputValue={updateEvent?.eventName ?? ""}
              handleChange={handleChange}
            />
            <InputField
              labelName="Event Date*"
              icon={<FaCalendarDays size={25} color="#28A745" />} // Green
              placeHolder={"Enter your phone number ..."}
              fieldType="date"
              name="date"
              inputValue={updateEvent?.date ?? ""}
              handleChange={handleChange}
            />
            <InputField
              labelName="Location*"
              icon={<IoLocationSharp size={25} color="#DC3545" />} // Red
              placeHolder={"Enter your address..."}
              fieldType="text"
              name="location"
              inputValue={updateEvent?.location ?? ""}
              handleChange={handleChange}
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
                  accept="image/*"
                />
              </label>
            </div>

            <div className="">
              <TextArea
                labelName="Description*"
                icon={<MdOutlineDescription size={25} color="#FFC107" />} // Yellow
                placeHolder={"Enter your description..."}
                fieldType="text"
                name="description"
                inputValue={updateEvent?.description ?? ""}
                handleChange={handleChange}
              />
            </div>
          </div>
          <h2 className="mx-3 text-lg font-semibold underline pt-3">
            Focal Person Information*
          </h2>
          <div className="grid lg:grid-cols-3 gap-4  mx-3">
            <InputField
              labelName="Full Name*"
              icon={<FaUser size={25} color="#495057" />}
              placeHolder={"Enter your  name..."}
              fieldType="text"
              name="focalPersonName"
              inputValue={updateEvent?.focalPersonName ?? ""}
              handleChange={handleChange}
            />
            <InputField
              labelName="Phone Number*"
              icon={<MdOutlineSmartphone size={25} color="#0D9488" />}
              placeHolder={"Enter your phone number ..."}
              fieldType="number"
              name="focalPersonNumber"
              inputValue={updateEvent?.focalPersonNumber ?? ""}
              handleChange={handleChange}
            />
            <InputField
              labelName="Email*"
              icon={<IoMailSharp size={25} color="#1E40AF" />}
              placeHolder={"Enter your email ..."}
              fieldType="text"
              name="focalPersonEmail"
              inputValue={updateEvent?.focalPersonEmail ?? ""}
              handleChange={handleChange}
            />
          </div>
          <h2 className="mx-3 text-lg font-semibold underline pt-3">
            Contact Person Information*
          </h2>
          <div className="grid lg:grid-cols-3 gap-4  mx-3">
            <InputField
              labelName="Full Name*"
              icon={<FaUser size={25} color="#495057" />}
              placeHolder={"Enter your name..."}
              fieldType="text"
              name="infoPersonName"
              inputValue={updateEvent?.infoPersonName ?? ""}
              handleChange={handleChange}
            />
            <InputField
              labelName="Phone Number*"
              icon={<MdOutlineSmartphone size={25} color="#0D9488" />}
              placeHolder={"Enter your phone number ..."}
              fieldType="number"
              name="infoPersonNumber"
              inputValue={updateEvent?.infoPersonNumber ?? ""}
              handleChange={handleChange}
            />
            <InputField
              labelName="Email*"
              icon={<IoMailSharp size={25} color="#1E40AF" />}
              placeHolder={"Enter your email ..."}
              fieldType="text"
              name="infoPersonEmail"
              inputValue={updateEvent?.infoPersonEmail ?? ""}
              handleChange={handleChange}
            />
          </div>
          <div className="mx-3  pt-3 flex lg:flex-row flex-col items-center  ">
            <h1 className="text-lg font-semibold underline ">Event Type*</h1>
            <div className=" ml-5 lg:space-x-3 space-x-5">
              <input
                type="radio"
                name="eventType"
                className="radio border-gray-500 text-sky-500"
                value={"oneTimeEvent"}
                // checked={
                //   updateEvent?.eventType === "oneTimeEvent | recursiveEvent"
                // }
                onChange={handleChange}
              />
              <label>One Time Event</label>
              <input
                type="radio"
                name="eventType"
                className="radio border-gray-500 text-sky-500"
                value={"recursiveEvent"}
                // checked={
                //   updateEvent?.eventType === "oneTimeEvent | recursiveEvent"
                // }
                onChange={handleChange}
              />
              <label>Recursive Event</label>
            </div>
          </div>
          <div className="flex items-center justify-center pt-5">
            <AddButton label="Add Event" />
          </div>
        </form>
      </div>
    </div>
  );
};
