import { AddButton } from "../components/Buttons/AddButton";

import { Search } from "../components/Search/Search";

import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { EditButton } from "../components/Buttons/EditButton";

import { DeleteButton } from "../components/Buttons/DeleteButton";

import { ChangeEvent, useEffect, useState } from "react";

import { DeleteModal } from "../components/DeleteModal/DeleteModal";

import { AddZone } from "../components/ZoneModal/AddZone";

import { EditZone } from "../components/ZoneModal/EditZone";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Contents/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { toast } from "react-toastify";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { authFailure } from "../redux/UserSlice";

type AllZoneT = {
  id: number;
  zone: string;
  district: string;
};
type ISOPENMODALT = "EDIT" | "DELETE" | "ADD";

export const Zone = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [allZone, setAllZone] = useState<AllZoneT[] | null>(null);

  const [updateZone, setUpdateZone] = useState<AllZoneT | null>(null);

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");

  const [pageNo, setPageNo] = useState(1);

  const [searchBar, setSearchBar] = useState("");

  useEffect(() => {
    document.title = "Events Tracking - JI GRW";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("ZoneList"));
    }, 1000);
  }, []);

  const handleToggleViewModal = (active: ISOPENMODALT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };
  const handleEditClick = (detail: AllZoneT) => {
    handleToggleViewModal("EDIT");
    setUpdateZone(detail);
  };
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchBar(e.target.value);
  };

  const handleIncrementPageButton = () => {
    setPageNo(pageNo + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleSearchbar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchZones`, {
        headers: {
          Authorization: token,
        },
        params: { q: searchBar },
      });
      setAllZone(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteClick = (id: AllZoneT) => {
    handleToggleViewModal("DELETE");
    setUpdateZone(id);
  };

  const handleGetallzone = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/getZone?page=${pageNo}`, {
        headers: {
          Authorization: token,
        },
      });
      setAllZone(res.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
      setAllZone(null);
      setLoading(false);
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
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  useEffect(() => {
    handleGetallzone();
  }, [pageNo]);

  useEffect(() => {
    handleSearchbar();
  }, [searchBar]);

  if (loading) return <Loading />;
  return (
    <div className="text-gray-700 px-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold">Zone List</h1>

        <AddButton
          label="Add Zone"
          handleClick={() => handleToggleViewModal("ADD")}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className=""></div>
        <Search handleSearch={handleChangeSearch} searchData={searchBar} />
      </div>

      <table className="w-full border border-gray-300  border-separate border-spacing-0 rounded overflow-hidden">
        {/* Table Header */}
        <thead className="bg-sky-500 text-gray-700 ">
          <tr>
            <th className="p-1 text-sm border text-white border-gray-700">
              Sr#
            </th>
            <th className="p-1 text-sm border text-white border-gray-700">
              District
            </th>
            <th className="p-1 text-sm border text-white border-gray-700">
              Zone{" "}
            </th>
            <th className="p-1 text-sm border text-white border-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        {allZone?.map((zone, index) => (
          <tbody key={zone?.id} className="text-center bg-white">
            <tr className="hover:bg-gray-100 transition duration-300">
              <td className="p-1 text-sm border ">{index + 1}</td>
              <td className="p-1 text-sm border ">{"Lahore"}</td>
              <td className="p-1 text-sm border ">{zone?.zone}</td>
              <td className="p-1 text-sm border">
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
        <span className="flex items-center justify-center border-b text-gray-700 p-2 text-xs lg:text-sm">
          No zone records available at the moment!
        </span>
      )}

      <div className="flex items-center justify-between">
        <ShowData total={allZone?.length} />
        <Pagination
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
          page={pageNo}
        />
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
