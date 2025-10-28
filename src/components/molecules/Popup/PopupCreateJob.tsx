import { SuccessIcon } from "@assets/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/atoms/dialog";

type PopupCreateJobProps = Readonly<{
  title?: string;
  triggerElement?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  content?: React.ReactNode;
}>;

export default function PopupCreateJob({
  title = "Job Opening",
  triggerElement,
  open = false,
  onOpenChange,
  content,
}: PopupCreateJobProps) {
  return (
    <div className="absolute">
      <Dialog open={open} onOpenChange={onOpenChange}>
        {triggerElement && (
          <DialogTrigger className="w-full" asChild>
            {triggerElement}
          </DialogTrigger>
        )}

        <DialogContent
          hasClose={true}
          className="h-fit bg-white p-0 pb-6 md:max-w-[900px]"
        >
          <DialogHeader className="m-0 flex w-full flex-row items-center justify-between px-6 py-4 pr-12">
            <DialogTitle className="flex justify-start text-left">
              {title}
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    </div>
  );
}
