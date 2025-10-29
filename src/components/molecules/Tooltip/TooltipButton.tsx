import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/atoms/tooltip";

type TooltipButtonProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export default function TooltipButton({
  trigger,
  content,
  disabled = false,
}: TooltipButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={!disabled}>{trigger}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
