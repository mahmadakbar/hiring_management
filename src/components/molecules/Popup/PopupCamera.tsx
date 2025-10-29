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
import { handGestureDetector } from "@/lib/handGestureDetection";
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
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Hand gesture verification states
  const [isGestureInitialized, setIsGestureInitialized] = useState(false);
  const [verificationStep, setVerificationStep] = useState<0 | 1 | 2 | 3>(0); // 0: waiting, 1: 3 fingers, 2: 2 fingers, 3: 1 finger
  const [detectedFingers, setDetectedFingers] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      handGestureDetector.cleanup();
    };
  }, [stream]);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      // Cleanup everything when modal closes
      stopCamera();
      resetGestureVerification();
      // Force cleanup of gesture detector
      handGestureDetector.cleanup();
    }
  }, [open]);

  // Initialize gesture detection when video is ready
  useEffect(() => {
    if (open && withGesture && isVideoReady && !isGestureInitialized) {
      console.log("📹 Video ready, initializing gesture detection");
      initializeGestureDetection();
    }
  }, [open, withGesture, isVideoReady, isGestureInitialized]);

  const initializeGestureDetection = async () => {
    console.log("🚀 Starting gesture detection initialization");

    // Ensure clean state before initializing
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const initialized = await handGestureDetector.initialize();
    console.log("📊 Gesture detector initialized:", initialized);
    setIsGestureInitialized(initialized);
    if (initialized) {
      console.log("✅ Starting verification at step 1 (3 fingers)");
      setVerificationStep(1); // Start with 3 fingers
      startGestureDetection();
    } else {
      console.error("❌ Failed to initialize gesture detection");
    }
  };

  const resetGestureVerification = () => {
    console.log("🔄 Resetting gesture verification");

    // Clear animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clear countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Reset all gesture states
    setVerificationStep(0);
    setDetectedFingers(null);
    setCountdown(null);
    setIsCapturing(false);
    setIsGestureInitialized(false);
    setIsVideoReady(false);

    console.log("✅ Gesture verification reset complete");
  };

  const startGestureDetection = () => {
    console.log("🎬 Starting gesture detection loop");

    const detectFrame = () => {
      if (!videoRef.current || !withGesture || isCapturing) {
        console.log("⏸️ Detection paused:", {
          hasVideo: !!videoRef.current,
          withGesture,
          isCapturing,
        });
        return;
      }

      // Additional check for video readiness
      if (videoRef.current.readyState < 2) {
        console.warn(
          "⚠️ Video not ready in detection loop, readyState:",
          videoRef.current.readyState
        );
        animationFrameRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      const result = handGestureDetector.detectGesture(videoRef.current);
      const fingerCount = handGestureDetector.countFingers(result);

      setDetectedFingers(fingerCount);

      // Advanced verification logic - check exact finger combinations
      if (verificationStep === 1) {
        // Step 1: ONLY Index, Middle, Ring (no thumb, no pinky)
        const isValid = handGestureDetector.validateFingerCombination(
          result,
          1
        );
        if (isValid) {
          console.log(
            "✅ Step 1 PASSED: Index+Middle+Ring detected correctly!"
          );
          setVerificationStep(2);
        }
      } else if (verificationStep === 2) {
        // Step 2: ONLY Index, Middle (no thumb, no ring, no pinky)
        const isValid = handGestureDetector.validateFingerCombination(
          result,
          2
        );
        if (isValid) {
          console.log("✅ Step 2 PASSED: Index+Middle detected correctly!");
          setVerificationStep(3);
        }
      } else if (verificationStep === 3) {
        // Step 3: ONLY Index (no other fingers)
        const isValid = handGestureDetector.validateFingerCombination(
          result,
          3
        );
        if (isValid) {
          console.log("✅ Step 3 PASSED: Index only detected correctly!");
          startCountdown();
          return; // Stop detection loop
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectFrame);
    };

    animationFrameRef.current = requestAnimationFrame(detectFrame);
  };

  // Re-run detection when verification step changes
  useEffect(() => {
    if (
      withGesture &&
      isGestureInitialized &&
      !isCapturing &&
      verificationStep > 0 &&
      verificationStep < 4
    ) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startGestureDetection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationStep, isGestureInitialized, withGesture, isCapturing]);

  const startCountdown = () => {
    console.log("⏱️ Starting 3-second countdown");
    setIsCapturing(true);
    setCountdown(3);

    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      console.log("⏱️ Countdown:", count);
      setCountdown(count);

      if (count === 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        console.log("📸 Capturing photo now!");
        capturePhoto(onChange);
      }
    }, 1000);
  };

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
      console.log("📷 Starting camera...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      console.log("✅ Camera stream obtained");
      setStream(mediaStream);
    } catch (error) {
      console.error("❌ Error accessing camera:", error);
      // Fallback to file input if camera access fails
      document.getElementById(`photo-upload-camera-${name}`)?.click();
    }
  };

  const stopCamera = () => {
    console.log("🛑 Stopping camera and cleaning up...");

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("🎥 Camera track stopped");
      });
      setStream(null);
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Reset all states
    resetGestureVerification();

    // Cleanup gesture detector
    handGestureDetector.cleanup();

    onOpenChange(false);
    console.log("✅ Camera stopped and cleanup completed");
  };

  const capturePhoto = (onChange: (value: File | string | null) => void) => {
    console.log("📸 Capturing photo from video");
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      console.log("📐 Canvas dimensions:", canvas.width, "x", canvas.height);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            console.log(
              "✅ Photo captured successfully:",
              file.name,
              file.size,
              "bytes"
            );
            handleFileChange(file, onChange);
          }
        }, "image/jpeg");
      }
    }
    stopCamera();
  };

  const handleVideoLoadedData = () => {
    if (videoRef.current) {
      console.log("✅ Video loaded and ready");
      console.log(
        "📐 Video dimensions:",
        videoRef.current.videoWidth,
        "x",
        videoRef.current.videoHeight
      );
      console.log("📊 Video readyState:", videoRef.current.readyState);
      setIsVideoReady(true);
    }
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
          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute z-40 flex h-full w-full items-center justify-center gap-2 rounded-lg bg-black/20 p-4">
              <p className="text-5xl font-bold text-white">{countdown}</p>
            </div>
          )}
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
                onLoadedData={handleVideoLoadedData}
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

                {/* Gesture verification steps */}
                <div className="flex justify-center gap-4">
                  {/* Step 1: Three fingers */}
                  <div
                    className={`flex flex-col items-center gap-2 transition-all ${
                      verificationStep === 1
                        ? "scale-110 rounded-lg ring-4 ring-blue-500"
                        : verificationStep > 1
                          ? "opacity-50"
                          : "opacity-30"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center transition-colors ${
                        verificationStep === 1
                          ? "bg-blue-500"
                          : verificationStep > 1
                            ? "bg-green-500"
                            : "bg-secondary-foreground"
                      }`}
                    >
                      <HandThree />
                    </div>
                    {verificationStep > 1 && (
                      <Icon
                        icon="mdi:check-circle"
                        className="h-6 w-6 text-green-500"
                      />
                    )}
                  </div>

                  <Icon
                    icon="mingcute:right-line"
                    className="h-6 w-6 self-center"
                  />

                  {/* Step 2: Two fingers */}
                  <div
                    className={`flex flex-col items-center gap-2 transition-all ${
                      verificationStep === 2
                        ? "scale-110 rounded-lg ring-4 ring-blue-500"
                        : verificationStep > 2
                          ? "opacity-50"
                          : "opacity-30"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center transition-colors ${
                        verificationStep === 2
                          ? "bg-blue-500"
                          : verificationStep > 2
                            ? "bg-green-500"
                            : "bg-secondary-foreground"
                      }`}
                    >
                      <HandTwo />
                    </div>
                    {verificationStep > 2 && (
                      <Icon
                        icon="mdi:check-circle"
                        className="h-6 w-6 text-green-500"
                      />
                    )}
                  </div>

                  <Icon
                    icon="mingcute:right-line"
                    className="h-6 w-6 self-center"
                  />

                  {/* Step 3: One finger */}
                  <div
                    className={`flex flex-col items-center gap-2 transition-all ${
                      verificationStep === 3
                        ? "scale-110 rounded-lg ring-4 ring-blue-500"
                        : verificationStep > 3
                          ? "opacity-50"
                          : "opacity-30"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center transition-colors ${
                        verificationStep === 3
                          ? "bg-blue-500"
                          : verificationStep > 3
                            ? "bg-green-500"
                            : "bg-secondary-foreground"
                      }`}
                    >
                      <HandOne />
                    </div>
                    {verificationStep > 3 && (
                      <Icon
                        icon="mdi:check-circle"
                        className="h-6 w-6 text-green-500"
                      />
                    )}
                  </div>
                </div>

                {/* Real-time feedback */}
                {!isCapturing && detectedFingers !== null && (
                  <div className="text-center">
                    {/* <p className="text-sm font-medium">
                      Detected: {detectedFingers} finger
                      {detectedFingers !== 1 ? "s" : ""}
                    </p> */}
                    {verificationStep === 1 && (
                      <p className="text-xs text-gray-500">
                        Show <strong>Index + Middle + Ring</strong> fingers only
                        (not thumb or pinky)
                      </p>
                    )}
                    {verificationStep === 2 && (
                      <p className="text-xs text-gray-500">
                        Show <strong>Index + Middle</strong> fingers only
                      </p>
                    )}
                    {verificationStep === 3 && (
                      <p className="text-xs text-gray-500">
                        Show <strong>Index</strong> finger only (pointing up ☝️)
                      </p>
                    )}
                  </div>
                )}

                {/* Initialization status */}
                {!isGestureInitialized && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {!isVideoReady
                        ? "Waiting for camera to be ready..."
                        : "Initializing hand detection..."}
                    </p>
                  </div>
                )}
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
