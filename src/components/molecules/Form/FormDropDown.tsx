import { Button } from "@components/atoms/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/atoms/form";
import { Input } from "@components/atoms/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/atoms/popover";
import { cn } from "@utils";
import { Check, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface DropdownOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

interface FormDropDownProps<T extends FieldValues> {
  readonly form: {
    readonly control: Control<T>;
  };
  readonly name: FieldPath<T>;
  readonly label?: string;
  readonly placeholder: string;
  readonly options: readonly DropdownOption[];
  readonly disabled?: boolean;
  readonly className?: string;
  readonly classNameLabel?: string;
  readonly searchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly maxHeight?: string;
}

export default function FormDropDown<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  disabled = false,
  className,
  classNameLabel,
  searchable = true,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  maxHeight = "200px",
}: Readonly<FormDropDownProps<T>>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  const getSelectedLabel = (value: string | number) => {
    const selectedOption = options.find(option => option.value === value);
    return selectedOption?.label || "";
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className={cn("", classNameLabel)}>{label}</FormLabel>
          )}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={disabled}
                  className={cn(
                    "placeholder:text-font-hilight border-line flex h-14 w-full justify-start rounded-2xl border bg-white px-6 py-4 text-left text-base font-semibold text-gray-900 transition-all duration-200 hover:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    !field.value && "text-font-hilight font-normal",
                    className
                  )}
                >
                  <span className="w-full truncate">
                    {field.value ? getSelectedLabel(field.value) : placeholder}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <div className="flex flex-col">
                  {searchable && (
                    <div className="flex items-center border-b p-2">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        className="placeholder:text-muted-foreground border-0 bg-transparent p-0 font-semibold placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  )}
                  <div className="overflow-y-auto" style={{ maxHeight }}>
                    {filteredOptions.length === 0 ? (
                      <div className="text-muted-foreground p-4 text-center text-sm">
                        {emptyMessage}
                      </div>
                    ) : (
                      <div className="p-1">
                        {filteredOptions.map(option => (
                          <Button
                            key={option.value}
                            variant="ghost"
                            disabled={option.disabled}
                            className={cn(
                              "hover:bg-accent hover:text-accent-foreground w-full justify-start font-normal",
                              field.value === option.value &&
                                "bg-accent text-accent-foreground"
                            )}
                            onClick={() => {
                              field.onChange(option.value);
                              setOpen(false);
                              setSearchValue("");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span className="truncate">{option.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export type { FormDropDownProps };
