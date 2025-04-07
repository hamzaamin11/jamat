import { Link } from "react-router-dom";

import { AddButton } from "../components/Buttons/AddButton";

import { Search } from "../components/Search/Search";

import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { ViewButton } from "../components/Buttons/ViewButton";

import { EditButton } from "../components/Buttons/EditButton";

import { DeleteButton } from "../components/Buttons/DeleteButton";

import { ChangeEvent, useEffect, useState } from "react";

import { DeleteModal } from "../components/DeleteModal/DeleteModal";

import { ViewEventModal } from "../components/EventsModals/ViewEventDetail";

import axios from "axios";

import { BASE_URL } from "../Contents/URL";

import { useAppSelector } from "../redux/Hooks";

import { toast } from "react-toastify";

import { AddEventModal } from "../components/EventsModals/AddEventModal";

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
  presentTime: string;
  eventType: "oneTimeEvent | recursiveEvent";
};

type ISOPENMODALT = "editEvent" | "deleteEvent" | "viewEvent" | "";

export const EventList = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const [getEvent, setGetEvent] = useState<GETEVENTT[] | null>(null);

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");

  const [viewDetail, setViewDetail] = useState<GETEVENTT | null>(null);

  const [catchId, setCatchId] = useState<number | null>(null);

  const [searchEvent, setSearchEvent] = useState("");

  const handleToggleViewModal = (active: ISOPENMODALT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchEvent(e.target.value);
  };

  const handleSearchbar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchEvent`, {
        headers: {
          Authorization: token,
        },
        params: { q: searchEvent },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleViewClick = (detail: GETEVENTT) => {
    handleToggleViewModal("viewEvent");
    setViewDetail(detail);
  };

  const handleUpdateClick = (detail: GETEVENTT) => {
    handleToggleViewModal("editEvent");
    setViewDetail(detail);
  };
  const handleGetEvent = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getEvent/${10}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setGetEvent(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteButton = (id: number) => {
    handleToggleViewModal("deleteEvent");
    setCatchId(id);
  };
  const handleDeleteEvent = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/user/deleteEvent/${catchId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handleGetEvent();
      toast.info("Event has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetEvent();
  }, []);
  useEffect(() => {
    handleSearchbar();
  }, [searchEvent]);
  return (
    <div className="text-gray-800 mx-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Events List</h1>
        <Link to={"/addevent"}>
          <AddButton label="Add Event" />
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div className=""></div>

        <Search searchData={searchEvent} handleSearch={handleChangeSearch} />
      </div>

      <table className="w-full border border-gray-300 rounded border-separate border-spacing-0 overflow-hidden">
        {/* Table Header */}
        <thead className="bg-sky-500 text-gray-700 ro">
          <tr>
            <th className="p-2 border">Event Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Start Time</th>
            <th className="p-2 border">End Time</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        {getEvent?.map((events) => (
          <tbody key={events?.id} className="text-center bg-white">
            <tr className="hover:bg-gray-100 transition duration-300">
              <td className="p-2 border ">{events.eventName}</td>
              <td className="p-2 border">{events.currentDate}</td>
              <td className="p-2 border">{events?.location}</td>
              <td className="p-2 border ">
                <span className="">
                  {(events?.startTime === "00:00:00" && "--") ||
                    events?.startTime}
                </span>
              </td>
              <td className="p-2 border ">
                <span className="">
                  {" "}
                  {(events?.endTime === "00:00:00" && "--") || events?.endTime}
                </span>
              </td>
              <td className="p-2 border">
                <div className="flex items-center justify-center gap-2">
                  <ViewButton handleView={() => handleViewClick(events)} />
                  <EditButton handleUpdate={() => handleUpdateClick(events)} />
                  <DeleteButton
                    handleDelete={() => handleDeleteButton(events?.id)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      {(!getEvent || getEvent.length === 0) && (
        <span className="flex items-center justify-center border-b text-gray-700 p-2">
          No event records available at the moment!
        </span>
      )}

      <div className="flex items-center justify-between">
        <ShowData total={getEvent?.length} />
        <Pagination />
      </div>
      <div>
        {isOpenModal === "deleteEvent" && (
          <DeleteModal
            isOpen={() => setIsOpenModal("deleteEvent")}
            onClose={() => setIsOpenModal("")}
            onConfirm={handleDeleteEvent}
            message="Are you sure you want to delete this event?"
          />
        )}
        {isOpenModal === "viewEvent" && (
          <ViewEventModal
            setModal={() => setIsOpenModal("")}
            viewDetail={viewDetail}
          />
        )}

        {isOpenModal === "editEvent" && (
          <AddEventModal
            setModal={() => setIsOpenModal("")}
            getEventDetail={viewDetail}
            handleGetEvent={handleGetEvent}
          />
        )}
      </div>
    </div>
  );
};
