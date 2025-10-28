import { Card } from "@components/atoms/card";
import { Button } from "@components/atoms/button";
import { cn } from "@utils";

type CardListJobsProps = Readonly<{
  jobTitle: string;
  salaryRange: string;
  status: "active" | "inactive" | "draft";
  startedDate: string;
  onManageClick?: () => void;
  onClick?: () => void;
}>;

export default function CardListJobs({
  jobTitle,
  salaryRange,
  status,
  startedDate,
  onManageClick,
  onClick,
}: CardListJobsProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "border-accent-active text-accent bg-accent-foreground";
      case "inactive":
        return "border-destructive-active text-destructive bg-destructive-foreground";
      case "draft":
        return "border-warning-active text-warning bg-warning-foreground";
      default:
        return "border-border text-font-natural";
    }
  };

  const getStatusLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card
      className="bg-card flex w-full cursor-pointer flex-row justify-between rounded-2xl border-0 p-6 shadow-sm transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-3">
          <div
            className={cn(
              "rounded-lg border px-4 py-1.5 text-sm font-bold",
              getStatusStyles()
            )}
          >
            {getStatusLabel()}
          </div>
          <div className="rounded-sm border px-4 py-1.5 text-sm">
            started on {startedDate}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-font-primary text-lg font-bold">{jobTitle}</h3>
          <p className="text-font-tertiary text-md">{salaryRange}</p>
        </div>
      </div>

      <div className="flex items-end">
        <Button
          variant="secondary"
          size="lg"
          onClick={e => {
            e.stopPropagation();
            onManageClick?.();
          }}
          className="rounded-lg px-4 py-1 text-xs font-bold text-white"
        >
          Manage Job
        </Button>
      </div>
    </Card>
  );
}
