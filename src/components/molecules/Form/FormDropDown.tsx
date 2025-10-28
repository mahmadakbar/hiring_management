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
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@components/atoms/popover";
import { Icon } from "@iconify/react";
import { cn } from "@utils";
import { Check, ChevronDown, Search } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: JSX.Element | string;
}

interface FormDropDownProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: FieldPath<T>;
  label?: string;
  placeholder: string;
  options: DropdownOption[];
  disabled?: boolean;
  className?: string;
  classNameLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxHeight?: string;
  hasChecklist?: boolean;
  typeToSearch?: boolean;
  customOptions?: (options: DropdownOption) => JSX.Element;
  stylePopoverContent?: React.CSSProperties;
  iconLabel?: boolean;
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
  hasChecklist = false,
  typeToSearch = false,
  customOptions,
  stylePopoverContent,
  iconLabel = false,
}: Readonly<FormDropDownProps<T>>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const getSelectedLabel = (value: string | number) => {
    const selectedOption = options.find(option => option.value === value);
    if (iconLabel && selectedOption) {
      return (
        <div className="flex items-center">
          {selectedOption.icon && (
            <Icon icon={selectedOption.icon as string} className="h-5 w-5" />
          )}
        </div>
      );
    }
    return selectedOption?.label || "";
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Sync searchValue with selected value when typeToSearch is enabled
        useEffect(() => {
          if (typeToSearch) {
            if (field.value) {
              const selectedOption = options.find(
                opt => opt.value === field.value
              );
              if (selectedOption && searchValue !== selectedOption.label) {
                setSearchValue(selectedOption.label);
              }
            } else if (!open) {
              setSearchValue("");
            }
          }
        }, [field.value, open, typeToSearch]);

        return (
          <FormItem>
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
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                {typeToSearch ? (
                  // Type-to-search mode: Input field as trigger
                  <PopoverAnchor asChild>
                    <div className="relative">
                      <Input
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={e => {
                          setSearchValue(e.target.value);
                          if (!open) setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        disabled={disabled}
                        className={cn(
                          "placeholder:text-font-placeholder border-line h-10 w-full rounded-lg border-2 bg-white px-4 py-4 pr-10 text-sm font-normal text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                          className
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="absolute top-1/2 right-3 -translate-y-1/2"
                        disabled={disabled}
                        tabIndex={-1}
                      >
                        <ChevronDown className="text-font-primary h-4 w-4" />
                      </button>
                    </div>
                  </PopoverAnchor>
                ) : (
                  // Standard mode: Button trigger
                  <PopoverTrigger asChild>
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
                      <span className="w-full truncate">
                        {field.value
                          ? getSelectedLabel(field.value)
                          : placeholder}
                      </span>
                      <ChevronDown className="text-font-primary ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                )}
                <PopoverContent
                  className="p-0"
                  align="start"
                  style={{
                    width: "var(--radix-popover-trigger-width)",
                    ...stylePopoverContent,
                  }}
                  onOpenAutoFocus={e => typeToSearch && e.preventDefault()}
                >
                  {typeToSearch ? (
                    // Type-to-search mode: Same UI as standard mode
                    <div className="overflow-y-auto" style={{ maxHeight }}>
                      {options.filter(option =>
                        option.label
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      ).length === 0 ? (
                        <div className="text-font-placeholder p-4 text-center text-sm">
                          {emptyMessage}
                        </div>
                      ) : (
                        <div className="p-1">
                          {options
                            .filter(option =>
                              option.label
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                            )
                            .map(option => (
                              <Button
                                key={option.value}
                                variant="ghost"
                                disabled={option.disabled}
                                className={cn(
                                  "hover:bg-accent-foreground hover:text-font-natural w-full justify-start font-normal",
                                  field.value === option.value &&
                                    "bg-border-secondary"
                                )}
                                onClick={() => {
                                  field.onChange(option.value);
                                  setSearchValue(option.label);
                                  setOpen(false);
                                }}
                              >
                                {hasChecklist && (
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === option.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                )}
                                {customOptions ? (
                                  customOptions(option)
                                ) : (
                                  <span className="truncate text-xs font-bold">
                                    {option.label}
                                  </span>
                                )}
                              </Button>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Standard mode: Manual search with buttons
                    <div className="flex flex-col">
                      {searchable && (
                        <div className="flex items-center border-b p-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            className="placeholder:text-font-placeholder border-0 bg-transparent p-0 placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      )}
                      <div className="overflow-y-auto" style={{ maxHeight }}>
                        {options.filter(option =>
                          searchable
                            ? option.label
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                            : true
                        ).length === 0 ? (
                          <div className="text-font-placeholder p-4 text-center text-sm">
                            {emptyMessage}
                          </div>
                        ) : (
                          <div className="p-1">
                            {options
                              .filter(option =>
                                searchable
                                  ? option.label
                                      .toLowerCase()
                                      .includes(searchValue.toLowerCase())
                                  : true
                              )
                              .map(option => (
                                <Button
                                  key={option.value}
                                  variant="ghost"
                                  disabled={option.disabled}
                                  className={cn(
                                    "hover:bg-accent-foreground hover:text-font-natural w-full justify-start font-normal",
                                    field.value === option.value &&
                                      "bg-border-secondary"
                                  )}
                                  onClick={() => {
                                    field.onChange(option.value);
                                    setOpen(false);
                                    setSearchValue("");
                                  }}
                                >
                                  {hasChecklist && (
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === option.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  )}
                                  {customOptions ? (
                                    customOptions(option)
                                  ) : (
                                    <span className="truncate text-xs font-bold">
                                      {option.label}
                                    </span>
                                  )}
                                </Button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export type { FormDropDownProps };
