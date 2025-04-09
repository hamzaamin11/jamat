import { DotLoader } from "react-spinners";

export const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] mx-auto w-full  ">
      <DotLoader size={30} color="#3B82F6" />
    </div>
  );
};
