import { cn } from "@utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPreviousPage: () => void;
  readonly onNextPage: () => void;
  readonly onPageClick: (page: number) => void;
  readonly className?: string;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onPageClick,
  className,
}: CustomPaginationProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Previous Button */}
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="text-font-primary flex h-[45px] w-[45px] items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Document Tabs */}
      <div className="flex gap-2">
        {/* Show first few pages */}
        {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
          const pageNumber = index + 1;
          const isActive = currentPage === pageNumber;

          return (
            <button
              key={`invoice-${pageNumber}`}
              onClick={() => onPageClick(pageNumber)}
              className={`rounded-full border px-6 py-4 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-destructive border-none text-white shadow-lg"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              Invoice {pageNumber}
            </button>
          );
        })}

        {/* Show ellipsis if there are more than 3 documents and current page is beyond visible range */}
        {totalPages > 3 && currentPage > 3 && (
          <span className="flex items-center px-2 text-gray-400">...</span>
        )}

        {/* Show current page if it's beyond the first 3 */}
        {currentPage > 3 && currentPage < totalPages && (
          <button
            onClick={() => onPageClick(currentPage)}
            className="bg-destructive rounded-full px-6 py-4 text-xs font-semibold text-white shadow-lg"
          >
            Invoice {currentPage}
          </button>
        )}

        {/* Show last page if there are more than 3 documents */}
        {totalPages > 3 && currentPage < totalPages && (
          <>
            {currentPage < totalPages - 1 && (
              <span className="flex items-center px-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageClick(totalPages)}
              className={`rounded-full px-6 py-4 text-xs font-semibold transition-all ${
                currentPage === totalPages
                  ? "bg-destructive text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              Invoice {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="text-font-primary flex h-[45px] w-[45px] items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
