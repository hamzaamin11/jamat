import { ChangeEvent, useEffect, useRef, useState } from "react";

import { InputField } from "../components/Inputs/InputField";

import { FaRegImage, FaUser } from "react-icons/fa";
import {
  MdEventAvailable,
  MdOutlineDescription,
  MdOutlineSmartphone,
} from "react-icons/md";

import { IoLocationSharp, IoMailSharp } from "react-icons/io5";

import { FaCalendarDays } from "react-icons/fa6";

import { AddButton } from "../components/Buttons/AddButton";

import { TextArea } from "../components/Inputs/Textarea";

import axios, { AxiosError } from "axios";

import { BASE_URL } from "../Contents/URL";

import { useAppDispatch, useAppSelector } from "../redux/Hooks";

import { toast } from "react-toastify";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { ClipLoader } from "react-spinners";
import { authFailure } from "../redux/UserSlice";

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
  image: "",
  eventType: "oneTimeEvent",
};

export const AddEvent = () => {
  const { loader } = useAppSelector((state) => state?.NavigateSate);

  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((state) => state.officeState);

  const inputRef = useRef<HTMLInputElement>(null);

  const token = currentUser?.token;

  const [eventData, setEventData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const [updateImage, setUpdateImage] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdateImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    document.title = "Events Tracking - JI GRW";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("AddEvent"));
    }, 1000);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append("eventName", eventData.eventName);
    data.append("date", eventData.date);
    data.append("eventType", eventData.eventType);
    data.append("description", eventData.description);
    data.append("location", eventData.location);
    data.append("focalPersonEmail", eventData.focalPersonEmail);
    data.append("focalPersonName", eventData.focalPersonName);
    data.append("focalPersonNumber", eventData.focalPersonNumber);
    data.append("infoPersonEmail", eventData.infoPersonEmail);
    data.append("infoPersonName", eventData.infoPersonEmail);
    data.append("infoPersonNumber", eventData.infoPersonNumber);
    if (updateImage) {
      data.append("image", updateImage);
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/user/addEvent`, data, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      toast.success("Event added successfully");
      setEventData(initialState);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  if (loader) return <Loading />;
  return (
    <div className="px-3 text-gray-700 w-full">
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
            icon={<MdEventAvailable size={25} />}
            placeHolder={"Enter event name..."}
            fieldType="text"
            name="eventName"
            inputRef={inputRef}
            inputValue={eventData?.eventName}
            handleChange={handleChange}
          />
          <InputField
            labelName="Event Date*"
            icon={<FaCalendarDays size={25} />}
            placeHolder={"Enter your phone number ..."}
            fieldType="date"
            name="date"
            inputValue={eventData?.date}
            handleChange={handleChange}
          />
          <InputField
            labelName="Location"
            icon={<IoLocationSharp size={25} />}
            placeHolder={"Enter your address..."}
            fieldType="text"
            name="location"
            inputValue={eventData?.location}
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
                name="image"
                className=" p-2 w-full rounded-r bg-white  outline"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          <div className="">
            <TextArea
              labelName="Description"
              icon={<MdOutlineDescription size={25} />}
              placeHolder={"Enter your description..."}
              fieldType="text"
              name="description"
              inputValue={eventData?.description}
              handleChange={handleChange}
            />
          </div>
        </div>
        <h2 className="mx-3 text-lg font-semibold underline pt-3">
          Focal Person Information
        </h2>
        <div className="grid lg:grid-cols-3 gap-4  mx-3">
          <InputField
            labelName="Full Name*"
            icon={<FaUser size={25} />}
            placeHolder={"Enter your  name..."}
            fieldType="text"
            name="focalPersonName"
            inputValue={eventData?.focalPersonName}
            handleChange={handleChange}
          />
          <InputField
            labelName="Phone Number"
            icon={<MdOutlineSmartphone size={25} />}
            placeHolder={"Enter your phone number ..."}
            fieldType="number"
            name="focalPersonNumber"
            inputValue={eventData?.focalPersonNumber}
            handleChange={handleChange}
          />
          <InputField
            labelName="Email"
            icon={<IoMailSharp size={25} />}
            placeHolder={"Enter your email ..."}
            fieldType="text"
            name="focalPersonEmail"
            inputValue={eventData?.focalPersonEmail}
            handleChange={handleChange}
          />
        </div>
        <h2 className="mx-3 text-lg font-semibold underline pt-3">
          Contact Person Information
        </h2>
        <div className="grid lg:grid-cols-3 gap-4  mx-3">
          <InputField
            labelName="Full Name"
            icon={<FaUser size={25} />}
            placeHolder={"Enter your name..."}
            fieldType="text"
            name="infoPersonName"
            inputValue={eventData?.infoPersonName}
            handleChange={handleChange}
          />
          <InputField
            labelName="Phone Number"
            icon={<MdOutlineSmartphone size={25} />}
            placeHolder={"Enter your phone number ..."}
            fieldType="number"
            name="infoPersonNumber"
            inputValue={eventData?.infoPersonNumber}
            handleChange={handleChange}
          />
          <InputField
            labelName="Email"
            icon={<IoMailSharp size={25} />}
            placeHolder={"Enter your email ..."}
            fieldType="text"
            name="infoPersonEmail"
            inputValue={eventData?.infoPersonEmail}
            handleChange={handleChange}
          />
        </div>
        <div className="mx-3  pt-3 flex lg:flex-row flex-col items-center  ">
          <h1 className="text-lg font-semibold underline ">Event Type</h1>
          <div className="lg:ml-5 ml-0  lg:space-x-3 space-x-2 text-sm ">
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
          <AddButton
            label={
              loading ? (
                <div className="flex items-center justify-between gap-1.5">
                  loading <ClipLoader size={18} color="white" />
                </div>
              ) : (
                "Add Event"
              )
            }
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};
