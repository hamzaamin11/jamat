import { AddButton } from "../components/Buttons/AddButton";

import { Search } from "../components/Search/Search";

import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { EditButton } from "../components/Buttons/EditButton";

import { DeleteButton } from "../components/Buttons/DeleteButton";
import { ChangeEvent, useEffect, useState } from "react";
import { DeleteModal } from "../components/DeleteModal/DeleteModal";

import { AddDistrict } from "../components/DistrictModal/AddDistrict";
import { EditDistrict } from "../components/DistrictModal/EditDistrict";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Contents/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { toast } from "react-toastify";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { authFailure } from "../redux/UserSlice";

type districtT = {
  district: string;
  id: number;
};
type ISOPENMODALT = "EDIT" | "DELETE" | "ADD";
export const District = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const [districts, setDistricts] = useState<districtT[] | null>(null);

  const [detail, setDetail] = useState<districtT | null>(null);

  const [districtID, setDistrictID] = useState<number>();

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");

  const [searchBar, setSeachBar] = useState("");

  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    document.title = "(Jamat)District";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("districtList"));
    }, 1000);
  }, []);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSeachBar(e.target.value);
  };

  const handleSearchbar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchDistricts`, {
        headers: {
          Authorization: token,
        },
        params: { q: searchBar },
      });
      setDistricts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleViewModal = (active: ISOPENMODALT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleEditClick = (detail: districtT) => {
    handleToggleViewModal("EDIT");
    setDetail(detail);
  };

  const handleIncrementPageButton = () => {
    setPageNo(pageNo + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handledeleteButton = (id: number) => {
    handleToggleViewModal("DELETE");
    setDistrictID(id);
  };

  const handleGetdistricts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/getDistrict?page=${pageNo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setDistricts(res.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setDistricts(null);
      setLoading(false);
    }
  };

  const handleDeleteDistrict = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/user/deleteDistrict/${districtID}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      toast.info("District has been deleted successfully");
      handleGetdistricts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetdistricts();
  }, [pageNo]);

  useEffect(() => {
    handleSearchbar();
  }, [searchBar]);

  if (loading) return <Loading />;
  return (
    <div className="text-gray-700 px-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold">District List</h1>

        <AddButton
          label="Add District"
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
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        {districts?.map((district, index) => (
          <tbody key={district.id} className="text-center bg-white">
            <tr className="hover:bg-gray-100 transition duration-300">
              <td className="p-1 text-sm border ">{index + 1}</td>
              <td className="p-1 text-sm border ">{district.district}</td>
              <td className="p-1 text-sm border">
                <div className="flex items-center justify-center gap-2">
                  <EditButton handleUpdate={() => handleEditClick(district)} />
                  <DeleteButton
                    handleDelete={() => handledeleteButton(district.id)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      {(!districts || districts.length === 0) && (
        <span className="flex items-center justify-center border-b text-gray-700 p-2">
          No district records available at the moment!
        </span>
      )}

      <div className="flex items-center justify-between">
        <ShowData total={districts?.length} />
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
            onConfirm={handleDeleteDistrict}
            message="Are you sure you want to delete this district?"
          />
        )}

        {isOpenModal === "EDIT" && (
          <EditDistrict
            setModal={() => setIsOpenModal("")}
            detail={detail}
            handleGetdistrict={handleGetdistricts}
          />
        )}

        {isOpenModal === "ADD" && (
          <AddDistrict
            setModal={() => setIsOpenModal("")}
            handleGetdistrict={handleGetdistricts}
          />
        )}
      </div>
    </div>
  );
};
