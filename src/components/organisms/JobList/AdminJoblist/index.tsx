import { NotFoundData } from "@components/templates/NotFoundTemplate";
import React from "react";
import { Icon } from "@iconify/react";
import { Input } from "@components/atoms/input";

export default function AdminJoblist() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full items-center">
        <Input
          type="text"
          placeholder={"Search by job details"}
          // onChange={e => handleSearchChange(e.target.value)}
          className="w-full pr-12 text-sm"
        />
        <Icon icon="mynaui:search" className="text-secondary -ml-9 text-2xl" />
      </div>

      <NotFoundData />
    </div>
  );
}
