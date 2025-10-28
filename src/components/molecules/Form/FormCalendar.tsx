import { Button } from "@components/atoms/button";
import { Calendar } from "@components/atoms/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/atoms/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/atoms/popover";
import { Icon } from "@iconify/react";
import { cn } from "@utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormCalendarProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  classNameLabel?: string;
  dateFormat?: string;
  fromDate?: Date;
  toDate?: Date;
  mode?: "single" | "multiple" | "range";
  startYear?: number;
  endYear?: number;
  showMonthYearDropdowns?: boolean;
}

export default function FormCalendar<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Select date",
  disabled = false,
  className,
  classNameLabel,
  dateFormat = "PPP",
  fromDate,
  toDate,
  mode = "single",
  startYear = 1900,
  endYear = 2100,
  showMonthYearDropdowns = true,
}: Readonly<FormCalendarProps<T>>) {
  const getDisplayValue = (
    value: Date | Date[] | { from: Date; to?: Date } | undefined
  ) => {
    if (!value) return <span>{placeholder}</span>;

    if (mode === "single" && value instanceof Date) {
      return format(value, dateFormat);
    }

    if (
      mode === "range" &&
      typeof value === "object" &&
      "from" in value &&
      value.from
    ) {
      if (value.to) {
        return (
          <>
            {format(value.from, dateFormat)} - {format(value.to, dateFormat)}
          </>
        );
      }
      return format(value.from, dateFormat);
    }

    if (mode === "multiple" && Array.isArray(value) && value.length > 0) {
      const dateText = value.length > 1 ? "dates" : "date";
      return `${value.length} ${dateText} selected`;
    }

    return <span>{placeholder}</span>;
  };

  const getDisabledDates = (date: Date) => {
    const isBeforeFromDate = fromDate ? date < fromDate : false;
    const isAfterToDate = toDate ? date > toDate : false;
    return isBeforeFromDate || isAfterToDate;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const getCalendarProps = () => {
          const baseProps = {
            selected: field.value,
            onSelect: field.onChange,
            disabled: getDisabledDates,
          };

          if (mode === "single") {
            return { mode: "single" as const, ...baseProps };
          }

          if (mode === "multiple") {
            return { mode: "multiple" as const, ...baseProps };
          }

          // For range mode, we need to handle the required prop
          return {
            mode: "range" as const,
            ...baseProps,
            required: false,
          };
        };

        return (
          <FormItem className="flex flex-col">
            {label && (
              <FormLabel
                className={cn(
                  "text-font-natural text-xs font-normal",
                  classNameLabel
                )}
              >
                {label}
              </FormLabel>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="ghost"
                    disabled={disabled}
                    className={cn(
                      "placeholder:text-font-placeholder border-line hover:bg-accent-foreground flex h-10 w-full justify-start rounded-lg border-2 bg-white px-4 py-4 text-left text-sm font-normal text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                      !field.value &&
                        "text-font-placeholder hover:text-font-natural font-normal",
                      className
                    )}
                  >
                    <Icon
                      icon="cuida:calendar-outline"
                      className="text-font-primary mr-1 h-4 w-4"
                    />
                    <span className="w-full truncate">
                      {getDisplayValue(field.value)}
                    </span>
                    <ChevronDown className="text-font-primary ml-2 h-4 w-4" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto border-0 p-0 shadow-lg"
                align="start"
              >
                <Calendar
                  {...getCalendarProps()}
                  captionLayout={showMonthYearDropdowns ? "dropdown" : "label"}
                  startMonth={new Date(startYear, 0)}
                  endMonth={new Date(endYear, 11)}
                  mode="single"
                  className="min-w-[300px] rounded-md border bg-white shadow-sm"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
