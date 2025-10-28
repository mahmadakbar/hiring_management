import React from "react";

const KeyIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  className = "",
  fill = "#111827",
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
        d="M2 5.33398L7.2604 8.84092C7.70827 9.13949 8.29173 9.13949 8.7396 8.84092L14 5.33398M3.33333 12.6673H12.6667C13.403 12.6673 14 12.0704 14 11.334V4.66732C14 3.93094 13.403 3.33398 12.6667 3.33398H3.33333C2.59695 3.33398 2 3.93094 2 4.66732V11.334C2 12.0704 2.59695 12.6673 3.33333 12.6673Z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default KeyIcon;
