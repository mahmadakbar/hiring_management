"use client";

import { StarIcon, UploadIcon, InvoiceIcon, TrashIcon } from "@assets/icon";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/atoms/form";
import { Input } from "@components/atoms/input";
import { Button } from "@components/atoms/button";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { useState, useCallback } from "react";
import { getFileTypeColor } from "@utils";

interface FormUploadProps<T extends FieldValues> {
  readonly control: Control<T>;
  readonly data: File[];
  readonly name: FieldPath<T>;
}

export default function FormUpload<T extends FieldValues>({
  control,
  data,
  name,
}: FormUploadProps<T>) {
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRemoveFile = (
    index: number,
    onChange: (files: File[]) => void
  ) => {
    const updatedFiles = data.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const handleFileSelect = useCallback(
    (files: FileList | null, onChange: (files: File[]) => void) => {
      if (!files) return;

      const newFiles = Array.from(files);
      const existingFiles = data || [];
      const combinedFiles = [...existingFiles, ...newFiles];
      onChange(combinedFiles);
    },
    [data]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, onChange: (files: File[]) => void) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      handleFileSelect(files, onChange);
    },
    [handleFileSelect]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value: _value, onChange, ...fieldProps } }) => (
        <FormItem className="flex w-[480px] flex-col gap-4 rounded-[30px] bg-white p-4">
          <button
            type="button"
            className={`border-border-grey flex cursor-pointer flex-col gap-4 rounded-[20px] border border-dashed p-4 transition-colors hover:bg-gray-50 focus:ring-blue-500 focus:outline-none ${
              isDragOver ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, onChange)}
          >
            <FormLabel className="cursor-pointer">
              <div className="flex w-full flex-row items-center gap-2">
                <StarIcon />
                <p className="text-font-hilight text-base font-normal">
                  Upload Required Documents
                </p>
              </div>
            </FormLabel>
            <FormControl>
              <Input
                id="file-input"
                className="pointer-events-none absolute w-full cursor-pointer border bg-transparent px-0 text-center text-sm font-medium opacity-0 outline-none file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-600 focus:ring-0"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={e => {
                  handleFileSelect(e.target.files, onChange);
                  // Reset the input to allow selecting the same file again if needed
                  e.target.value = "";
                }}
                {...fieldProps}
              />
            </FormControl>
            <div className="flex w-full flex-col items-center justify-center py-6">
              <UploadIcon />
            </div>
            <div>
              <p className="text-font-primary text-center text-xl font-semibold">
                Drag and drop your files here
              </p>
              <p className="text-font-hilight text-center text-sm">
                Or click to browse files (multiple files supported)
              </p>
            </div>
          </button>

          {data && data.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-font-primary text-sm font-medium">
                Uploaded Files ({data.length})
              </h4>
              <div className="max-h-40 space-y-2 overflow-x-hidden overflow-y-auto">
                {data.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex w-full items-center"
                  >
                    <div className="bg-secondary flex min-w-0 flex-1 items-center rounded-lg p-1">
                      <div className="mr-2 h-full shrink-0 rounded-[7px] bg-white p-1">
                        <InvoiceIcon
                          width={24}
                          height={30}
                          fill={getFileTypeColor(file.name)}
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="text-font-primary truncate text-sm font-semibold">
                          {file.name}
                        </p>
                        <p className="text-font-hilight text-xs">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-8 w-8 shrink-0 p-0 text-red-500 hover:bg-transparent hover:text-red-700"
                      onClick={() => handleRemoveFile(index, onChange)}
                    >
                      <TrashIcon className="h-6 w-6" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
