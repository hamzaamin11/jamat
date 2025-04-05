import { AddButton } from "../components/Buttons/AddButton";

import { Search } from "../components/Search/Search";

import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { EditButton } from "../components/Buttons/EditButton";

import { DeleteButton } from "../components/Buttons/DeleteButton";

import { useEffect, useState } from "react";

import { DeleteModal } from "../components/DeleteModal/DeleteModal";

import { AddZone } from "../components/ZoneModal/AddZone";

import { EditZone } from "../components/ZoneModal/EditZone";
import axios from "axios";
import { BASE_URL } from "../Contents/URL";
import { useAppSelector } from "../redux/Hooks";
import { toast } from "react-toastify";

const numbers = ["10", "25", "50", "100"];
type AllZoneT = {
  id: number;
  zone: string;
};
type ISOPENMODALT = "EDIT" | "DELETE" | "ADD";

export const Zone = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [allZone, setAllZone] = useState<AllZoneT[] | null>(null);

  const [updateZone, setUpdateZone] = useState<AllZoneT | null>(null);

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");

  const handleToggleViewModal = (active: ISOPENMODALT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };
  const handleEditClick = (detail: AllZoneT) => {
    handleToggleViewModal("EDIT");
    setUpdateZone(detail);
  };

  const handleDeleteClick = (id: AllZoneT) => {
    handleToggleViewModal("DELETE");
    setUpdateZone(id);
  };

  const handleGetallzone = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getZone`, {
        headers: {
          Authorization: token,
        },
      });
      setAllZone(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteZone = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/user/deleteZone/${updateZone?.id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handleGetallzone();
      toast.info("Zone has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetallzone();
  }, []);
  return (
    <div className="text-gray-700 mx-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold">Zone List</h1>

        <AddButton
          label="Add Zone"
          handleClick={() => handleToggleViewModal("ADD")}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="">
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select>
              {numbers.map((num, index) => (
                <option key={index}>{num}</option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>
        <Search />
      </div>

      <table className="w-full border border-gray-300  border-separate border-spacing-0 rounded overflow-hidden">
        {/* Table Header */}
        <thead className="bg-sky-500 text-gray-700 ">
          <tr>
            <th className="p-2 border text-white border-gray-700">Sr#</th>
            <th className="p-2 border text-white border-gray-700">Zone</th>
            <th className="p-2 border text-white border-gray-700">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        {allZone?.map((zone, index) => (
          <tbody key={zone?.id} className="text-center bg-white">
            <tr className="hover:bg-gray-100 transition duration-300">
              <td className="p-2 border ">{index + 1}</td>
              <td className="p-2 border ">{zone?.zone}</td>
              <td className="p-2 border">
                <div className="flex items-center justify-center gap-2">
                  <EditButton handleUpdate={() => handleEditClick(zone)} />
                  <DeleteButton handleDelete={() => handleDeleteClick(zone)} />
                </div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      {(!allZone || allZone.length === 0) && (
        <span className="flex items-center justify-center border-b text-gray-700 p-2">
          No zone records available at the moment!
        </span>
      )}

      <div className="flex items-center justify-between">
        <ShowData total={allZone?.length} />
        <Pagination />
      </div>
      <div>
        {isOpenModal === "DELETE" && (
          <DeleteModal
            isOpen={() => setIsOpenModal("DELETE")}
            onClose={() => setIsOpenModal("")}
            onConfirm={() => handleDeleteZone()}
            message="Are you sure you want to delete this zone?"
          />
        )}
        {isOpenModal === "EDIT" && (
          <EditZone
            setModal={() => setIsOpenModal("")}
            updateZone={updateZone}
            handleGetallzone={handleGetallzone}
          />
        )}

        {isOpenModal === "ADD" && (
          <AddZone
            setModal={() => setIsOpenModal("")}
            handleGetallzone={handleGetallzone}
          />
        )}
      </div>
    </div>
  );
};
