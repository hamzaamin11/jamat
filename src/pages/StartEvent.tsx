import { IoSearchCircleOutline } from "react-icons/io5";
import { PiClockLight } from "react-icons/pi";
import { AddButton } from "../components/Buttons/AddButton";
import { useEffect, useState } from "react";
import { StartEventDetail } from "../components/StartEventModals/StarteventDetail";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Contents/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { authFailure } from "../redux/UserSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

type STARTEVENTProps = "START";

type EventType = {
  id: number;
  eventName: string;
  location: string;
  description: string;
  image: string | null;
  focalPersonName: string;
  focalPersonNumber: string;
  focalPersonEmail: string;
  infoPersonName: string;
  infoPersonNumber: string;
  infoPersonEmail: string;
  eventType: string;
  startTime: string;
  endTime: string;
  presentTime: string;
  eventStatus: "oneTimeEvent" | "recursiveEvent";
  currentDate: string;
};

export const StartEvent = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const { loader } = useAppSelector((state) => state?.NavigateSate);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const currentTime = new Date().toLocaleTimeString();

  const [search, setSearch] = useState("");

  const [allEvent, setAllEvent] = useState<EventType[] | null>(null);

  const [eventID, setEventID] = useState<number>();

  const [detailEvent, setDetailEvent] = useState<EventType | null>(null);

  console.log(detailEvent, "ID");
  console.log(eventID);
  const [isOpenModal, setIsOpenModal] = useState<STARTEVENTProps | "">("");
  const handleToggleViewModal = (active: STARTEVENTProps) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  useEffect(() => {
    document.title = "(Jamat)StartEvent";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("StartEvent"));
    }, 1000);
  }, []);

  const handleSearchbar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchEvent`, {
        params: { q: search },
        headers: {
          Authorization: token,
        },
      });

      console.log(res.data);
      setAllEvent(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleSelectEvent = (event: EventType) => {
    setSearch(event?.eventName);
    setEventID(event?.id);
    setAllEvent(null);
  };
  console.log(allEvent, "allEvent");
  const getDetailEvent = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getEventById/${eventID}`, {
        headers: { Authorization: token },
      });
      setDetailEvent(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleStartEvent = async () => {
    handleToggleViewModal("START");
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/startEvent/${eventID}`,

        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (search) {
      handleSearchbar();
      setAllEvent(null);
      getDetailEvent();
    }
  }, [search]);

  if (loader) return <Loading />;

  return (
    <div className="text-gray-700 w-full  px-2 py-2">
      {/* Title */}
      <h1 className="text-2xl font-semibold pt-4 text-gray-800">Start Event</h1>

      {/* Search Input */}
      <form className="flex items-center mt-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 shadow-md w-full">
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-full p-3 text-md tracking-wide placeholder-gray-500 outline-none rounded-l-lg"
          value={search}
          placeholder="Search events..."
        />
        <button className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300">
          <IoSearchCircleOutline size={25} title="Search event" />
        </button>
      </form>

      {allEvent && allEvent.length > 0 && (
        <div className="bg-white min-w-[87rem] max-h-56 p-4 rounded-lg shadow-md absolute z-50 overflow-hidden overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Upcoming Events
          </h2>
          <ul className="space-y-2">
            {allEvent.map((event) => (
              <li
                key={event?.id}
                className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                <span
                  onClick={() => handleSelectEvent(event)}
                  className="text-gray-800 font-medium"
                >
                  {event?.eventName}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Event Details Section */}
      {detailEvent && Object.keys(detailEvent).length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8 border border-gray-200 w-full">
          {/* Event Name */}
          <div className="flex items-center space-x-4 border-b pb-4">
            <h1 className="text-sm font-semibold text-gray-800">Event:</h1>
            <span className="text-sm text-gray-600">
              {detailEvent.eventName}
            </span>
          </div>

          {/* Current Time */}
          <div className="flex items-center space-x-4 border-b py-4">
            <h1 className="text-sm font-semibold text-gray-800">
              Current Time:
            </h1>
            <span className="flex items-center text-sm text-gray-600 gap-2">
              {currentTime}
              <PiClockLight size={26} className="text-gray-500" />
            </span>
          </div>

          {/* Description */}
          <div className="pt-4">
            <h1 className="text-sm font-semibold text-gray-800">
              Description:
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              {detailEvent.description}
            </p>
          </div>
          <div className="flex items-center justify-center pt-6">
            <AddButton
              handleClick={handleStartEvent}
              label={
                loading ? (
                  <div className="flex items-center justify-between gap-1.5">
                    loading <ClipLoader size={18} color="white" />
                  </div>
                ) : (
                  "Start Now"
                )
              }
              loading={loading}
            />
          </div>
        </div>
      )}
      {isOpenModal && (
        <StartEventDetail
          setModal={() => handleToggleViewModal("START")}
          detailEvent={detailEvent}
          eventID={eventID}
        />
      )}
    </div>
  );
};
