import { Checkbox } from "@components/atoms/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/atoms/form";
import { cn } from "@utils";

import { Control, FieldValues, Path } from "react-hook-form";

interface FormCheckboxProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  name: string;
  label?: string;
  list: { label: string; value: boolean }[];
  className?: string;
  classNameLabel?: string;
}

export default function FormCheckbox<T extends FieldValues>({
  form,
  name,
  label,
  list,
  className,
  classNameLabel,
}: Readonly<FormCheckboxProps<T>>) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {label && (
        <FormLabel className={cn("", classNameLabel)}>{label}</FormLabel>
      )}

      <div className="flex flex-col gap-2">
        {list.map((item: { label: string; value: boolean }, index: number) => (
          <FormField
            key={`-${item.label}-${index}`}
            control={form.control}
            name={`${name}.${index}.value` as Path<T>}
            render={({ field }) => {
              return (
                <FormItem
                  key={`tax-item-${item.label}-${index}`}
                  className="flex flex-row items-center gap-2 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-semibold">
                    {item.label}
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
