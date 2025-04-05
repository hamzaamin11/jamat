import {  FadeLoader } from "react-spinners";

export const Loading = () => {
  return (
    <div>
      <div className="flex justify-center items-center min-h-[80vh] mx-auto ">
        <FadeLoader
          color="#3B82F6"
          height={25}
          radius={2}
          speedMultiplier={1.2}
          cssOverride={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
          }}
        />
      </div>
    </div>
  );
};
