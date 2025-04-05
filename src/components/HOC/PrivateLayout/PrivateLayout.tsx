import { useState } from "react";
import { Header } from "../../../components/header/Header";
import { SideBar } from "../../../components/sidebar/SideBar";
import { Footer } from "../../Footer/Footer";

export interface IPrivateLayout extends React.ComponentPropsWithoutRef<"div"> {}
export const PrivateLayout = ({ children }: IPrivateLayout) => {
  const [isOpen, setIsopen] = useState(false);

  const toggleSideBar = () => {
    setIsopen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <Header isOpen={isOpen} toggleSideBar={toggleSideBar} />
      <div className="flex flex-col h-[calc(100%-3.5rem)] overflow-y-auto">
        <div className="flex flex-grow overflow-y-auto">
          <SideBar isOpen={isOpen} />
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};
