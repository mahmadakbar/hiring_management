import { cn } from "@utils";

type BackgroundProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Background({
  children,
  className,
}: Readonly<BackgroundProps>) {
  return (
    <section className="flex h-full flex-1">
      <div className={cn("bg-background flex w-full flex-1 p-4", className)}>
        {children}
      </div>
    </section>
  );
}
