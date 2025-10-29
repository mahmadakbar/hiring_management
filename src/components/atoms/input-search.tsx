import React from "react";
import { Input } from "./input";
import { Icon } from "@iconify/react";

type InputSearchProps = {
  searchInput: string;
  handleSearchChange: (value: string) => void;
};

export default function InputSearch({
  searchInput,
  handleSearchChange,
}: InputSearchProps) {
  return (
    <div className="flex w-full items-center">
      <Input
        type="text"
        placeholder={"Search by job details"}
        value={searchInput}
        onChange={e => handleSearchChange(e.target.value)}
        className="w-full pr-12 text-sm"
      />
      <Icon icon="mynaui:search" className="text-secondary -ml-9 text-2xl" />
    </div>
  );
}
