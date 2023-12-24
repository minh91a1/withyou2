import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Props {
  onChangePage: (delta: number) => void;
  onSelectChanged: (page: string) => void;
  page: number;
  totalPage: number;
}

export const Navigation = ({
  page,
  totalPage,
  onChangePage,
  onSelectChanged,
}: Props) => {
  const pages = Array.from({ length: totalPage }, (_, i) => i);

  return (
    <div className="flex space-x-2">
      <Button
        disabled={page === 0}
        onClick={() => {
          onChangePage(-1);
        }}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <Select onValueChange={onSelectChanged} value={`${page}`}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={page} />
        </SelectTrigger>
        <SelectContent>
          {pages.map((p) => (
            <SelectItem key={`key-${p}`} value={`${p}`}>
              {`${p}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          onChangePage(1);
        }}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
