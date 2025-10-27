import React from "react";

interface WarningIconProps {
  width?: number;
  height?: number;
  className?: string;
  fill?: string;
}

const WarningIcon: React.FC<WarningIconProps> = ({
  width = 16,
  height = 16,
  className = "",
  fill = "#E11428",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.00002 6V7.33333M8.00002 10H8.00669M3.38122 12.6667H12.6188C13.6452 12.6667 14.2867 11.5556 13.7735 10.6667L9.15472 2.66667C8.64152 1.77778 7.35852 1.77778 6.84532 2.66667L2.22652 10.6667C1.71332 11.5556 2.35482 12.6667 3.38122 12.6667Z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WarningIcon;
