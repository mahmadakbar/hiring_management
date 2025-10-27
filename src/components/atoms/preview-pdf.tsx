"use client";

import { useState, useEffect } from "react";

interface PreviewPdfProps {
  readonly file: File;
  readonly className?: string;
  readonly height?: string;
}

export default function PreviewPdf({
  file,
  className = "",
  height = "h-[calc(100vh-200px)]",
}: PreviewPdfProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Create object URL for the PDF
  useEffect(() => {
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [file]);

  const isPdfFile = file?.type === "application/pdf";

  if (!isPdfFile) {
    return (
      <div
        className={`bg-card flex items-center justify-center rounded-lg border p-8 text-center ${height} ${className}`}
      >
        <div>
          <p className="text-lg font-medium">File Preview Not Available</p>
          <p className="text-muted-foreground text-sm">
            Only PDF files can be previewed. This file is: {file?.type}
          </p>
          <a
            href={URL.createObjectURL(file)}
            download={file.name}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-block rounded-md px-4 py-2 text-sm"
          >
            Download File
          </a>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div
        className={`bg-card flex items-center justify-center rounded-lg border p-8 text-center ${height} ${className}`}
      >
        <p className="text-muted-foreground">Loading PDF...</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${height} ${className}`}>
      <object data={pdfUrl} type="application/pdf" className="h-full w-full">
        {/* Fallback for browsers that don't support object tag */}
        <iframe
          src={pdfUrl}
          className="h-full w-full rounded-lg border"
          title={`PDF Preview - ${file.name}`}
        >
          <div className="bg-card flex h-full items-center justify-center rounded-lg border p-8 text-center">
            <div>
              <p className="mb-4 text-lg font-medium">
                PDF Preview Not Available
              </p>
              <p className="text-muted-foreground text-sm">
                Your browser doesn&apos;t support embedded PDF viewing.
              </p>
              <a
                href={pdfUrl}
                download={file.name}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-block rounded-md px-4 py-2 text-sm"
              >
                Download PDF
              </a>
            </div>
          </div>
        </iframe>
      </object>
    </div>
  );
}
