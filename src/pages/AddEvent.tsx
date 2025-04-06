import { ChangeEvent, useState } from "react";
import { InputField } from "../components/Inputs/InputField";
import { FaUser } from "react-icons/fa";
import {
  MdEventAvailable,
  MdOutlineDescription,
  MdOutlineSmartphone,
} from "react-icons/md";
import { IoLocationSharp, IoMailSharp } from "react-icons/io5";

import { FaCalendarDays } from "react-icons/fa6";

import { AddButton } from "../components/Buttons/AddButton";
import { TextArea } from "../components/Inputs/Textarea";
import axios from "axios";
import { BASE_URL } from "../Contents/URL";
import { useAppSelector } from "../redux/Hooks";
import { toast } from "react-toastify";
const initialState = {
  eventName: "",
  date: "",
  location: "",
  focalPersonName: "",
  focalPersonNumber: "",
  focalPersonEmail: "",
  infoPersonName: "",
  infoPersonNumber: "",
  infoPersonEmail: "",
  description: "",
  eventType: "oneTimeEvent",
};

export const AddEvent = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [eventData, setEventData] = useState(initialState);

  const token = currentUser?.token;

  const [imagePath, setImagePath] = useState<{ image: null | File }>({
    image: null, // Initially null, but can be a File later
  });

  const finalData = { ...eventData, ...imagePath };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setImagePath((prev) => ({ ...prev, image: file }));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/user/addEvent`, eventData, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      toast.success("Event added successfully");
      setEventData(initialState);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-3 text-gray-700 w-full">
      <h1 className=" font-semibold text-2xl py-2">Add Event</h1>

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
            inputValue={eventData?.eventName}
            handleChange={handleChange}
          />
          <InputField
            labelName="Event Date*"
            icon={<FaCalendarDays size={25} color="#28A745" />} // Green
            placeHolder={"Enter your phone number ..."}
            fieldType="date"
            name="date"
            inputValue={eventData?.date}
            handleChange={handleChange}
          />
          <InputField
            labelName="Location*"
            icon={<IoLocationSharp size={25} color="#DC3545" />} // Red
            placeHolder={"Enter your address..."}
            fieldType="text"
            name="location"
            inputValue={eventData?.location}
            handleChange={handleChange}
          />
          {/* <InputField
            labelName="Image*"
            icon={<FaImage size={25} color="#6F42C1" />} // Purple
            placeHolder={"Upload image..."}
            fieldType="file"
            name="image"
            accept="image/*"
            inputValue={eventData?.image}
            handleChange={handleImageChange}
          /> */}

          <div className="">
            <TextArea
              labelName="Description*"
              icon={<MdOutlineDescription size={25} color="#FFC107" />} // Yellow
              placeHolder={"Enter your description..."}
              fieldType="text"
              name="description"
              inputValue={eventData?.description}
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
            inputValue={eventData?.focalPersonName}
            handleChange={handleChange}
          />
          <InputField
            labelName="Phone Number*"
            icon={<MdOutlineSmartphone size={25} color="#0D9488" />}
            placeHolder={"Enter your phone number ..."}
            fieldType="number"
            name="focalPersonNumber"
            inputValue={eventData?.focalPersonNumber}
            handleChange={handleChange}
          />
          <InputField
            labelName="Email*"
            icon={<IoMailSharp size={25} color="#1E40AF" />}
            placeHolder={"Enter your email ..."}
            fieldType="text"
            name="focalPersonEmail"
            inputValue={eventData?.focalPersonEmail}
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
            inputValue={eventData?.infoPersonName}
            handleChange={handleChange}
          />
          <InputField
            labelName="Phone Number*"
            icon={<MdOutlineSmartphone size={25} color="#0D9488" />}
            placeHolder={"Enter your phone number ..."}
            fieldType="number"
            name="infoPersonNumber"
            inputValue={eventData?.infoPersonNumber}
            handleChange={handleChange}
          />
          <InputField
            labelName="Email*"
            icon={<IoMailSharp size={25} color="#1E40AF" />}
            placeHolder={"Enter your email ..."}
            fieldType="text"
            name="infoPersonEmail"
            inputValue={eventData?.infoPersonEmail}
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
              checked={eventData?.eventType === "oneTimeEvent"}
              onChange={handleChange}
            />
            <label>One Time Event</label>
            <input
              type="radio"
              name="eventType"
              className="radio border-gray-500 text-sky-500"
              value={"recursiveEvent"}
              checked={eventData?.eventType === "recursiveEvent"}
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
  );
};
