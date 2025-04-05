import axios, { AxiosError } from "axios";

import jamat from "../assets/jamat.png";

import { useAppDispatch, useAppSelector } from "../redux/Hooks";

import setAuthToken from "../SetAuthToken";

import { Navigate } from "react-router-dom";
;
import { toast } from "react-toastify";

import { InputField } from "../components/Inputs/InputField";

import { useEffect, useState } from "react";

import { MdOutlineMail } from "react-icons/md";

import { FaUserLock } from "react-icons/fa";

import { authFailure, authSuccess } from "../redux/UserSlice";

import { BASE_URL } from "../Contents/URL";

import { ClipLoader } from "react-spinners";

import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";

import { Loading } from "../components/NavigationLoader/Loading";

const initialState = {
  email: "",
  password: "",
};
export const Login = () => {
  const { currentUser, error } = useAppSelector((state) => state?.officeState);
  const { loader } = useAppSelector((state) => state?.NavigateSate);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "(Jamat)Login";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("login"));
    }, 1000);
  }, []);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, formData);
      const { token } = res.data;
      setAuthToken(token);
      dispatch(authSuccess(res.data));
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
    setLoading(false);
    setFormData(initialState);
  };
  if (currentUser) return <Navigate to={"/"} />;
  if (loader) return <Loading />;
  return (
    <div>
      <div className=" bg-sky-500 min-h-80 flex items-center justify-between  ">
        <div className="p-8 pl-12">
          <h1 className="text-5xl text-white">
            Welcome To Event Management Portal
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="shadow bg-white p-6 h-96 w-[28rem] absolute right-24 top-52 rounded-lg text-gray-700  "
        >
          <h2 className="text-2xl font-serif ">Welcome Back</h2>
          <h1 className="text-5xl font-serif text-gray-800 pb-2">Login now</h1>
          <div className="space-y-3 ">
            <InputField
              fieldType="email"
              labelName="Enter your Email"
              placeHolder="Abc@gmail.com..."
              name={"email"}
              handleChange={handlerChange}
              inputValue={formData.email}
              icon={<MdOutlineMail size={25} color="#1E90FF" />}
            />
            <InputField
              fieldType="password"
              labelName="Enter your Password"
              placeHolder="Password..."
              name={"password"}
              handleChange={handlerChange}
              inputValue={formData.password}
              icon={<FaUserLock size={25} color="black" />}
            />
          </div>
          <button
            disabled={loading}
            className="w-full font-serif border rounded-md p-2 bg-sky-500 text-white cursor-pointer mt-4 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span>Logging in...</span>
                <ClipLoader size={18} color="white" />
              </div>
            ) : (
              "Log In"
            )}
          </button>
          {error && (
            <p className="text-xs text-red-500 text-center pt-3">{error}</p>
          )}
        </form>
      </div>
      <img src={jamat} alt="office Team" className="h-[24rem] pl-20" />
    </div>
  );
};
