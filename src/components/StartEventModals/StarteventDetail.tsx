import { Title } from "../title/Title";
import image from "../../assets/expo.jpg";
import { useState } from "react";
import { JoinModal } from "./JoinModal";
import { LeaveModal } from "./LeaveModall";
import { EndModal } from "./EndModal";

interface detailEventT {
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
}

interface StartEventProps {
  setModal: () => void;
  detailEvent: detailEventT | null;
  eventID: number | undefined;
}
type EVENTOPENT = "JOIN" | "LEAVE" | "END";
export const StartEventDetail = ({
  setModal,
  detailEvent,
  eventID,
}: StartEventProps) => {
  const [isOpenModal, setIsOpenModal] = useState<EVENTOPENT | "">("");

  const handleToggleViewModal = (active: EVENTOPENT) => {
    // Prevents event bubbling
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm  bg-opacity-40 flex items-center justify-center z-10"
      onClick={setModal} // Close modal when clicking outside
    >
      <div
        className="mx-3 bg-white text-gray-700 rounded-lg shadow-lg w-[60rem] p-6"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <Title setModal={setModal}>Event Detail</Title>

        <div className="flex gap-6 items-start mt-4">
          {/* Event Image */}
          <div className="p-2 border rounded">
            <img
              src={image ?? detailEvent?.image}
              className=" bg-sky-500  border border-gray-300 object-cover"
              alt="Event"
            />
          </div>

          {/* Event Details */}
          <div className="w-full">
            <p className="text-sm text-gray-700 leading-relaxed h-44 overflow-hidden">
              {/* <strong>Tech Conference 2025</strong> is a premier event bringing
              together industry leaders, tech enthusiasts, and innovators from
              around the world. This event will showcase groundbreaking
              advancements in{" "}
              <strong>
                artificial intelligence, blockchain, cybersecurity,
              </strong>{" "}
              and <strong>software development.</strong>
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              Attendees will gain valuable insights through interactive
              workshops, keynote speeches by top experts, and networking
              sessions with professionals across industries. Whether you're a
              seasoned developer or new to tech,{" "}
              <strong>Tech Conference 2025</strong> provides an unparalleled
              opportunity to explore the future of digital transformation.
            </p> */}
              {detailEvent?.description}
            </p>
            <p className="text-blue-500 font-medium mt-2">
              Join us and be part of the next big leap in technology!
            </p>
            <div className="space-x-5 flex items-center justify-center pt-4">
              <button
                onClick={() => handleToggleViewModal("JOIN")}
                className="text-white bg-blue-600 rounded p-2 hover:cursor-pointer  duration-300 active:scale-95"
              >
                Join Event
              </button>
              <button
                onClick={() => handleToggleViewModal("LEAVE")}
                className="text-white bg-yellow-500 rounded p-2 hover:cursor-pointer  duration-300 active:scale-95"
              >
                Leave Event
              </button>
              <button
                onClick={() => handleToggleViewModal("END")}
                className="text-white bg-red-500 rounded p-2 hover:cursor-pointer duration-300 active:scale-95"
              >
                End Event
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpenModal === "JOIN" && (
        <JoinModal
          updateModal={() => handleToggleViewModal("JOIN")}
          eventID={eventID}
        />
      )}
      {isOpenModal === "LEAVE" && (
        <LeaveModal
          updateModal={() => handleToggleViewModal("LEAVE")}
          eventID={eventID}
        />
      )}
      {isOpenModal === "END" && (
        <div className="duration-500 transition-all ease-in-out">
          {isOpenModal === "END"} &&{" "}
          <EndModal
            updateModal={() => handleToggleViewModal("END")}
            eventID={eventID}
          />
        </div>
      )}
    </div>
  );
};
