// import loginAvatar from "../assets/Avatar.png";
import { RxHamburgerMenu } from "react-icons/rx";
import headerLogo from "../../assets/Logo.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import loginAvatar from "../../assets/Avatar.png";
import React, { useState } from "react";
import { ProfileLogOut } from "./LogOut";

export interface IHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  toggleSideBar: () => void;
}
type viewModalT = "VIEW";
export const Header = ({ isOpen, toggleSideBar }: IHeaderProps) => {
  const [viewModal, setViewModal] = useState<viewModalT | "">("");

  const handleToggleViewModal = (active: viewModalT) => {
    setViewModal((prev) => (prev === active ? "" : active));
  };

  return (
    <div className="bg-sky-500 max-w-full h-14 pt-1 px-2 relative  w-full">
      <div className="flex items-center justify-between ">
        <div className="flex gap-2 items-center ml-2 w-48  ">
          {!isOpen && (
            <div className="w-full">
              <img src={headerLogo} alt="logo" className="w-32 h-11" />
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleSideBar}
            className="p-2 rounded-full shadow-md hover:bg-gray-200 hover:text-sky-400 text-white transition-all duration-300 mt-2 flex"
          >
            {isOpen ? <RxHamburgerMenu /> : <BsThreeDotsVertical />}
          </button>
        </div>

        <div className="text-xs text-white mx-0.5 flex items-center gap-3">
          <div className="flex flex-col">
            {/* <p className="">{"Hamza Amin"}</p>
            <h4 className="">{"User"}</h4> */}
          </div>
          <img
            onClick={() => handleToggleViewModal("VIEW")}
            src={loginAvatar}
            alt="login"
            className="w-11 hover:cursor-pointer  active:scale-95 active:translate-y-1 transition duration-200"
          />
        </div>
      </div>
      {viewModal === "VIEW" && (
        <ProfileLogOut
          isOpenModal={() => handleToggleViewModal("VIEW")}
          setIsOpenModal={() => handleToggleViewModal("VIEW")}
        />
      )}
    </div>
  );
};
