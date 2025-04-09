import { useEffect } from "react";
import { Loading } from "../components/NavigationLoader/Loading";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";

export const Dashboard = () => {
  const { loader } = useAppSelector((state) => state?.NavigateSate);
  const dispatch = useAppDispatch();
  useEffect(() => {
    document.title = "(Jamat)Dashboard";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Dashboard"));
    }, 1000);
  }, []);
  if (loader) return <Loading />;
  return <div className="px-3 text-gray-700 w-full">Dashboard</div>;
};
