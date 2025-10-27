import { StarIcon } from "@assets/icon";
import { Card, CardHeader } from "@components/atoms/card";
import { cn } from "@utils";

type CardInvoiceProps = Readonly<{
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  isEnabled?: boolean;
  href?: string;
}>;

export default function CardInvoice({
  title,
  description,
  icon,
  isEnabled = true,
  href,
}: CardInvoiceProps) {
  const baseProps = {
    disabled: !isEnabled,
    className: cn(
      "flex min-h-[264px] min-w-[264px] flex-col items-center rounded-3xl p-4 shadow-lg",
      isEnabled ? "border-destructive" : "border-none shadow-none"
    ),
  };

  return (
    <Card {...(href ? { ...baseProps, href } : baseProps)}>
      <CardHeader className="bord w-full space-y-0 p-0">
        <div className="flex w-full flex-row items-center gap-2">
          <StarIcon />
          <p className="text-font-hilight text-base">Process For</p>
        </div>
      </CardHeader>
      <div className="flex h-full w-full flex-1 flex-col items-center">
        <div className="flex h-full w-full flex-1 items-center justify-center">
          {icon}
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          <h2 className="text-font-primary text-xl font-semibold">{title}</h2>
          <p className="text-font-secondary text-center text-sm">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
