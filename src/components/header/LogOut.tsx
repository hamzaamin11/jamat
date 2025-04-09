import { useEffect, useRef } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { logOut, resetStore } from "../../redux/UserSlice";

export const ProfileLogOut = ({
  setIsOpenModal,
}: {
  isOpenModal: () => void;
  setIsOpenModal: (value: string) => void;
}) => {
  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((state) => state.officeState);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(""); // Close modal when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsOpenModal(""); // Close dropdown on click
  };
  const handleLogoutUser = () => {
    setIsOpenModal("");
    dispatch(logOut());
    dispatch(resetStore());
  };
  return (
    <div ref={dropdownRef} className="relative z-20">
      <ul className="absolute right-0 mt-2 w-52 rounded-lg bg-white shadow-lg border border-gray-200">
        <li className="border-b border-gray-200">
          <span
            onClick={handleClose} // Close dropdown on click
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800 hover:cursor-pointer"
          >
            <FiUser className="text-gray-700" /> {currentUser?.name}
          </span>
        </li>

        <li>
          <div
            onClick={handleLogoutUser} // Close dropdown on click
            className="flex items-center gap-3 px-4 py-2 hover:bg-red-100 text-red-600 font-semibold hover:cursor-pointer"
          >
            <FiLogOut className="text-red-500" /> Log Out
          </div>
        </li>
      </ul>
    </div>
  );
};
