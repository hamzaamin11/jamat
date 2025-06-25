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

import { ViewUserDetailModal } from "../components/MemberModals/ViewModal";

import { EditModal } from "../components/MemberModals/EditModal";

import { BASE_URL } from "../Contents/URL";

import axios, { AxiosError } from "axios";

import { useAppDispatch, useAppSelector } from "../redux/Hooks";

import { toast } from "react-toastify";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { authFailure } from "../redux/UserSlice";

type MemberT = {
  id: number;
  fullName: string;
  fatherName: string;
  district: string;
  zone: string;
  mobileNumber: string;
  address: string;
  education: string;
  email: string;
  cnic: string;
  dob: string;
  age: string;
  profession: string;
  image: string;
  memberType: string;
};

type ISOPENMODALT = "EDIT" | "DELETE" | "VIEW";

export const MemberList = () => {
  // const { loader } = useAppSelector((state) => state?.NavigateSate);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [members, setMembers] = useState<MemberT[] | null>(null);

  console.log(members);

  const [isOpenModal, setIsOpenModal] = useState<ISOPENMODALT | "">("");

  const [viewDetail, setViewDetail] = useState<MemberT | null>(null);

  const [pageNo, setPageNo] = useState(1);

  const [userId, setUSerId] = useState(Number);

  const token = currentUser?.token;

  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    document.title = "Events Tracking - JI GRW";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("MemberList"));
    }, 1000);
  }, [pageNo]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchData(e.target.value);
  };

  const handleToggleViewModal = (active: ISOPENMODALT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleViewClick = (detail: MemberT) => {
    handleToggleViewModal("VIEW");
    setViewDetail(detail);
  };

  const handleIncrementPageButton = () => {
    setPageNo(pageNo + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleEditClick = (detail: MemberT) => {
    handleToggleViewModal("EDIT");

    setViewDetail(detail);
  };

  const handleGetmembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/getMembers?page=${pageNo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setMembers(res.data);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      // toast.error(axiosError.response?.data?.message ?? "");
      setMembers(null);
      setLoading(false);
    }
  };

  const handleComfirmDeletion = (id: number) => {
    handleToggleViewModal("DELETE");
    setUSerId(id);
  };

  const handleDeleteMember = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/user/deleteMember/${userId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      toast.info("Member deleted successfully");
      handleGetmembers();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };

  const handleSearchbar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchMember`, {
        headers: {
          Authorization: token,
        },
        params: { q: searchData },
      });
      console.log(res.data);
      setMembers(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
  };
  useEffect(() => {
    handleGetmembers();
  }, [pageNo]);

  useEffect(() => {
    if (searchData) {
      handleSearchbar();
    }
  }, [searchData]);

  if (loading) return <Loading />;
  return (
    <div className="text-gray-700 px-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold">Members List</h1>
        <Link to={"/registermember"}>
          <AddButton label="Add Member" loading={loading} />
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div className=""></div>
        <Search handleSearch={handleSearch} searchData={searchData} />
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-gray-300  border-separate border-spacing-0 rounded overflow-hidden">
          {/* Table Header */}
          <thead className="bg-sky-500 text-gray-700 lg:text-sm text-xs  ">
            <tr>
              <th className="p-1.5 border text-white border-gray-700 ">Sr#</th>
              <th className="p-1.5 border text-white border-gray-700 ">Name</th>
              <th className="p-1 border text-white border-gray-700">
                Father Name
              </th>
              <th className="p-1 border text-white border-gray-700">
                Contact Number
              </th>
              <th className="p-1 border text-white border-gray-700">
                District
              </th>
              <th className="p-1 border text-white border-gray-700">Zone</th>
              <th className="p-1 border text-white border-gray-700">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}

          {members?.map((member, index) => (
            <tbody
              key={member?.id}
              className="text-center bg-white lg:text-sm text-xs "
            >
              <tr className="hover:bg-gray-100 transition duration-300">
                <td className="p-1 border ">{index + 1}</td>
                <td className="p-1 border ">{member?.fullName || "--"}</td>
                <td className="p-1 border">{member?.fatherName || "--"}</td>
                <td className="p-1 border">{member?.mobileNumber || "--"}</td>
                <td className="p-1 border">{member?.district || "--"}</td>
                <td className="p-1 border">{member?.zone || "--"}</td>
                <td className="p-1 border">
                  <div className="flex items-center justify-center gap-2">
                    <ViewButton handleView={() => handleViewClick(member)} />
                    <EditButton handleUpdate={() => handleEditClick(member)} />
                    <DeleteButton
                      handleDelete={() => handleComfirmDeletion(member?.id)}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      {(!members || members.length === 0) && (
        <span className="flex items-center justify-center border-b text-gray-700 p-2 lg:text-sm text-xs">
          No member records available at the moment!
        </span>
      )}

      <div className="flex items-center justify-between">
        <ShowData total={members?.length} />
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
            onConfirm={handleDeleteMember}
          />
        )}
        {isOpenModal === "VIEW" && (
          <ViewUserDetailModal
            setModal={() => setIsOpenModal("")}
            viewDetail={viewDetail}
          />
        )}

        {isOpenModal === "EDIT" && (
          <EditModal
            setModal={() => setIsOpenModal("")}
            viewDetail={viewDetail}
            handleGetmembers={handleGetmembers}
          />
        )}
      </div>
    </div>
  );
};
