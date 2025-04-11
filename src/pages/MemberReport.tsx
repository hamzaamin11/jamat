// import { Search } from "../components/Search/Search";

import { Pagination } from "../components/pagination/Pagination";

import { ShowData } from "../components/ShowDataNumber/ShowData";

import { IoLocationSharp } from "react-icons/io5";

import { FaBriefcase } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import { OptionField } from "../components/Inputs/OptionField";
import { AddButton } from "../components/Buttons/AddButton";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../Contents/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { Search } from "../components/Search/Search";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loading } from "../components/NavigationLoader/Loading";
import { authFailure } from "../redux/UserSlice";
import { toast } from "react-toastify";

type MemberData = {
  id: number;
  fullName: string;
  fatherName: string;
  zone: string;
  mobileNumber: string;
  address: string;
  education: string;
  email: string;
  cnic: string;
  district: string;
  age: number;
  profession: string;
  dob: string;
};

type ZoneType = {
  id: number;
  zone: string;
};

type DistrictType = {
  id: number;
  district: string;
};
const initialState = {
  district: "",
  zone: "",
};
export const MemberReport = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const { loader } = useAppSelector((state) => state?.NavigateSate);

  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [formData, setFormData] = useState(initialState);

  const [allZones, setAllZones] = useState<ZoneType[] | null>(null);

  const [allDistricts, setAllDistricts] = useState<DistrictType[] | null>(null);

  const [memberReports, setMemberReports] = useState<MemberData[] | null>(null);

  const [searchBar, setSearchBar] = useState("");

  const [pageNo, setPageNo] = useState(1);

  const handleGetzone = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getZone`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
      setAllZones(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrementPageButton = () => {
    setPageNo(pageNo + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleGetDistrict = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/getDistrict?page=${pageNo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      setAllDistricts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchBar(e.target.value);
  };

  const handleSearchbar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/searchMember`, {
        headers: {
          Authorization: token,
        },
        params: { q: searchBar },
      });
      setMemberReports(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "(Jamat)MemberReports";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Membereports"));
    }, 1000);
  }, [pageNo]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGetMembersReports = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/membersReport?page=${pageNo}&district=${formData.district}&zone=${formData.zone}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMemberReports(res.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
      setMemberReports(null);
    }
  };

  const handlePrintForm = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/download-report`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetzone();
    handleGetDistrict();
    handleGetMembersReports();
  }, [formData.zone, formData.district, pageNo]);

  useEffect(() => {
    handleSearchbar();
  }, [searchBar]);

  if (loader) return <Loading />;

  return (
    <div className="text-gray-700 px-3 w-full">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-semibold ">Registration Members Report</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-2">
        <OptionField
          labelName="District*"
          handlerChange={handleChange}
          name="district"
          inputValue={formData.district}
          optionData={allDistricts?.map((district) => ({
            id: district?.id ?? "",
            label: district?.district ?? "",
            value: district?.district ?? "",
          }))}
          icon={<IoLocationSharp size={25} color="#DC2626" />}
          initial={"Please Select District"}
        />
        <OptionField
          labelName="Zone*"
          handlerChange={handleChange}
          name="zone"
          inputValue={formData.zone}
          optionData={allZones?.map((zone) => ({
            id: zone?.id,
            label: zone?.zone,
            value: zone?.zone,
          }))}
          icon={<FaBriefcase size={25} color="#D97706" />}
          initial={"Please Select Zone"}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className=""></div>
        <Search handleSearch={handleChangeSearch} searchData={searchBar} />
      </div>
      <table className="w-full border border-gray-300 rounded border-separate border-spacing-0 overflow-hidden">
        {/* Table Header */}
        <thead className="bg-sky-500 text-gray-700 ro">
          <tr>
            <th className="p-2 border text-white border-gray-700">Sr#</th>
            <th className="p-2 border text-white border-gray-700">Name</th>
            <th className="p-2 border text-white border-gray-700">
              Father Name
            </th>
            <th className="p-2 border text-white border-gray-700">Contact</th>
            <th className="p-2 border text-white border-gray-700">Email</th>
            <th className="p-2 border text-white border-gray-700">District</th>
            <th className="p-2 border text-white border-gray-700">Zone</th>
          </tr>
        </thead>

        {/* Table Body */}

        {memberReports?.map((member, index) => (
          <tbody className="text-center bg-white" key={member?.id}>
            <tr className="hover:bg-gray-100 transition duration-300">
              <td className="p-2 border ">{index + 1}</td>
              <td className="p-2 border">{member?.fullName}</td>
              <td className="p-2 border">{member?.fatherName}</td>
              <td className="p-2 border ">{member?.mobileNumber}</td>
              <td className="p-2 border ">{member?.email}</td>
              <td className="p-2 border">{member?.district}</td>
              <td className="p-2 border">{member?.zone}</td>
            </tr>
          </tbody>
        ))}
      </table>
      {(!memberReports || memberReports.length === 0) && (
        <span className="flex items-center justify-center border-b text-gray-700 p-2">
          No report records available at the moment!
        </span>
      )}

      <div className="flex items-center justify-between">
        <ShowData total={memberReports?.length} />
        <Pagination
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
          page={pageNo}
        />
      </div>
      <div className="flex items-center justify-center">
        <AddButton label="Print" handleClick={() => handlePrintForm()} />
      </div>
    </div>
  );
};
