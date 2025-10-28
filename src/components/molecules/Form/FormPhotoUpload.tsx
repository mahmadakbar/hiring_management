"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/atoms/form";
import { Button } from "@components/atoms/button";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { cn } from "@utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { img_avatar_placeholder } from "@assets/images";
import { PopupCamera, PopupOptionCamera } from "../Popup";

interface FormPhotoUploadProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: FieldPath<T>;
  label?: string;
  className?: string;
  classNameLabel?: string;
  fromFile?: "file" | "camera" | "both";
  withGesture?: boolean;
}

export default function FormPhotoUpload<T extends FieldValues>({
  form,
  name,
  label,
  className,
  classNameLabel,
  fromFile = "both",
  withGesture = false,
}: Readonly<FormPhotoUploadProps<T>>) {
  const [preview, setPreview] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);

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

  const handleTakePhotoClick = () => {
    if (fromFile === "both") {
      setShowDialog(true);
    } else if (fromFile === "camera") {
      // Try to use MediaDevices API, fallback to input with capture
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        setShowCameraDialog(true);
      } else {
        document.getElementById(`photo-upload-camera-${name}`)?.click();
      }
    } else {
      document.getElementById(`photo-upload-file-${name}`)?.click();
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem className={cn("flex flex-col gap-2", className)}>
          {label && (
            <FormLabel
              className={cn(
                "text-sm font-medium text-gray-700",
                classNameLabel
              )}
            >
              {label}
            </FormLabel>
          )}
          <div className="flex flex-col gap-3">
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
              <Image
                src={
                  preview ||
                  (typeof value === "string" ? value : undefined) ||
                  img_avatar_placeholder
                }
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <FormControl>
              <div>
                {/* Hidden input for camera capture */}
                {(fromFile === "both" || fromFile === "camera") && (
                  <input
                    id={`photo-upload-camera-${name}`}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    capture="environment"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(file, onChange);
                      e.target.value = "";
                    }}
                    {...fieldProps}
                  />
                )}
                {/* Hidden input for file gallery */}
                {(fromFile === "both" || fromFile === "file") && (
                  <input
                    id={`photo-upload-file-${name}`}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(file, onChange);
                      e.target.value = "";
                    }}
                    {...fieldProps}
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit gap-2 bg-white font-bold"
                  onClick={handleTakePhotoClick}
                >
                  <Icon
                    icon="material-symbols:upload-rounded"
                    className="h-4 w-4"
                  />
                  Take a Picture
                </Button>
              </div>
            </FormControl>
          </div>
          <FormMessage />

          {/* Dialog for "both" option */}
          <PopupOptionCamera
            name={name}
            open={showDialog}
            onOpenChange={setShowDialog}
            startCamera={() => setShowCameraDialog(true)}
          />

          {/* Camera Dialog */}
          <PopupCamera
            open={showCameraDialog}
            onOpenChange={setShowCameraDialog}
            onChange={onChange}
            setPreview={setPreview}
            withGesture={withGesture}
          />
        </FormItem>
      )}
    />
  );
}
