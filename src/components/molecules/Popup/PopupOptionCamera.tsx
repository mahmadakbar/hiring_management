import { SuccessIcon } from "@assets/icon";
import { Button } from "@components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/atoms/dialog";
import { Icon } from "@iconify/react";

type PopupOptionCameraProps = Readonly<{
  name: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  startCamera: () => void;
}>;

export default function PopupOptionCamera({
  name,
  open = false,
  onOpenChange,
  startCamera,
}: PopupOptionCameraProps) {
  const handleDialogOptionClick = (option: "camera" | "file") => {
    onOpenChange?.(false);
    if (option === "camera") {
      // Try to use MediaDevices API, fallback to input with capture
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        startCamera();
      } else {
        document.getElementById(`photo-upload-camera-${name}`)?.click();
      }
    } else {
      document.getElementById(`photo-upload-file-${name}`)?.click();
    }
  };
  return (
    <div className="absolute">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Photo Source</DialogTitle>
            <DialogDescription>
              Select how you want to add your photo
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleDialogOptionClick("camera")}
            >
              <Icon icon="mdi:camera" className="h-5 w-5" />
              Take Photo with Camera
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleDialogOptionClick("file")}
            >
              <Icon icon="mdi:folder-image" className="h-5 w-5" />
              Choose from Gallery
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
