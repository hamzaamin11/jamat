import React from "react";

type AccordionItemProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

export const AccordionItem = ({ children, isOpen }: AccordionItemProps) => {
  return (
    <div className="text-xs text-black  w-full mx-2  ">
      <ul className="">
        <li className="">{!isOpen && children}</li>
      </ul>
    </div>
  );
};
