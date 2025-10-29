import React from "react";
import { Checkbox } from "@components/atoms/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/atoms/table";

export interface Applicant {
  id: number | string;
  [key: string]: any; // Allow dynamic properties
}

export interface ColumnConfig<T = any> {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface ApplicantsTableProps<T extends Applicant = Applicant> {
  data: T[];
  columns: ColumnConfig<T>[];
  selectable?: boolean;
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: number | string, checked: boolean) => void;
  selectedRows?: Set<number | string>;
  onRowClick?: (row: T) => void;
}

export default function ApplicantsTable<T extends Applicant = Applicant>({
  data,
  columns,
  selectable = true,
  onSelectAll,
  onSelectRow,
  selectedRows = new Set(),
  onRowClick,
}: ApplicantsTableProps<T>) {
  const allSelected =
    data.length > 0 && data.every(row => selectedRows.has(row.id));

  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] caption-bottom text-sm">
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="bg-background sticky left-0 z-20 w-[50px] pl-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    onCheckedChange={checked =>
                      onSelectAll?.(checked as boolean)
                    }
                    className="border-secondary rounded-sm"
                  />
                </TableHead>
              )}
              {columns.map((column, index) => (
                <TableHead
                  key={column.key}
                  className={`${column.className || ""} ${index === 0 ? "bg-background sticky left-[50px] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" : ""}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(row => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "hover:bg-muted/50 cursor-pointer" : ""}
              >
                {selectable && (
                  <TableCell
                    className="bg-background sticky left-0 z-10 pl-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                    onClick={e => e.stopPropagation()}
                  >
                    <Checkbox
                      size="small"
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={checked =>
                        onSelectRow?.(row.id, checked as boolean)
                      }
                      className="border-secondary rounded-sm"
                    />
                  </TableCell>
                )}
                {columns.map((column, index) => (
                  <TableCell
                    key={`${row.id}-${column.key}`}
                    className={`py-4 ${index === 0 ? "bg-background sticky left-[50px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" : ""}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
