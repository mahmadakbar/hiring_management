import { HandOne, HandThree, HandTwo, SuccessIcon } from "@assets/icon";
import { Button } from "@components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/atoms/dialog";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

type PopupInvoiceProps = Readonly<{
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: File | string | null) => void;
  setPreview: (preview: string | null) => void;
  withGesture?: boolean;
}>;

export default function PopupCamera({
  open = false,
  onOpenChange,
  onChange,
  setPreview,
  withGesture = false,
}: PopupInvoiceProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [open]);

  const handleFileChange = (
    file: File | null,
    onChange: (value: File | string | null) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Fallback to file input if camera access fails
      document.getElementById(`photo-upload-camera-${name}`)?.click();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    onOpenChange(false);
  };

  const capturePhoto = (onChange: (value: File | string | null) => void) => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            handleFileChange(file, onChange);
          }
        }, "image/jpeg");
      }
    }
    stopCamera();
  };

  return (
    <div className="absolute">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          hasClose
          className="h-fit bg-white p-0 md:max-w-[600px]"
          closeClassName="top-7 right-6"
        >
          <DialogHeader className="px-6 py-4">
            <DialogTitle className="text-lg font-bold">
              {withGesture ? "Raise Your Hand to Capture" : "Capture a Photo"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              {withGesture
                ? "We’ll take the photo once your hand pose is detected."
                : "Position yourself and click capture"}
            </DialogDescription>
          </DialogHeader>
          <div className="-mt-3 flex flex-col gap-3 px-6 pb-6">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <video
                ref={el => {
                  videoRef.current = el;
                  if (el && stream) {
                    el.srcObject = stream;
                    el.play();
                  }
                }}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            </div>
            {withGesture ? (
              <div className="flex flex-col justify-center gap-6">
                <p className="text-xs">
                  To take a picture, follow the hand poses in the order shown
                  below. The system will automatically capture the image once
                  the final pose is detected.
                </p>

                <div className="flex justify-center gap-4">
                  <div className="bg-secondary-foreground flex h-14 w-14 items-center justify-center">
                    <HandThree />
                  </div>
                  <Icon
                    icon="mingcute:right-line"
                    className="h-6 w-6 self-center"
                  />
                  <div className="bg-secondary-foreground flex h-14 w-14 items-center justify-center">
                    <HandTwo />
                  </div>
                  <Icon
                    icon="mingcute:right-line"
                    className="h-6 w-6 self-center"
                  />
                  <div className="bg-secondary-foreground flex h-14 w-14 items-center justify-center">
                    <HandOne />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={stopCamera}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 gap-2"
                  onClick={() => capturePhoto?.(onChange)}
                >
                  <Icon icon="mdi:camera" className="h-5 w-5" />
                  Capture
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
