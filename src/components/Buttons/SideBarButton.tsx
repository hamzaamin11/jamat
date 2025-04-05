import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type SideBarButtonProps = {
  title: string;
  icon: React.ReactNode;
  arrowIcon?: React.ReactNode;
  isOpen: boolean;
  handlerClick: () => void;
  activeBtn: string;
  activeBtns: string;
};

export const SideBarButton = ({
  title,
  icon,
  activeBtn,
  isOpen,
  handlerClick,
  arrowIcon,
  activeBtns,
}: SideBarButtonProps) => {
  return (
    <div>
      <div
        onClick={handlerClick}
        className={`flex items-center ${
          isOpen && "justify-center "
        } gap-2 p-2  rounded cursor-pointer text-gray-900 hover:bg-sky-600 hover:text-white transition border-b m-1 ${
          activeBtns === activeBtn && "bg-sky-500 text-white"
        } `}
      >
        <span>{icon}</span>
        {isOpen ? "" : <span className="w-24 text-xs">{title}</span>}
        {!isOpen && arrowIcon && (
          <span className="">
            {activeBtns === activeBtn ? (
              <FaChevronUp size={10} />
            ) : (
              <FaChevronDown size={10} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};
