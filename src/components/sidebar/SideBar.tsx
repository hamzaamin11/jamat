import { AccordionItem } from "../Buttons/Accordion/AccordionItem";
import { SideBarButton } from "../../components/Buttons/SideBarButton";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineDashboard, MdOutlineEventAvailable } from "react-icons/md";
type SideBarProps = {
  isOpen: boolean;
};
type TActivButton =
  | "Dashboard"
  | "Members"
  | "Events"
  | "configuration"
  | "Reports";
export const SideBar = ({ isOpen }: SideBarProps) => {
  const [activeBtns, setActiveBtns] = useState<TActivButton | "">("");

  const navigate = useNavigate();

  console.log(activeBtns);

  const { pathname } = useLocation();
  console.log(pathname);

  const toggleButtonActive = (activeBtn: TActivButton) => {
    setActiveBtns((prev) => (prev === activeBtn ? "" : activeBtn));
  };

  useEffect(() => {
    if (!isOpen) setActiveBtns("");
    setActiveBtns("Dashboard");
    navigate("/");
  }, [isOpen]);

  return (
    <div
      className={`${
        isOpen ? "w-16" : "w-52"
      } bg-white overflow-y-auto transition-all duration-300 ease-in-out flex flex-col items-center py-4 shadow-lg 
     `}
    >
      {!isOpen ? (
        <Link
          to={"/"}
          onClick={() => setActiveBtns("Dashboard")}
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer text-gray-700  hover:bg-sky-600 hover:text-white transition border-b m-1  w-40 ${
            activeBtns === "Dashboard" && "bg-sky-500 text-white"
          } `}
        >
          <MdOutlineDashboard size={20} />
          <p className="text-xs">Dashboard</p>
        </Link>
      ) : (
        <div
          className={`flex items-center ${
            isOpen && "justify-between "
          } gap-2 p-2  rounded cursor-pointer hover:bg-sky-500 border-b  transition m-1  text-gray-800 hover:text-white  `}
        >
          <MdOutlineDashboard size={20} />
        </div>
      )}
      <SideBarButton
        isOpen={isOpen}
        icon={<FaUserFriends size={20} />}
        title={"Members"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Members")}
        activeBtns={activeBtns}
        activeBtn="Members"
      />
      <div className="">
        {activeBtns === "Members" && (
          <AccordionItem isOpen={isOpen}>
            <div className="flex flex-col items-start justify-start">
              <Link
                className={`my-button ${
                  pathname === "/registermember" && "bg-sky-200"
                }`}
                to={"/registermember"}
              >
                Register Member
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/memberlist" && "bg-sky-200"
                }`}
                to={"/memberlist"}
              >
                Member List
              </Link>
            </div>
          </AccordionItem>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<MdOutlineEventAvailable size={20} />}
        title={"Events"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Events")}
        activeBtns={activeBtns}
        activeBtn="Events"
      />
      <div>
        {activeBtns === "Events" && (
          <div
            className={`transition-all ease-in-out duration-500 ${
              activeBtns === "Events"
                ? "translate-y-0 opacity-100 duration-500 transition-all ease-in-out"
                : "-translate-y-5 opacity-0"
            }`}
          >
            <AccordionItem isOpen={isOpen}>
              <ul className="flex flex-col ">
                <Link
                  className={`my-button ${
                    pathname === "/addevent" && "bg-sky-200"
                  }`}
                  to={"/addevent"}
                >
                  Add Event
                </Link>
                <Link
                  className={`my-button ${
                    pathname === "/eventlist" && "bg-sky-200"
                  }`}
                  to={"/eventlist"}
                >
                  Event List
                </Link>
                <Link
                  className={`my-button ${
                    pathname === "/startevent" && "bg-sky-200"
                  }`}
                  to={"/startevent"}
                >
                  Start Event
                </Link>
              </ul>
            </AccordionItem>
          </div>
        )}
      </div>
      <SideBarButton
        isOpen={isOpen}
        icon={<HiOutlineDocumentReport size={20} />}
        title={"Reports"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("Reports")}
        activeBtns={activeBtns}
        activeBtn="Reports"
      />
      <div
        className={`${
          activeBtns === "Reports" && "transition-all duration-300 ease-in-out"
        }`}
      >
        {activeBtns === "Reports" && (
          <AccordionItem isOpen={isOpen}>
            <ul
              className={`flex flex-col list-disc  ${
                activeBtns === "Reports"
              } && "transition-all duration-300  ease-in-out"`}
            >
              <Link
                className={`my-button ${
                  pathname === "/registrationReport" && "bg-sky-200"
                }`}
                to={"/registrationReport"}
              >
                Registration Member Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/progressReport" && "bg-sky-200"
                }`}
                to={"/eventReport"}
              >
                Events Report
              </Link>
              <Link
                className={`my-button ${
                  pathname === "/attendanceReports" && "bg-sky-200"
                }`}
                to={"/presentReports"}
              >
                Individual Present Report
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>

      <SideBarButton
        isOpen={isOpen}
        icon={<AiOutlineFieldTime size={20} />}
        title={"Configurations"}
        arrowIcon={<BiArrowBack />}
        handlerClick={() => toggleButtonActive("configuration")}
        activeBtns={activeBtns}
        activeBtn="configuration"
      />
      <div>
        {activeBtns === "configuration" && (
          <AccordionItem isOpen={isOpen}>
            <ul className="flex flex-col ">
              <Link
                className={`my-button ${
                  pathname === "/configuration" && "bg-sky-200"
                }`}
                to={"/configuration"}
              >
                District
              </Link>
              <Link
                className={`my-button ${pathname === "/zone" && "bg-sky-200"}`}
                to={"/zone"}
              >
                Zone
              </Link>
            </ul>
          </AccordionItem>
        )}
      </div>
    </div>
  );
};
