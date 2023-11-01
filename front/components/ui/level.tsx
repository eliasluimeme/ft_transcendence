import React, { ReactNode } from "react";
import "@/components/ui/CSS/font.css"

interface SwitchlevelProps {
  active: boolean;
  selectTab: () => void;
  children: ReactNode;
  className?:string;
}

const Level: React.FC<SwitchlevelProps> = ({
  active,
  selectTab,
  children,
  className,
}) => {
  const buttonClasses: string = active
    ? "blue_font"
    : "text-[#ADB7BE]";
  return (
    <button onClick={selectTab} className={className}>
      <p className={`hover:text-white  ${buttonClasses}`}>{children}</p>
    </button>
  );
};

export default Level;
