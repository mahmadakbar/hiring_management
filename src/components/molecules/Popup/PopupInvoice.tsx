import { SuccessIcon } from "@assets/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@components/atoms/dialog";

type PopupInvoiceProps = Readonly<{
  triggerElement?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

export default function PopupInvoice({
  triggerElement,
  open = false,
  onOpenChange,
}: PopupInvoiceProps) {
  return (
    <div className="absolute">
      <Dialog open={open} onOpenChange={onOpenChange}>
        {triggerElement && (
          <DialogTrigger className="w-full" asChild>
            {triggerElement}
          </DialogTrigger>
        )}

        <DialogContent
          hasClose={false}
          className="h-fit w-fit items-center justify-center bg-white px-20 py-10"
        >
          <div className="flex w-[320px] flex-col items-center justify-center gap-3">
            <SuccessIcon />

            <DialogTitle className="text-success mt-4 px-3 text-center text-[22px] font-bold">
              Invoice Successfully Submitted to Accurate!
            </DialogTitle>
            <DialogDescription className="text-font-secondary text-center text-sm font-medium">
              All your documents have been successfully processed and submitted.
              The hard part is over.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
