"use client";

import { useEffect } from "react";
import useStoreDocument from "@stores/documentStore";
import PreviewPdf from "@components/atoms/preview-pdf";
import CustomPagination from "@components/atoms/custom-pagination";
import FormInformationPDF from "@components/organisms/FormInformationPDF";

export default function PreviewPdfTemplate() {
  const { documents, currentPage, setCurrentPage } = useStoreDocument();

  const totalPages = documents.length;

  // Prevent page scrolling
  useEffect(() => {
    // Add overflow hidden to body and html
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (event.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentPage, totalPages, setCurrentPage]);

  if (documents.length === 0) {
    return (
      <div className="flex min-h-full w-full flex-col items-center justify-center p-4">
        <p className="text-muted-foreground">No documents to preview.</p>
      </div>
    );
  }

  const currentDocument = documents[currentPage - 1];

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden p-4">
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onPageClick={handlePageClick}
      />

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* PDF Preview - Left Half */}
        <div className="flex w-1/2 flex-col">
          <div className="flex-1 overflow-hidden rounded-3xl bg-black p-2">
            <PreviewPdf file={currentDocument} height="h-[calc(100vh-190px)]" />
          </div>
        </div>

        {/* Text Content - Right Half */}
        <FormInformationPDF />
      </div>
    </div>
  );
}
